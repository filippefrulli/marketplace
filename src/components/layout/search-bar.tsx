"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense } from "react";

function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
    if (!value) { router.push("/"); return; }
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") router.push("/");
  }

  return (
    <form key={q} onSubmit={handleSubmit} className="flex w-full items-center rounded-full border border-gray-200 bg-gray-50 focus-within:border-gray-400 focus-within:bg-white transition-colors">
      <Search size={14} className="pointer-events-none ml-3 shrink-0 text-gray-400" />
      <input
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Search listings…"
        onChange={handleChange}
        className="min-w-0 flex-1 bg-transparent py-1.5 pl-2 pr-1 text-sm placeholder:text-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="mr-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-gray-700"
      >
        Search
      </button>
    </form>
  );
}

const fallback = (
  <div className="flex w-full items-center rounded-full border border-gray-200 bg-gray-50">
    <Search size={14} className="ml-3 shrink-0 text-gray-400" />
    <div className="flex-1 py-1.5 pl-2 pr-1 text-sm text-gray-400">Search listings…</div>
    <div className="mr-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">Search</div>
  </div>
);

export function SearchBar() {
  return <Suspense fallback={fallback}><SearchInput /></Suspense>;
}
