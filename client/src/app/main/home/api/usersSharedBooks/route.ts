import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "1000";

    const res = await fetch(
        `http://localhost:8080/users-shared-books?limit=${limit}`
    );
    const data = await res.json();
    return Response.json({ data });
}
