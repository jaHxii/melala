/**
 * Seed/migrate the Supabase database from the bundled hardcoded menu data.
 *
 * Usage:
 *   npx tsx scripts/seed-menu.ts                 # upsert (safe to re-run)
 *   npx tsx scripts/seed-menu.ts --reset         # wipe + reseed the menu
 *   npx tsx scripts/seed-menu.ts --dry-run       # show what WOULD change
 *   npx tsx scripts/seed-menu.ts --type=cafe     # only the cafe menu
 *
 * Prerequisites:
 *   - .env with VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY
 *     (falls back to the anon key, which only works if RLS allows writes)
 *   - Tables + RLS applied (see supabase/migrations/)
 *
 * Upsert semantics (without --reset):
 *   - Sections are matched by (type, name_en): existing rows are updated,
 *     missing rows are inserted.
 *   - Items are matched by (section, name_en): existing rows are updated
 *     (price/descriptions/name_am), missing rows are inserted. `available`
 *     is NEVER flipped to true on an existing hidden item — hiding items is
 *     an intentional admin action we don't override.
 */

import { createClient } from "@supabase/supabase-js";
import { cafeMenu } from "../src/data/cafeMenu.js";
import { restaurantMenu } from "../src/data/restaurantMenu.js";

// Load env from .env file (plain parser so this runs without dotenv)
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(import.meta.dirname ?? ".", "..", ".env");
const env: Record<string, string> = {};
try {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
} catch {
  console.error(`Missing ${envPath} — copy .env.example to .env first.`);
  process.exit(1);
}

const supabaseUrl = env.VITE_SUPABASE_URL;
// Prefer the service role key for seeding (bypasses RLS)
const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or a key in .env (see .env.example).");
  process.exit(1);
}
if (!env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "⚠️  Using the anon key — RLS may block writes. Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env",
  );
}

const flags = new Set(process.argv.slice(2));
const reset = flags.has("--reset");
const dryRun = flags.has("--dry-run");
const onlyType = process.argv.find((a) => a.startsWith("--type="))?.slice("--type=".length) as
  "cafe" | "restaurant" | undefined;
if (onlyType && onlyType !== "cafe" && onlyType !== "restaurant") {
  console.error(`Unknown --type "${onlyType}" — use cafe or restaurant.`);
  process.exit(1);
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

let planInserts = 0;
let planUpdates = 0;

async function resetType(type: "cafe" | "restaurant"): Promise<void> {
  const { data: sections } = await supabase.from("sections").select("id").eq("type", type);
  const ids = (sections ?? []).map((s) => s.id);
  if (ids.length === 0) return;
  if (dryRun) {
    console.log(`  [dry-run] would delete ${ids.length} ${type} section(s) + their items`);
    return;
  }
  const { error } = await supabase.from("sections").delete().in("id", ids);
  if (error) throw new Error(`Failed to reset ${type}: ${error.message}`);
  console.log(`  ✓ reset ${type}: removed ${ids.length} section(s)`);
}

async function seedMenu(type: "cafe" | "restaurant", menu: MenuSection[]): Promise<void> {
  console.log(`\nSeeding ${type} menu…`);
  if (reset) await resetType(type);

  for (let sectionIdx = 0; sectionIdx < menu.length; sectionIdx++) {
    const section = menu[sectionIdx]!;

    // Look up the section by (type, name_en)
    const { data: existingSection } = await supabase
      .from("sections")
      .select("id, name_am, sort_order")
      .eq("type", type)
      .eq("name_en", section.category)
      .maybeSingle();

    let sectionId: string;
    if (existingSection) {
      sectionId = existingSection.id;
      planUpdates += 1;
      console.log(`  ~ Section exists: ${section.category}`);
      if (!dryRun) {
        const { error } = await supabase
          .from("sections")
          .update({ name_am: section.local ?? null, sort_order: sectionIdx })
          .eq("id", sectionId);
        if (error) throw new Error(`Failed updating section ${section.category}: ${error.message}`);
      }
    } else {
      planInserts += 1;
      console.log(`  + New section: ${section.category}`);
      if (dryRun) {
        sectionId = "dry-run";
      } else {
        const { data, error } = await supabase
          .from("sections")
          .insert({
            type,
            name_en: section.category,
            name_am: section.local ?? null,
            sort_order: sectionIdx,
          })
          .select("id")
          .single();
        if (error)
          throw new Error(`Failed inserting section ${section.category}: ${error.message}`);
        sectionId = data!.id;
      }
    }

    if (dryRun) continue;

    // Get existing items so we can match by name and preserve `available`
    const { data: existingItems } = await supabase
      .from("menu_items")
      .select("id, name_en, available, sort_order")
      .eq("section_id", sectionId)
      .order("sort_order", { ascending: true });

    const existing = new Map((existingItems ?? []).map((i) => [i.name_en, i]));

    for (let itemIdx = 0; itemIdx < section.items.length; itemIdx++) {
      const item = section.items[itemIdx]!;
      const match = existing.get(item.name);

      if (match) {
        planUpdates += 1;
        const { error } = await supabase
          .from("menu_items")
          .update({
            name_am: item.local ?? null,
            description_en: item.description ?? null,
            price: item.price,
            sort_order: itemIdx,
            // available intentionally left unchanged
          })
          .eq("id", match.id);
        if (error) throw new Error(`Failed updating item "${item.name}": ${error.message}`);
      } else {
        planInserts += 1;
        const { error } = await supabase.from("menu_items").insert({
          section_id: sectionId,
          name_en: item.name,
          name_am: item.local ?? null,
          description_en: item.description ?? null,
          description_am: null,
          price: item.price,
          sort_order: itemIdx,
          available: true,
        });
        if (error) throw new Error(`Failed inserting item "${item.name}": ${error.message}`);
      }
    }
    console.log(`  ✓ ${section.category}: ${section.items.length} item(s) reconciled`);
  }
}

async function main(): Promise<void> {
  console.log(
    `=== Melala Menu ${reset ? "reset & " : ""}seed === (${dryRun ? "DRY RUN — no writes" : "live"})`,
  );

  if (onlyType && onlyType === "cafe") await seedMenu("cafe", cafeMenu);
  else if (onlyType && onlyType === "restaurant") await seedMenu("restaurant", restaurantMenu);
  else {
    await seedMenu("cafe", cafeMenu);
    await seedMenu("restaurant", restaurantMenu);
  }

  console.log(
    `\n=== Done. ${dryRun ? "WOULD" : "Did"} insert ${planInserts} row(s), update ${planUpdates} row(s). ===`,
  );
}

main().catch((err) => {
  console.error("Migration failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
