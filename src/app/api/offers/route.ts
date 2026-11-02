import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CLOUD_DB_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a19cfb2f361157";
const DATA_FILE = path.join(process.cwd(), "src", "data", "offers.json");

// Helper to read from local file fallback
function readLocalFallback(): any[] {
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

// Helper to write to local file fallback
function writeLocalFallback(offers: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const clean = offers.filter((o: any) => o && o.id !== "offer-1" && o.id !== "offer-2");
    fs.writeFileSync(DATA_FILE, JSON.stringify(clean, null, 2), "utf-8");
  } catch {
    // ignore on readonly filesystem like Vercel
  }
}

// Read offers from Cloud DB with local fallback
async function getCloudOffers(): Promise<any[]> {
  try {
    const res = await fetch(CLOUD_DB_URL, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
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
  return readLocalFallback();
}

// Save offers to Cloud DB with local fallback
async function saveCloudOffers(offers: any[]): Promise<any[]> {
  const clean = offers.filter((o: any) => o && o.id !== "offer-1" && o.id !== "offer-2");
  writeLocalFallback(clean);

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
