import type { Metadata } from "next";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export const metadata: Metadata = { title: "Sign in" };

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Sign-in failed. Please try again.",
  auth_failed: "Authentication failed. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-gray-500">to continue to Artcraft Marketplace</p>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {ERROR_MESSAGES[error] ?? "Something went wrong. Please try again."}
          </p>
        )}

        <GoogleSignInButton />
      </div>
    </main>
  );
}
