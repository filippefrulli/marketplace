import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const CATEGORIES = [
  { name: "Art & Prints",     slug: "art-prints",      description: "Paintings, drawings, illustrations, photography and prints" },
  { name: "Jewelry",          slug: "jewelry",          description: "Handmade rings, necklaces, earrings and bracelets" },
  { name: "Home & Living",    slug: "home-living",      description: "Ceramics, candles, textiles and home decor" },
  { name: "Clothing",         slug: "clothing",         description: "Handmade garments, knitwear and embroidery" },
  { name: "Accessories",      slug: "accessories",      description: "Handmade bags, scarves, hats and belts" },
  { name: "Stationery",       slug: "stationery",       description: "Cards, notebooks, gift wrap and planners" },
  { name: "Toys & Play",      slug: "toys-play",        description: "Handmade toys, plushies, puzzles and games" },
  { name: "Food & Drink",     slug: "food-drink",       description: "Artisan preserves, baked goods, teas and honey" },
  { name: "Craft Supplies",   slug: "craft-supplies",   description: "Yarn, fabric, tools and materials for makers" },
  { name: "Vintage",          slug: "vintage",          description: "Vintage items, antiques and pre-loved pieces" },
];

async function main() {
  console.log("Seeding categories…");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    console.log(`  ✓ ${cat.name}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
