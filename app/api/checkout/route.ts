export async function POST(request: Request) {
  const apiBaseUrl = (process.env.PRODUCT_API_URL ?? "http://localhost:8080").replace(
    /\/$/,
    ""
  );

  try {
    const apiResponse = await fetch(`${apiBaseUrl}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });

    return new Response(await apiResponse.text(), {
      status: apiResponse.status,
      headers: {
        "Content-Type": apiResponse.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "เชื่อมต่อ API ไม่ได้ ตรวจสอบ API ที่ localhost:8080" },
      { status: 503 }
    );
  }
}
