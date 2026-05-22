import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    // 1. FAKE DELAY (Remove this later)
    // await new Promise((resolve) => setTimeout(resolve, 800));

    // // 2. FAKE LOGIC: If email is "alex@school.edu", pretend they exist
    // if (email === "alex@school.edu") {
    //   return NextResponse.json({ isNewUser: false });
    // }
    // return NextResponse.json({ isNewUser: true });

    const externalApiPayload = {
      emailId: email,
    };

    // === LATER: THE REAL EXTERNAL API CALL ===
    const res = await fetch(
      "https://phillipsx-content-dev.azurewebsites.net/api/Login/SendOTP",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.EXTERNAL_API_SECRET_KEY}`,
        },
        body: JSON.stringify(externalApiPayload),
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status },
      );
    }

    const data = await res.json();
    if (data.statusCode === 200 && data.result) {
      return NextResponse.json({
        success: true,
        isNewUser: data.result.isNewUser, // Extract the exact boolean
        message: data.message?.[0] || "Success",
      });
    } else {
      // If the API returned 200 but threw a business error (e.g., rate limited)
      return NextResponse.json(
        {
          success: false,
          error: data.errors?.[0] || "Unknown error occurred",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
