import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createAppointmentSchema = z.object({
  clientId: z.string().uuid("Invalid client UUID"),
  serviceId: z.string().uuid("Invalid service UUID").optional().nullable(),
  appointmentDate: z.string().datetime("Invalid date format, must be ISO 8601 string"),
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled"]).default("scheduled"),
  notes: z.string().optional().nullable()
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    const mockAppointments = [
      {
        id: "a1a8601b-8d4e-4f3d-9d41-e94ba7a3d902",
        clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
        serviceId: "s3f8e1a1-d84e-4f3d-9d41-e94ba7a3d902",
        appointmentDate: "2026-07-05T10:00:00Z",
        status: "confirmed",
        notes: "Fitting for Agbada Luxe Sovereign. Please prepare sample fabric selections.",
        createdAt: "2026-06-29T10:00:00Z"
      },
      {
        id: "a9b7601b-8d4e-4f3d-9d41-e94ba7a3d902",
        clientId: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
        serviceId: null,
        appointmentDate: "2026-07-10T14:30:00Z",
        status: "scheduled",
        notes: "Introductory bespoke suit consultation.",
        createdAt: "2026-06-30T08:15:00Z"
      }
    ];

    let data = mockAppointments;
    if (clientId) {
      data = data.filter(a => a.clientId === clientId);
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createAppointmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newAppointment = {
      id: crypto.randomUUID(),
      ...validation.data,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(
      {
        message: "Appointment successfully scheduled in the atelier master calendar.",
        data: newAppointment
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
