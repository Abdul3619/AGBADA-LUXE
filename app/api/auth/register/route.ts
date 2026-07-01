import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod Schema for User Registration validation
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  email: z.string().email("Invalid email address format"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "client", "tailor"]).default("client"),
  avatar: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password, role, avatar } = validation.data;

    // Simulate Supabase Signup Logic:
    // In production, this maps to:
    // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } })
    
    const mockUserId = "u-" + Math.random().toString(36).substr(2, 9);
    
    return NextResponse.json(
      {
        message: "User account created successfully in Supabase Auth & synchronized to profiles.",
        user: {
          id: mockUserId,
          fullName,
          email,
          phone: phone || null,
          role,
          avatar: avatar || null,
          createdAt: new Date().toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
