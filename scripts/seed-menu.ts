/**
 * Migration script: Seed the Supabase database with existing hardcoded menu data.
 *
 * Usage:
 *   npx tsx scripts/seed-menu.ts
 *
 * Prerequisites:
 *   - .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 *   - Supabase tables created (see schema below)
 *   - Service role key or anon key with INSERT permissions
 */

import { createClient } from "@supabase/supabase-js";
import { cafeMenu } from "../src/data/cafeMenu.js";
import { restaurantMenu } from "../src/data/restaurantMenu.js";

// Load env from .env file
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(import.meta.dirname ?? ".", "..", ".env");
const envContent = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx > 0) {
    env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
}

const supabaseUrl = env.VITE_SUPABASE_URL;
// Use service_role key for seeding (bypasses RLS)
const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "⚠️  Using anon key — RLS may block inserts. Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

type MenuSection = {
  category: string;
  local?: string;
  items: {
    name: string;
    local?: string;
    description?: string;
    price: number;
  }[];
};

async function seedMenu(type: "cafe" | "restaurant", menu: MenuSection[]): Promise<void> {
  console.log(`\nSeeding ${type} menu...`);

  for (let sectionIdx = 0; sectionIdx < menu.length; sectionIdx++) {
    const section = menu[sectionIdx]!;

    // Insert section
    const { data: sectionData, error: sectionError } = await supabase
      .from("sections")
      .insert({
        type,
        name_en: section.category,
        name_am: section.local ?? null,
        sort_order: sectionIdx,
      })
      .select("id")
      .single();

    if (sectionError) {
      console.error(`  Error inserting section "${section.category}":`, sectionError);
      continue;
    }

    console.log(`  ✓ Section: ${section.category} (${section.items.length} items)`);

    // Insert items
    for (let itemIdx = 0; itemIdx < section.items.length; itemIdx++) {
      const item = section.items[itemIdx]!;

      const { error: itemError } = await supabase.from("menu_items").insert({
        section_id: sectionData.id,
        name_en: item.name,
        name_am: item.local ?? null,
        description_en: item.description ?? null,
        description_am: null,
        price: item.price,
        sort_order: itemIdx,
        available: true,
      });

      if (itemError) {
        console.error(`    Error inserting item "${item.name}":`, itemError);
      }
    }

    console.log(`    ✓ ${section.items.length} items inserted`);
  }
}

async function main(): Promise<void> {
  console.log("=== Melala Menu Migration ===\n");

  await seedMenu("cafe", cafeMenu);
  await seedMenu("restaurant", restaurantMenu);

  console.log("\n=== Migration complete! ===");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
