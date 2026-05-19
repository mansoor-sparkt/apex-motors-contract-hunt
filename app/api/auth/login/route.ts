import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1. FAKE DELAY (Remove this later)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. FAKE LOGIC: If email is "alex@school.edu", pretend they exist
    if (email === "alex@school.edu") {
      return NextResponse.json({ isNewUser: false });
    }
    return NextResponse.json({ isNewUser: true });

    /* // === LATER: THE REAL EXTERNAL API CALL ===
    const res = await fetch("https://external-api.com/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EXTERNAL_API_SECRET_KEY}`
      },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    return NextResponse.json(data);
    */
  } catch (error) {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
