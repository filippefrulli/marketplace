import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

async function getParticipant(supabaseId: string) {
  return prisma.user.findUnique({
    where: { supabaseId },
    select: { id: true, seller: { select: { id: true } } },
  });
}

async function checkAccess(conversationId: string, dbUser: { id: string; seller: { id: string } | null }) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { buyerId: true, sellerId: true },
  });
  if (!conversation) return null;
  const isParticipant =
    conversation.buyerId === dbUser.id ||
    (dbUser.seller && conversation.sellerId === dbUser.seller.id);
  return isParticipant ? conversation : null;
}

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await getParticipant(user.id);
  if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversation = await checkAccess(id, dbUser);
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      body: true,
      senderId: true,
      createdAt: true,
      readAt: true,
    },
  });

  return NextResponse.json({ messages, currentUserId: dbUser.id });
}

export async function POST(request: Request, { params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await getParticipant(user.id);
  if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversation = await checkAccess(id, dbUser);
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { body } = await request.json();
  if (!body?.trim()) return NextResponse.json({ error: "Message body required" }, { status: 400 });

  const message = await prisma.message.create({
    data: { conversationId: id, senderId: dbUser.id, body: body.trim() },
    select: { id: true, body: true, senderId: true, createdAt: true, readAt: true },
  });

  await prisma.conversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ message });
}
