import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

const CLOUD_DB_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a19cfb2f361157";
const DATA_FILE = path.join(process.cwd(), "src", "data", "offers.json");

// 1. Vercel Blob Helpers (Active when user connects Blob in Vercel)
async function getFromBlob(): Promise<any[] | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: "cafe7-offers.json" });
    if (blobs && blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.filter((o: any) => o && o.id !== "offer-1" && o.id !== "offer-2");
        }
      }
    }
    return [];
  } catch (err) {
    console.warn("Vercel Blob read error:", err);
    return null;
  }
}

async function saveToBlob(offers: any[]): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  try {
    const clean = offers.filter((o: any) => o && o.id !== "offer-1" && o.id !== "offer-2");
    await put("cafe7-offers.json", JSON.stringify(clean), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return true;
  } catch (err) {
    console.error("Vercel Blob save error:", err);
    return false;
  }
}

// 2. Cloud DB Helpers
async function getCloudOffers(): Promise<any[]> {
  // Check Vercel Blob first
  const blobOffers = await getFromBlob();
  if (blobOffers !== null) {
    return blobOffers;
  }

  // Cloud DB fallback
  try {
    const res = await fetch(CLOUD_DB_URL, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.offers;
      if (Array.isArray(list)) {
        return list.filter((o: any) => o && o.id !== "offer-1" && o.id !== "offer-2");
      }
    }
  } catch (err) {
    console.warn("Could not read from cloud DB, trying local fallback:", err);
  }

  // Local file fallback
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const list = JSON.parse(data || "[]");
      return Array.isArray(list)
        ? list.filter((o: any) => o && o.id !== "offer-1" && o.id !== "offer-2")
        : [];
    }
  } catch {
    // fallback
  }

  return [];
}

async function saveCloudOffers(offers: any[]): Promise<any[]> {
  const clean = offers.filter((o: any) => o && o.id !== "offer-1" && o.id !== "offer-2");

  // Save to Vercel Blob if available
  await saveToBlob(clean);

  // Always sync to Cloud DB
  try {
    const res = await fetch(CLOUD_DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "cafe7_database",
        data: { offers: clean },
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data?.offers)) {
        return json.data.offers;
      }
    }
  } catch (err) {
    console.error("Failed to write to cloud DB:", err);
  }

  // Try local file as well
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(clean, null, 2), "utf-8");
  } catch {
    // ignore
  }

  return clean;
}

// GET /api/offers
export async function GET() {
  const offers = await getCloudOffers();
  return NextResponse.json(offers, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

// POST /api/offers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.offers && Array.isArray(body.offers)) {
      const saved = await saveCloudOffers(body.offers);
      return NextResponse.json({ success: true, offers: saved });
    }

    if (!body.title || !body.image) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    const current = await getCloudOffers();
    const newOffer = {
      id: body.id || `offer-${Date.now()}`,
      title: body.title,
      description: body.description || "",
      image: body.image,
      badge: body.badge || undefined,
      validTill: body.validTill || undefined,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const updated = [newOffer, ...current.filter((o) => o.id !== newOffer.id)];
    const saved = await saveCloudOffers(updated);

    return NextResponse.json({ success: true, offer: newOffer, offers: saved });
  } catch (err: any) {
    console.error("POST /api/offers error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save offer" },
      { status: 500 }
    );
  }
}

// DELETE /api/offers
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // body might be empty
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Offer ID is required for deletion" },
        { status: 400 }
      );
    }

    let updated: any[] = [];
    if (id === "ALL") {
      updated = await saveCloudOffers([]);
    } else {
      const current = await getCloudOffers();
      updated = await saveCloudOffers(current.filter((o) => o.id !== id));
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
      remainingCount: updated.length,
      offers: updated,
    });
  } catch (err: any) {
    console.error("DELETE /api/offers error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete offer" },
      { status: 500 }
    );
  }
}
