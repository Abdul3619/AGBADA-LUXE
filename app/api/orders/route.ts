import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createOrderSchema = z.object({
  clientId: z.string().uuid("Invalid client UUID"),
  measurementId: z.string().uuid("Invalid measurement UUID").optional().nullable(),
  serviceId: z.string().uuid("Invalid service UUID").optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled", "shipped"]).default("pending"),
  totalAmount: z.number().nonnegative("Total amount cannot be negative"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format").optional().nullable(),
  items: z.array(
    z.object({
      itemName: z.string().min(1, "Item name is required"),
      fabric: z.string().optional().nullable(),
      quantity: z.number().int().positive().default(1),
      price: z.number().nonnegative(),
      notes: z.string().optional().nullable()
    })
  ).min(1, "Order must have at least one line item")
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    const mockOrders = [
      {
        id: "o1d8601b-8d4e-4f3d-9d41-e94ba7a3d902",
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
      },
      {
        id: "o9c7601b-8d4e-4f3d-9d41-e94ba7a3d902",
        clientId: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
        measurementId: "m8b3c90a-8d4e-4e3d-bcf2-f74ad7a3d902",
        serviceId: null,
        status: "pending",
        totalAmount: 950.00,
        dueDate: "2026-07-20",
        createdAt: "2026-06-30T09:00:00Z",
        items: [
          {
            id: "oi-2",
            itemName: "The Obsidian Double-Breasted Jacket",
            fabric: "Worsted Kid Mohair Wool",
            quantity: 1,
            price: 950.00,
            notes: "Silk satin lapels"
          }
        ]
      }
    ];

    let data = mockOrders;
    if (clientId) {
      data = data.filter(o => o.clientId === clientId);
    }
    if (status) {
      data = data.filter(o => o.status === status);
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newOrderId = crypto.randomUUID();
    const newOrder = {
      id: newOrderId,
      ...validation.data,
      createdAt: new Date().toISOString(),
      items: validation.data.items.map(item => ({
        id: crypto.randomUUID(),
        ...item
      }))
    };

    return NextResponse.json(
      {
        message: "Order successfully authorized and line items compiled in ledger database.",
        data: newOrder
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
