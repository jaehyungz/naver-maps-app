import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const response = await fetch(
      "https://stay-dev.epsd.co.kr/api/v1/units/?start_date=2025-07-10&end_date=2025-07-23&is_pet=false&is_multi_bed=false&page=1&pagesize=9"
    );

    const data = await response.json();

    return Response.json({ error: "error" }, { status: 400 });

    return Response.json({
      ok: true,
      data,
    });
  } catch (err: any) {
    const message = err.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
