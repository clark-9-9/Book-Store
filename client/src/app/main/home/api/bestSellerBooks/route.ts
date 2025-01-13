export async function GET() {
    const res = await fetch(`http://localhost:8080/best-seller`);
    const data = await res.json();
    return Response.json({ data });
}
