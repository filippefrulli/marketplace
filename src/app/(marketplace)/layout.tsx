import { Navbar } from "@/components/layout/navbar";
import { CategoryBar } from "@/components/layout/category-bar";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CategoryBar />
      {children}
    </>
  );
}
