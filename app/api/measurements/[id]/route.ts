import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateMeasurementSchema = z.object({
  type: z.string().min(2, "Type of garment is required").optional(),
  notes: z.string().optional().nullable(),
  data: z.object({
    chest: z.union([z.string(), z.number()]).optional(),
    waist: z.union([z.string(), z.number()]).optional(),
    sleeve: z.union([z.string(), z.number()]).optional(),
    shoulder: z.union([z.string(), z.number()]).optional(),
    length: z.union([z.string(), z.number()]).optional(),
    neck: z.union([z.string(), z.number()]).optional(),
    hips: z.union([z.string(), z.number()]).optional(),
  }).optional(),
  details: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      unit: z.enum(["inches", "cm", "meters"]).default("inches")
    })
  ).optional()
});

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const mockMeasurement = {
      id,
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
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
    };

    return NextResponse.json({ data: mockMeasurement });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const validation = updateMeasurementSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedMeasurement = {
      id,
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
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
      createdAt: "2026-06-28T14:30:00Z",
      ...validation.data
    };

    return NextResponse.json({
      message: "Measurement record updated successfully.",
      data: updatedMeasurement
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
