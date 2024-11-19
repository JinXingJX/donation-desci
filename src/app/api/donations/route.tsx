import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { PublicKey } from "@solana/web3.js";
import { validateJWT } from "@/lib/auth";

// 创建新的捐赠记录
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      transactionSignature,
      ownerPubkey,
      recipientPubkey,
      totalAmount,
      intervalAmount,
      intervalSeconds,
      startTime,
      donorName,
      donorTwitter,
      usdValue,
    } = body;

    // 验证输入
    if (!ownerPubkey || !recipientPubkey || !totalAmount || !intervalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 验证公钥格式
    try {
      new PublicKey(ownerPubkey);
      new PublicKey(recipientPubkey);
    } catch {
      return NextResponse.json(
        { error: "Invalid public key format" },
        { status: 400 },
      );
    }

    // 插入数据库
    const result = await sql`
      INSERT INTO donations (
        transaction_signature,
        owner_pubkey,
        recipient_pubkey,
        total_amount,
        interval_amount,
        interval_seconds,
        start_time,
        donor_name,
        donor_twitter,
        usd_value,
        status,
        claimed_amount
      ) VALUES (
        ${transactionSignature},
        ${ownerPubkey},
        ${recipientPubkey},
        ${totalAmount},
        ${intervalAmount},
        ${intervalSeconds},
        ${new Date(startTime).toISOString()},
        ${donorName},
        ${donorTwitter},
        ${usdValue},
        'active',
        0
      )
      RETURNING id, created_at
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 },
    );
  }
}

// 获取捐赠列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipient = searchParams.get("recipient");
    const owner = searchParams.get("owner");
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") ?? "50");

    let query = `
      SELECT
        d.*,
        r.name as recipient_name,
        r.image as recipient_image
      FROM donations d
      JOIN recipients r ON d.recipient_pubkey = r.pubkey
      WHERE 1=1
    `;
    const params: any[] = [];

    if (recipient) {
      params.push(recipient);
      query += ` AND d.recipient_pubkey = $${params.length}`;
    }

    if (owner) {
      params.push(owner);
      query += ` AND d.owner_pubkey = $${params.length}`;
    }

    if (cursor) {
      params.push(cursor);
      query += ` AND d.id < $${params.length}`;
    }

    query += ` ORDER BY d.created_at DESC LIMIT ${limit + 1}`;

    const result = await sql.query(query, params);
    const donations = result.rows.slice(0, limit);
    const hasMore = result.rows.length > limit;

    return NextResponse.json({ donations, hasMore });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 },
    );
  }
}
// 更新捐赠状态
export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE donations
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to update donation" },
      { status: 500 },
    );
  }
}
