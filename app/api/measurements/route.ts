import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createMeasurementSchema = z.object({
  clientId: z.string().uuid("Invalid client UUID"),
  type: z.string().min(2, "Type of garment is required"),
  notes: z.string().optional().nullable(),
  data: z.object({
    chest: z.union([z.string(), z.number()]).optional(),
    waist: z.union([z.string(), z.number()]).optional(),
    sleeve: z.union([z.string(), z.number()]).optional(),
    shoulder: z.union([z.string(), z.number()]).optional(),
    length: z.union([z.string(), z.number()]).optional(),
    neck: z.union([z.string(), z.number()]).optional(),
    hips: z.union([z.string(), z.number()]).optional(),
  }).default({}),
  details: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      unit: z.enum(["inches", "cm", "meters"]).default("inches")
    })
  ).optional()
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    const mockMeasurements = [
      {
        id: "m4a1e94b-14df-4f4d-91b5-8dbfdfdf832a",
        clientId: clientId || "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
        type: "Agbada Luxe",
        data: {
          chest: 44.5,
          waist: 38.0,
          sleeve: 34.0,
          shoulder: 20.5,
          length: 58.0,
          neck: 17.5
        },
        notes: "Heavy fold drape alignment",
        createdAt: "2026-06-28T14:30:00Z"
      },
      {
        id: "m8b3c90a-8d4e-4e3d-bcf2-f74ad7a3d902",
        clientId: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
        type: "Bespoke Suit",
        data: {
          chest: 40.0,
          waist: 34.0,
          sleeve: 25.5,
          shoulder: 18.0,
          length: 30.5
        },
        notes: "Unstructured soft shoulder styling",
        createdAt: "2026-06-29T11:45:00Z"
      }
    ];

    const data = clientId 
      ? mockMeasurements.filter(m => m.clientId === clientId) 
      : mockMeasurements;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createMeasurementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newMeasurement = {
      id: crypto.randomUUID(),
      ...validation.data,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(
      {
        message: "Measurement card created and registered to client ledger.",
        data: newMeasurement
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
