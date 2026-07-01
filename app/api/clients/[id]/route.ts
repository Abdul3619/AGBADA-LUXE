import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateClientSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional().nullable(),
  phone: z.string().min(5, "Phone number is too short").optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  userId: z.string().uuid().optional().nullable(),
});

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Simulated retrieval from PostgreSQL
    const mockClient = {
      id,
      userId: "913b860b-8d4e-4f3d-9d41-e94ba7a3d902",
      fullName: "Abdulwahab Abdullah",
      email: "abdulwahababdullah3619@gmail.com",
      phone: "+234 809 123 4567",
      address: "No 15 Victoria Island, Lagos, Nigeria",
      notes: "Prefers heavy hand-spun silk blend Aso-Oke with geometric gold threading",
      createdAt: "2026-06-28T12:00:00Z"
    };

    return NextResponse.json({ data: mockClient });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const validation = updateClientSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedClient = {
      id,
      fullName: "Abdulwahab Abdullah",
      email: "abdulwahababdullah3619@gmail.com",
      phone: "+234 809 123 4567",
      address: "No 15 Victoria Island, Lagos, Nigeria",
      notes: "Prefers heavy hand-spun silk blend Aso-Oke with geometric gold threading",
      createdAt: "2026-06-28T12:00:00Z",
      ...validation.data
    };

    return NextResponse.json({
      message: "Client database record updated successfully.",
      data: updatedClient
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
