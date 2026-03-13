export interface OBFProduct {
  code: string;
  product_name: string;
  brands: string;
  categories: string;
  image_url: string;
  ingredients_text: string;
}

const API_SOURCES = [
  "https://world.openbeautyfacts.org/api/v0/product",
  "https://world.openfoodfacts.org/api/v0/product",
  "https://world.openproductsfacts.org/api/v0/product",
];

export async function searchByBarcode(barcode: string): Promise<OBFProduct | null> {
  for (const baseUrl of API_SOURCES) {
    try {
      const res = await fetch(`${baseUrl}/${barcode}.json`);
      const data = await res.json();

      if (data.status !== 1 || !data.product) continue;

      const p = data.product;
      const name = p.product_name || p.product_name_en || p.product_name_tr || "";
      if (!name) continue;

      return {
        code: barcode,
        product_name: name,
        brands: p.brands || "",
        categories: p.categories || "",
        image_url: p.image_url || p.image_front_url || "",
        ingredients_text: p.ingredients_text || p.ingredients_text_en || p.ingredients_text_tr || "",
      };
    } catch {
      continue;
    }
  }
  return null;
}

export function parseIngredients(text: string): string[] {
  return text
    .split(/[,;]/)
    .map((i) => i.trim())
    .filter((i) => i.length > 0)
    .map((i) => i.replace(/\s*\(.*?\)\s*/g, "").trim());
}
