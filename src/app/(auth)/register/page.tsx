import type { Metadata } from "next";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import Link from "next/link";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-sm text-gray-500">Join thousands of European artisans</p>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            Something went wrong. Please try again.
          </p>
        )}

        <GoogleSignInButton />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gray-900 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
