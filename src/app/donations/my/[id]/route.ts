import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { validateJWT } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const id = searchParams.get("id");

    if (!owner) {
      return NextResponse.json({ error: "Owner is required" }, { status: 400 });
    }

    let query = `
      SELECT d.*,
        r.name as recipient_name,
        r.image as recipient_image
      FROM donations d
      JOIN recipients r ON d.recipient_pubkey = r.pubkey
      WHERE d.owner_pubkey = $1
    `;
    const params: any[] = [owner];

    if (id) {
      query += " AND d.id = $2";
      params.push(id);
    }

    query += " ORDER BY d.created_at DESC";

    const result = await sql.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 },
    );
  }
}
