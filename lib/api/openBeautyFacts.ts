export interface OBFProduct {
  code: string;
  product_name: string;
  brands: string;
  categories: string;
  image_url: string;
  ingredients_text: string;
}

export async function searchByBarcode(barcode: string): Promise<OBFProduct | null> {
  try {
    const res = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();

    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    return {
      code: barcode,
      product_name: p.product_name || p.product_name_en || "",
      brands: p.brands || "",
      categories: p.categories || "",
      image_url: p.image_url || p.image_front_url || "",
      ingredients_text: p.ingredients_text || p.ingredients_text_en || "",
    };
  } catch {
    return null;
  }
}

export function parseIngredients(text: string): string[] {
  return text
    .split(/[,;]/)
    .map((i) => i.trim())
    .filter((i) => i.length > 0)
    .map((i) => i.replace(/\s*\(.*?\)\s*/g, "").trim());
}
