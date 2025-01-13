import { NextRequest, NextResponse } from "next/server";
import { categories } from "@/data/Home"; // assuming you are importing categories from a data file

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const id = params.id; // Directly access the id from params without awaiting it

    // Find the category from the imported categories list
    const category = categories.find((cat) => cat.id === id);

    if (!category) {
        return NextResponse.json(
            { error: "Category not found" },
            { status: 404 }
        );
    }

    const res = await fetch(
        `http://localhost:8080/category/${category.name}?limit=${limit || ""}`
    );

    if (!res.ok) {
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }

    const data = await res.json();
    return NextResponse.json({ data });
}
