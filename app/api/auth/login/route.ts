import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Simulate Supabase Authentication flow:
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    // Simulating roles based on specific email domains or mock parameters
    const mockRole = email.includes("admin") ? "admin" : email.includes("tailor") ? "tailor" : "client";
    const mockUserId = "usr_" + Math.random().toString(36).substr(2, 9);

    return NextResponse.json(
      {
        message: "Authentication successful.",
        session: {
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockSessionToken",
          expiresIn: 3600,
          user: {
            id: mockUserId,
            email,
            role: mockRole,
            fullName: email.split("@")[0].toUpperCase(),
            createdAt: new Date().toISOString()
          }
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
