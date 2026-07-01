import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateOrderSchema = z.object({
  measurementId: z.string().uuid("Invalid measurement UUID").optional(),
  serviceId: z.string().uuid("Invalid service UUID").optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled", "shipped"]).optional(),
  totalAmount: z.number().nonnegative("Total amount cannot be negative").optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format").optional().nullable(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      itemName: z.string().min(1, "Item name is required"),
      fabric: z.string().optional().nullable(),
      quantity: z.number().int().positive().default(1),
      price: z.number().nonnegative(),
      notes: z.string().optional().nullable()
    })
  ).optional()
});

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const mockOrder = {
      id,
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      measurementId: "m4a1e94b-14df-4f4d-91b5-8dbfdfdf832a",
      serviceId: "s3f8e1a1-d84e-4f3d-9d41-e94ba7a3d902",
      status: "in_progress",
      totalAmount: 1850.00,
      dueDate: "2026-07-15",
      createdAt: "2026-06-29T14:00:00Z",
      items: [
        {
          id: "oi-1",
          itemName: "The Sovereign Crown Agbada",
          fabric: "Hand-spun Silk Aso-Oke",
          quantity: 1,
          price: 1850.00,
          notes: "Bespoke embroidery design"
        }
      ]
    };

    return NextResponse.json({ data: mockOrder });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const validation = updateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedOrder = {
      id,
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      measurementId: "m4a1e94b-14df-4f4d-91b5-8dbfdfdf832a",
      serviceId: "s3f8e1a1-d84e-4f3d-9d41-e94ba7a3d902",
      status: "in_progress",
      totalAmount: 1850.00,
      dueDate: "2026-07-15",
      createdAt: "2026-06-29T14:00:00Z",
      ...validation.data
    };

    return NextResponse.json({
      message: "Order record and associated transactional state updated successfully.",
      data: updatedOrder
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
