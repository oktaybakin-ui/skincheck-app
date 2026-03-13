import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Trigger the scrape endpoint
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
    "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/deals/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {}),
      },
    });

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      triggered_at: new Date().toISOString(),
      scrape_result: data,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to trigger scrape",
      },
      { status: 500 }
    );
  }
}
