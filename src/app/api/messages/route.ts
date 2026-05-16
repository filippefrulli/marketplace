import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { id: true },
  });
  if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sellerId } = await request.json();
  if (!sellerId) return NextResponse.json({ error: "sellerId required" }, { status: 400 });

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { id: sellerId },
    select: { id: true, userId: true },
  });
  if (!sellerProfile) return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  if (sellerProfile.userId === dbUser.id) {
    return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
  }

  const conversation = await prisma.conversation.upsert({
    where: { buyerId_sellerId: { buyerId: dbUser.id, sellerId } },
    create: { buyerId: dbUser.id, sellerId },
    update: {},
    select: { id: true },
  });

  return NextResponse.json({ id: conversation.id });
}
