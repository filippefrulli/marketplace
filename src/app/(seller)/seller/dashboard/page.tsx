import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CopyShopLink } from "@/components/seller/copy-shop-link";
import { Clock, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Seller Dashboard" };

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/seller/dashboard");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      seller: {
        include: {
          _count: { select: { listings: true } },
        },
      },
    },
  });

  if (!dbUser?.seller) redirect("/seller/onboarding");

  const { seller } = dbUser;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {seller.status === "PENDING" && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <Clock size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold text-amber-900">Your shop is pending review</p>
            <p className="mt-0.5 text-sm text-amber-700">
              We're reviewing your verification materials to confirm you're an EU-based maker.
              This typically takes 1–3 business days. We'll notify you once your shop is approved.
            </p>
          </div>
        </div>
      )}

      {seller.status === "REJECTED" && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
          <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-900">Your shop application was not approved</p>
            <p className="mt-0.5 text-sm text-red-700">
              Unfortunately we were unable to verify your shop at this time. Please contact us if you have questions.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{seller.shopName}</h1>
        <div className="mt-4 flex items-center gap-3">
          <CopyShopLink slug={seller.slug} />
          {seller.status === "ACTIVE" && (
            <>
              <Link
                href="/seller/profile"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit profile
              </Link>
              <Link
                href="/seller/listings/new"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                New listing
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-3xl font-bold">{seller._count.listings}</p>
          <p className="mt-1 text-sm text-gray-500">Listings</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-3xl font-bold">0</p>
          <p className="mt-1 text-sm text-gray-500">Orders</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-3xl font-bold">€0</p>
          <p className="mt-1 text-sm text-gray-500">Revenue</p>
        </div>
      </div>

      {/* Empty state */}
      {seller._count.listings === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">You have no listings yet.</p>
          {seller.status === "ACTIVE" && (
            <Link
              href="/seller/listings/new"
              className="mt-4 inline-block text-sm font-medium text-gray-900 underline underline-offset-4"
            >
              Create your first listing
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
