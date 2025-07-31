import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    return Response.json({
      ok: true,
      data: {
        id,
        name: `매물 ${id}호`,
      },
    });
  } catch (err: any) {
    const message = err.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
