import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createClientSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format").optional().nullable(),
  phone: z.string().min(5, "Phone number is too short").optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  userId: z.string().uuid().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    // Simulate pagination & role gating
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const search = searchParams.get("search") || "";

    // Simulated payload of client profiles from PostgreSQL
    const mockClients = [
      {
        id: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
        userId: "913b860b-8d4e-4f3d-9d41-e94ba7a3d902",
        fullName: "Abdulwahab Abdullah",
        email: "abdulwahababdullah3619@gmail.com",
        phone: "+234 809 123 4567",
        address: "No 15 Victoria Island, Lagos, Nigeria",
        notes: "Prefers heavy hand-spun silk blend Aso-Oke with geometric gold threading",
        createdAt: "2026-06-28T12:00:00Z"
      },
      {
        id: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
        userId: null,
        fullName: "Sarah Jenkins",
        email: "sarah.j@luxury-mail.com",
        phone: "+44 7700 900077",
        address: "Apt 4B, 12 Savile Row, London, UK",
        notes: "Interested in SS24 double-breasted suits with relaxed drape",
        createdAt: "2026-06-29T10:15:00Z"
      }
    ];

    // Filter simulation
    const filteredClients = mockClients.filter(c => 
      c.fullName.toLowerCase().includes(search.toLowerCase()) || 
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );

    return NextResponse.json({
      data: filteredClients.slice(offset, offset + limit),
      meta: {
        total: filteredClients.length,
        limit,
        offset
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createClientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newClient = {
      id: crypto.randomUUID(),
      ...validation.data,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(
      {
        message: "Client profile successfully compiled in database ledger.",
        data: newClient
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
