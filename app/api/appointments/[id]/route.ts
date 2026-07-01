import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateAppointmentSchema = z.object({
  serviceId: z.string().uuid("Invalid service UUID").optional().nullable(),
  appointmentDate: z.string().datetime("Invalid date format").optional(),
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled"]).optional(),
  notes: z.string().optional().nullable()
});

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const mockAppointment = {
      id,
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      serviceId: "s3f8e1a1-d84e-4f3d-9d41-e94ba7a3d902",
      appointmentDate: "2026-07-05T10:00:00Z",
      status: "confirmed",
      notes: "Fitting for Agbada Luxe Sovereign. Please prepare sample fabric selections.",
      createdAt: "2026-06-29T10:00:00Z"
    };

    return NextResponse.json({ data: mockAppointment });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const validation = updateAppointmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedAppointment = {
      id,
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      serviceId: "s3f8e1a1-d84e-4f3d-9d41-e94ba7a3d902",
      appointmentDate: "2026-07-05T10:00:00Z",
      status: "confirmed",
      notes: "Fitting for Agbada Luxe Sovereign. Please prepare sample fabric selections.",
      createdAt: "2026-06-29T10:00:00Z",
      ...validation.data
    };

    return NextResponse.json({
      message: "Appointment details updated successfully.",
      data: updatedAppointment
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // In a live system, this executes:
    // DELETE FROM public.appointments WHERE id = id;
    
    return NextResponse.json({
      message: "Appointment successfully cancelled and purged from the reservation ledger.",
      id
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
