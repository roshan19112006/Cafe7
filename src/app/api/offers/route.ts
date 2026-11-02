import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "offers.json");

function readOffersFromFile(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading offers.json:", err);
    return [];
  }
}

function writeOffersToFile(offers: any[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(offers, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing offers.json:", err);
    return false;
  }
}

// GET /api/offers
export async function GET() {
  const offers = readOffersFromFile();
  return NextResponse.json(offers, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

// POST /api/offers - Add a new offer or replace all offers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.offers && Array.isArray(body.offers)) {
      writeOffersToFile(body.offers);
      return NextResponse.json({ success: true, offers: body.offers });
    }

    if (!body.title || !body.image) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    const current = readOffersFromFile();
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
    writeOffersToFile(updated);

    return NextResponse.json({ success: true, offer: newOffer, offers: updated });
  } catch (err: any) {
    console.error("POST /api/offers error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save offer" },
      { status: 500 }
    );
  }
}

// DELETE /api/offers - Delete by ID or delete all
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
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
      updated = [];
      writeOffersToFile([]);
    } else {
      const current = readOffersFromFile();
      updated = current.filter((o) => o.id !== id);
      writeOffersToFile(updated);
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
