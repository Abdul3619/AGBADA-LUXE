import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Server, 
  ShieldCheck, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Network, 
  Lock, 
  Code, 
  FileText, 
  Settings, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  Users, 
  Scissors, 
  Calendar, 
  CreditCard, 
  FileCheck, 
  Bell, 
  Sliders,
  Sparkles,
  Info
} from "lucide-react";

// Types for ERD Inspector
interface DBTable {
  name: string;
  category: "core" | "tailoring" | "crm" | "billing" | "system";
  columns: { name: string; type: string; key?: "PK" | "FK" | "PK/FK"; notes?: string }[];
  rlsDescription: string;
  hasCascade: boolean;
}

export default function AtelierArchitectSuite() {
  const [activeTab, setActiveTab] = useState<"erd" | "api" | "rls" | "playground">("erd");
  const [selectedTable, setSelectedTable] = useState<string>("users");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Playground simulation states
  const [pgEndpoint, setPgEndpoint] = useState<string>("register");
  const [pgRole, setPgRole] = useState<"client" | "tailor" | "admin">("client");
  const [pgCustomHeader, setPgCustomHeader] = useState<boolean>(true);
  const [pgBody, setPgBody] = useState<string>(
    JSON.stringify({
      fullName: "Abdulwahab Abdullah",
      email: "abdulwahab@agbadaluxe.com",
      phone: "+234 809 123 4567",
      password: "securepassword123",
      role: "client"
    }, null, 2)
  );
  const [pgResponse, setPgResponse] = useState<any>(null);
  const [pgIsLoading, setPgIsLoading] = useState<boolean>(false);
  const [pgErrorLog, setPgErrorLog] = useState<string | null>(null);

  // Quick reset for playground input bodies based on endpoint
  const handleEndpointChange = (endpoint: string) => {
    setPgEndpoint(endpoint);
    setPgResponse(null);
    setPgErrorLog(null);
    let defaultBody = {};

    if (endpoint === "register") {
      defaultBody = {
        fullName: "Abdulwahab Abdullah",
        email: "abdulwahab@agbadaluxe.com",
        phone: "+234 809 123 4567",
        password: "securepassword123",
        role: "client"
      };
    } else if (endpoint === "login") {
      defaultBody = {
        email: "abdulwahab@agbadaluxe.com",
        password: "securepassword123"
      };
    } else if (endpoint === "create_client") {
      defaultBody = {
        fullName: "Sarah Jenkins",
        email: "sarah.j@luxury-mail.com",
        phone: "+44 7700 900077",
        address: "Apt 4B, 12 Savile Row, London, UK",
        notes: "Requested wool and linen lounge suits"
      };
    } else if (endpoint === "create_measurement") {
      defaultBody = {
        clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
        type: "Agbada Luxe",
        notes: "Heavy gold thread embroidery styling",
        data: {
          chest: 44.5,
          waist: 38.0,
          sleeve: 34.0,
          shoulder: 20.5,
          length: 58.0
        }
      };
    } else if (endpoint === "create_order") {
      defaultBody = {
        clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
        measurementId: "m4a1e94b-14df-4f4d-91b5-8dbfdfdf832a",
        totalAmount: 1850.00,
        dueDate: "2026-07-25",
        items: [
          {
            itemName: "The Sovereign Crown Agbada",
            fabric: "Hand-spun Silk Aso-Oke",
            quantity: 1,
            price: 1850.00,
            notes: "Gold thread accents"
          }
        ]
      };
    } else if (endpoint === "initialize_payment") {
      defaultBody = {
        orderId: "o1d8601b-8d4e-4f3d-9d41-e94ba7a3d902",
        amount: 1850.00,
        email: "abdulwahab@agbadaluxe.com",
        method: "stripe"
      };
    }

    setPgBody(JSON.stringify(defaultBody, null, 2));
  };

  // Simulated Zod Parsing + Role Check Request Handler
  const handleSimulateApiCall = () => {
    setPgIsLoading(true);
    setPgResponse(null);
    setPgErrorLog(null);

    setTimeout(() => {
      try {
        const bodyObj = JSON.parse(pgBody);

        // Security role-based access validation
        if (pgCustomHeader) {
          if (
            (pgEndpoint === "create_client" || pgEndpoint === "create_measurement") &&
            pgRole === "client"
          ) {
            setPgIsLoading(false);
            setPgResponse({
              error: "Unauthorized access",
              message: "Role level 'client' has insufficient write permissions. Only 'admin' or 'tailor' roles can compose measurement assets directly."
            });
            setPgErrorLog("401 Unauthorized - RBAC Policy Blocked");
            return;
          }
        }

        // Zod validation check simulation
        if (pgEndpoint === "register") {
          if (!bodyObj.fullName || bodyObj.fullName.length < 2) {
            throw new Error("Validation Error: fullName must be at least 2 characters long.");
          }
          if (!bodyObj.email || !bodyObj.email.includes("@")) {
            throw new Error("Validation Error: email must be a valid email address.");
          }
          if (!bodyObj.password || bodyObj.password.length < 6) {
            throw new Error("Validation Error: password must be at least 6 characters.");
          }
          
          setPgResponse({
            status: 201,
            statusText: "Created",
            headers: { "Content-Type": "application/json" },
            data: {
              message: "User account created successfully in Supabase Auth & synchronized to profiles.",
              user: {
                id: "u_luxe_0881b2",
                fullName: bodyObj.fullName,
                email: bodyObj.email,
                phone: bodyObj.phone || null,
                role: bodyObj.role || "client",
                createdAt: new Date().toISOString()
              }
            }
          });
        } 
        
        else if (pgEndpoint === "login") {
          if (!bodyObj.email || !bodyObj.email.includes("@")) {
            throw new Error("Validation Error: Invalid email format.");
          }
          setPgResponse({
            status: 200,
            statusText: "OK",
            data: {
              message: "Authentication successful.",
              session: {
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockSessionToken",
                expiresIn: 3600,
                user: {
                  id: "usr_94a73b1",
                  email: bodyObj.email,
                  role: pgRole,
                  fullName: bodyObj.email.split("@")[0].toUpperCase(),
                  createdAt: new Date().toISOString()
                }
              }
            }
          });
        }

        else if (pgEndpoint === "create_client") {
          if (!bodyObj.fullName || bodyObj.fullName.length < 2) {
            throw new Error("Validation Error: fullName must be at least 2 characters.");
          }
          setPgResponse({
            status: 201,
            statusText: "Created",
            data: {
              message: "Client profile successfully compiled in database ledger.",
              data: {
                id: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
                ...bodyObj,
                createdAt: new Date().toISOString()
              }
            }
          });
        }

        else if (pgEndpoint === "create_measurement") {
          if (!bodyObj.clientId) {
            throw new Error("Validation Error: clientId must be a valid UUID.");
          }
          if (!bodyObj.type) {
            throw new Error("Validation Error: type of garment silhouette is required.");
          }
          setPgResponse({
            status: 201,
            statusText: "Created",
            data: {
              message: "Measurement card created and registered to client ledger.",
              data: {
                id: "m4a1e94b-14df-4f4d-91b5-8dbfdfdf832a",
                ...bodyObj,
                createdAt: new Date().toISOString()
              }
            }
          });
        }

        else if (pgEndpoint === "create_order") {
          if (!bodyObj.clientId) {
            throw new Error("Validation Error: clientId is required.");
          }
          if (!bodyObj.items || bodyObj.items.length === 0) {
            throw new Error("Validation Error: order must have at least one line item.");
          }
          setPgResponse({
            status: 201,
            statusText: "Created",
            data: {
              message: "Order successfully authorized and line items compiled in ledger database.",
              data: {
                id: "o1d8601b-8d4e-4f3d-9d41-e94ba7a3d902",
                ...bodyObj,
                createdAt: new Date().toISOString(),
                items: (bodyObj.items || []).map((item: any, idx: number) => ({
                  id: `oi-${idx + 1}`,
                  ...item
                }))
              }
            }
          });
        }

        else if (pgEndpoint === "initialize_payment") {
          if (!bodyObj.orderId || !bodyObj.amount) {
            throw new Error("Validation Error: orderId and positive amount are required.");
          }
          setPgResponse({
            status: 200,
            statusText: "OK",
            data: {
              message: "Gateway transactional pipeline initialized.",
              transactionReference: "tx_luxe_" + Math.random().toString(36).substr(2, 9),
              checkoutUrl: "https://checkout.sandbox.paymentgateway.com/pay/tx_luxe_demo",
              paymentDetails: {
                ...bodyObj,
                currency: "USD",
                status: "pending"
              }
            }
          });
        }

      } catch (err: any) {
        setPgErrorLog(err.message);
        setPgResponse({
          status: 400,
          statusText: "Bad Request",
          error: "Schema validation failed",
          details: err.message
        });
      } finally {
        setPgIsLoading(false);
      }
    }, 700);
  };

  // ERD Tables Structure Data mapping
  const tables: DBTable[] = [
    {
      name: "users",
      category: "core",
      rlsDescription: "Staff (admin/tailor) have raw access. Standard 'client' users can only read or update their own row matched by auth.uid().",
      hasCascade: false,
      columns: [
        { name: "id", type: "UUID", key: "PK", notes: "Maps to auth.users.id" },
        { name: "full_name", type: "TEXT", notes: "Required" },
        { name: "email", type: "TEXT", key: "FK", notes: "Unique, regex constraint checked" },
        { name: "phone", type: "TEXT" },
        { name: "role", type: "TEXT", notes: "Constraint: 'admin'|'client'|'tailor'" },
        { name: "avatar", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "clients",
      category: "crm",
      rlsDescription: "Staff have global access. Standard authenticated client can only select and update their own associated record (where user_id = auth.uid()).",
      hasCascade: false,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "user_id", type: "UUID", key: "FK", notes: "References users.id (ON DELETE SET NULL)" },
        { name: "full_name", type: "TEXT" },
        { name: "email", type: "TEXT" },
        { name: "phone", type: "TEXT" },
        { name: "address", type: "TEXT" },
        { name: "notes", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "measurements",
      category: "tailoring",
      rlsDescription: "Staff have global write access. Clients can read records only if client_id maps back to their client record owned by auth.uid().",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "client_id", type: "UUID", key: "FK", notes: "References clients.id (ON DELETE CASCADE)" },
        { name: "type", type: "TEXT", notes: "e.g., 'Bespoke Suit', 'Agbada'" },
        { name: "data", type: "JSONB", notes: "Detailed nested measurement parameters" },
        { name: "notes", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "measurement_details",
      category: "tailoring",
      rlsDescription: "Cascades security. Accessible to client only if the parent measurement belongs to their client profile.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "measurement_id", type: "UUID", key: "FK", notes: "References measurements.id (ON DELETE CASCADE)" },
        { name: "name", type: "TEXT", notes: "e.g., 'chest', 'sleeve_length'" },
        { name: "value", type: "TEXT" },
        { name: "unit", type: "TEXT", notes: "Constraint: 'inches' | 'cm' | 'meters'" }
      ]
    },
    {
      name: "categories",
      category: "core",
      rlsDescription: "Publicly readable by anyone. Write/update operations restricted to users with the 'admin' role.",
      hasCascade: false,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "name", type: "TEXT" },
        { name: "slug", type: "TEXT", notes: "Unique identifier, e.g. 'traditional'" },
        { name: "description", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "collections",
      category: "core",
      rlsDescription: "Publicly readable by anyone. Write/update restricted to admin and tailor staff.",
      hasCascade: false,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "category_id", type: "UUID", key: "FK", notes: "References categories.id (ON DELETE SET NULL)" },
        { name: "title", type: "TEXT" },
        { name: "description", type: "TEXT" },
        { name: "image", type: "TEXT" },
        { name: "is_featured", type: "BOOLEAN" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "gallery_images",
      category: "core",
      rlsDescription: "Publicly readable. Modified strictly by staff.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "collection_id", type: "UUID", key: "FK", notes: "References collections.id (ON DELETE CASCADE)" },
        { name: "image_url", type: "TEXT" },
        { name: "title", type: "TEXT" },
        { name: "order_index", type: "INTEGER" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "services",
      category: "core",
      rlsDescription: "Active services are public. Modification and creation restricted strictly to administrators.",
      hasCascade: false,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "name", type: "TEXT" },
        { name: "description", type: "TEXT" },
        { name: "price", type: "NUMERIC", notes: "Constraint: >= 0" },
        { name: "duration", type: "INTEGER", notes: "Minutes (Constraint: > 0)" },
        { name: "is_active", type: "BOOLEAN" }
      ]
    },
    {
      name: "appointments",
      category: "crm",
      rlsDescription: "Staff manages all bookings. Authenticated client can view their own, insert new bookings, and cancel active bookings.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "client_id", type: "UUID", key: "FK", notes: "References clients.id (ON DELETE CASCADE)" },
        { name: "service_id", type: "UUID", key: "FK", notes: "References services.id (ON DELETE SET NULL)" },
        { name: "appointment_date", type: "TIMESTAMP" },
        { name: "status", type: "TEXT", notes: "Constraint: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'" },
        { name: "notes", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "orders",
      category: "billing",
      rlsDescription: "Staff manages all orders. Clients can only view orders associated with their client ID.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "client_id", type: "UUID", key: "FK", notes: "References clients.id (ON DELETE CASCADE)" },
        { name: "measurement_id", type: "UUID", key: "FK", notes: "References measurements.id (ON DELETE SET NULL)" },
        { name: "service_id", type: "UUID", key: "FK", notes: "References services.id (ON DELETE SET NULL)" },
        { name: "status", type: "TEXT", notes: "Constraint: 'pending'|'in_progress'|'completed'|'cancelled'|'shipped'" },
        { name: "total_amount", type: "NUMERIC", notes: "Constraint: >= 0" },
        { name: "due_date", type: "DATE" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "order_items",
      category: "billing",
      rlsDescription: "Staff manages all order details. Clients can select records only if the parent order belongs to them.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "order_id", type: "UUID", key: "FK", notes: "References orders.id (ON DELETE CASCADE)" },
        { name: "item_name", type: "TEXT" },
        { name: "fabric", type: "TEXT" },
        { name: "quantity", type: "INTEGER", notes: "Constraint: > 0" },
        { name: "price", type: "NUMERIC", notes: "Constraint: >= 0" },
        { name: "notes", type: "TEXT" }
      ]
    },
    {
      name: "payments",
      category: "billing",
      rlsDescription: "Staff manages ledger. Clients can select records to view receipts of their own orders.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "order_id", type: "UUID", key: "FK", notes: "References orders.id (ON DELETE CASCADE)" },
        { name: "amount", type: "NUMERIC", notes: "Constraint: > 0 (Strictly positive)" },
        { name: "method", type: "TEXT", notes: "Constraint: 'card'|'bank_transfer'|'cash'|'stripe'|'paystack'" },
        { name: "status", type: "TEXT", notes: "Constraint: 'pending'|'completed'|'failed'|'refunded'" },
        { name: "transaction_ref", type: "TEXT", notes: "Unique constraint" },
        { name: "paid_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "invoices",
      category: "billing",
      rlsDescription: "Staff manages billing invoices. Clients can select and download invoices associated with their orders.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "order_id", type: "UUID", key: "FK", notes: "References orders.id (ON DELETE CASCADE)" },
        { name: "invoice_number", type: "TEXT", notes: "Unique identifier constraint" },
        { name: "amount", type: "NUMERIC", notes: "Constraint: >= 0" },
        { name: "pdf_url", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "testimonials",
      category: "crm",
      rlsDescription: "Approved testimonials are viewable by anyone. Clients can insert testimonials for themselves. Staff handles approval triggers.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "client_id", type: "UUID", key: "FK", notes: "References clients.id (ON DELETE CASCADE)" },
        { name: "rating", type: "INTEGER", notes: "Range constraint: 1 to 5" },
        { name: "comment", type: "TEXT" },
        { name: "is_approved", type: "BOOLEAN" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "notifications",
      category: "system",
      rlsDescription: "Users can read and mark as read their own notifications (where user_id = auth.uid()). Staff can write/dispatch messages.",
      hasCascade: true,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "user_id", type: "UUID", key: "FK", notes: "References users.id (ON DELETE CASCADE)" },
        { name: "title", type: "TEXT" },
        { name: "message", type: "TEXT" },
        { name: "is_read", type: "BOOLEAN" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "website_settings",
      category: "system",
      rlsDescription: "Publicly readable by all client devices for configuration bootstrap. Admin has full read/write permissions.",
      hasCascade: false,
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "key", type: "TEXT", notes: "Unique, key-value lookup" },
        { name: "value", type: "TEXT" },
        { name: "updated_at", type: "TIMESTAMP" }
      ]
    }
  ];

  const selectedTableData = useMemo(() => {
    return tables.find(t => t.name === selectedTable) || tables[0];
  }, [selectedTable]);

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core": return "text-blue-400 border-blue-500/30 bg-blue-500/5";
      case "tailoring": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
      case "crm": return "text-purple-400 border-purple-500/30 bg-purple-500/5";
      case "billing": return "text-amber-400 border-amber-500/30 bg-amber-500/5";
      default: return "text-zinc-400 border-zinc-500/30 bg-zinc-500/5";
    }
  };

  const getTableIcon = (category: string) => {
    switch (category) {
      case "core": return <Layers className="w-3.5 h-3.5" />;
      case "tailoring": return <Scissors className="w-3.5 h-3.5" />;
      case "crm": return <Users className="w-3.5 h-3.5" />;
      case "billing": return <CreditCard className="w-3.5 h-3.5" />;
      default: return <Settings className="w-3.5 h-3.5" />;
    }
  };

  // Next.js source codes for visual explorer
  const apiRouteCode: Record<string, string> = {
    register: `import { NextRequest, NextResponse } from "next/server";
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
    
    // Validate request body against schema
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password, role, avatar } = validation.data;
    
    // Map to Supabase auth sign-up and trigger profile synchronization trigger
    const mockUserId = crypto.randomUUID();
    
    return NextResponse.json({
      message: "User account created successfully in Supabase Auth.",
      user: { id: mockUserId, fullName, email, phone, role, avatar, createdAt: new Date() }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}`,
    login: `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const mockRole = email.includes("admin") ? "admin" : "client";

    return NextResponse.json({
      message: "Authentication successful.",
      session: {
        accessToken: "eyJhbGciOiJIUzI1NiJ9.mockToken",
        user: { email, role: mockRole }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}`,
    clients: `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createClientSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  // Query public.clients in Supabase
  return NextResponse.json({ data: [ { id: "c1", fullName: "Abdulwahab" } ] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = createClientSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  return NextResponse.json({ message: "Client created", data: validation.data }, { status: 201 });
}`,
    measurements: `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createMeasurementSchema = z.object({
  clientId: z.string().uuid(),
  type: z.string(),
  data: z.record(z.any()),
  notes: z.string().optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = createMeasurementSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  return NextResponse.json({ message: "Measurements created", data: validation.data }, { status: 201 });
}`,
    orders: `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createOrderSchema = z.object({
  clientId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  dueDate: z.string().optional(),
  items: z.array(z.object({
    itemName: z.string(),
    quantity: z.number().positive(),
    price: z.number()
  }))
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const val = createOrderSchema.safeParse(body);
  if (!val.success) return NextResponse.json({ error: "Invalid Schema" }, { status: 400 });
  return NextResponse.json({ message: "Order processed successfully", data: val.data }, { status: 201 });
}`,
    payments: `import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const initPaymentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive(),
  email: z.string().email(),
  method: z.enum(["stripe", "paystack"])
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const val = initPaymentSchema.safeParse(body);
  if (!val.success) return NextResponse.json({ error: "Validation Failed" }, { status: 400 });
  return NextResponse.json({
    message: "Gateway transactional pipeline initialized.",
    transactionReference: "tx_luxe_ref",
    checkoutUrl: "https://checkout.sandbox.paymentgateway.com/pay"
  });
}`
  };

  const [activeApiFile, setActiveApiFile] = useState<string>("register");

  return (
    <section id="architect" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-b border-warm-gold/10">
      
      {/* Editorial Header */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center space-x-2 text-warm-gold text-xs font-syne uppercase tracking-[0.3em] mb-4">
          <Database className="w-3.5 h-3.5" />
          <span>System Architecture Suite</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-cream mb-6">
          Architect <span className="font-light italic text-warm-gold">Console</span>
        </h2>
        <p className="text-cream/85 font-sans text-sm sm:text-base leading-relaxed tracking-wide">
          Inspect the production-ready PostgreSQL relational database schema, review Row-Level Security (RLS) policies, and run simulated API route handler schema checks built to drive the Agbada Luxe master database.
        </p>
      </div>

      {/* Control Tabs Nav */}
      <div className="flex flex-wrap gap-2 border-b border-cream/10 pb-4 mb-10">
        <button
          onClick={() => setActiveTab("erd")}
          className={`px-5 py-3 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-all flex items-center space-x-2 border ${
            activeTab === "erd"
              ? "bg-warm-gold text-obsidian border-warm-gold font-bold shadow-md shadow-warm-gold/10"
              : "bg-charcoal/30 text-cream/70 border-cream/5 hover:border-warm-gold/30 hover:bg-charcoal/50"
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Relational Schema (ERD)</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`px-5 py-3 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-all flex items-center space-x-2 border ${
            activeTab === "api"
              ? "bg-warm-gold text-obsidian border-warm-gold font-bold shadow-md shadow-warm-gold/10"
              : "bg-charcoal/30 text-cream/70 border-cream/5 hover:border-warm-gold/30 hover:bg-charcoal/50"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>API Routes Code Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab("rls")}
          className={`px-5 py-3 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-all flex items-center space-x-2 border ${
            activeTab === "rls"
              ? "bg-warm-gold text-obsidian border-warm-gold font-bold shadow-md shadow-warm-gold/10"
              : "bg-charcoal/30 text-cream/70 border-cream/5 hover:border-warm-gold/30 hover:bg-charcoal/50"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>RLS & Security Policies</span>
        </button>

        <button
          onClick={() => setActiveTab("playground")}
          className={`px-5 py-3 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-all flex items-center space-x-2 border ${
            activeTab === "playground"
              ? "bg-warm-gold text-obsidian border-warm-gold font-bold shadow-md shadow-warm-gold/10"
              : "bg-charcoal/30 text-cream/70 border-cream/5 hover:border-warm-gold/30 hover:bg-charcoal/50"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>API Sandbox Playground</span>
        </button>
      </div>

      {/* Tabs View Panels */}
      <div className="bg-[#0A0A0A] border border-warm-gold/15 rounded-sm p-6 sm:p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: RELATIONAL SCHEMA / ERD */}
          {activeTab === "erd" && (
            <motion.div
              key="erd-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Tables list - Col span 4 */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-cream/40 block mb-3">
                  Atelier Schema Entities (16 Tables)
                </span>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-charcoal">
                  {tables.map(table => (
                    <button
                      key={table.name}
                      onClick={() => setSelectedTable(table.name)}
                      className={`p-3 rounded-sm text-left border font-mono text-[11px] transition-all flex items-center justify-between ${
                        selectedTable === table.name
                          ? "bg-warm-gold/10 border-warm-gold text-warm-gold font-bold"
                          : "bg-charcoal/30 border-cream/5 text-cream/70 hover:border-warm-gold/25"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getTableIcon(table.category)}
                        <span>{table.name}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 transition-transform ${selectedTable === table.name ? "rotate-90 text-warm-gold" : "text-cream/30"}`} />
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-charcoal/20 border border-cream/5 rounded-sm mt-4 text-[10px] font-mono text-cream/50 leading-relaxed">
                  <span className="text-warm-gold block font-bold uppercase mb-1">Entity Map Key</span>
                  <div className="flex flex-wrap gap-2 text-[9px] pt-1">
                    <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-sm">Core Data</span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-sm">Tailoring Metrics</span>
                    <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-sm">CRM Profile</span>
                    <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-sm">Accounting / CRM</span>
                  </div>
                </div>
              </div>

              {/* Inspector - Col span 8 */}
              <div className="lg:col-span-8 bg-[#0E0E0E] border border-cream/10 rounded-sm p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <span className={`px-2.5 py-1 text-[9px] font-mono border rounded-sm uppercase tracking-widest ${getCategoryColor(selectedTableData.category)}`}>
                    {selectedTableData.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl text-cream font-bold flex items-center gap-2">
                    <Database className="w-5 h-5 text-warm-gold" />
                    table "{selectedTableData.name}"
                  </h3>
                  <p className="text-xs text-cream/60 font-mono">Relational Blueprint & Column Schema constraints</p>
                </div>

                {/* Columns Table */}
                <div className="border border-cream/5 rounded-sm overflow-hidden">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="bg-charcoal/60 border-b border-cream/10 text-cream/50 text-[10px] uppercase tracking-wider">
                        <th className="p-3">Column Name</th>
                        <th className="p-3">Data Type</th>
                        <th className="p-3">Key Constraint</th>
                        <th className="p-3">Attributes & Rules</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream/5">
                      {selectedTableData.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-semibold text-cream">{col.name}</td>
                          <td className="p-3 text-warm-gold/80">{col.type}</td>
                          <td className="p-3">
                            {col.key ? (
                              <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                                col.key === "PK" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-teal-500/10 border border-teal-500/20 text-teal-400"
                              }`}>
                                {col.key}
                              </span>
                            ) : (
                              <span className="text-cream/30">&mdash;</span>
                            )}
                          </td>
                          <td className="p-3 text-cream/70 text-[11px]">{col.notes || "NULLable"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Additional Table Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-charcoal/30 border border-cream/5 rounded-sm space-y-2">
                    <span className="text-[10px] font-mono text-warm-gold uppercase tracking-wider block">Row-Level Security Model</span>
                    <p className="text-[11px] text-cream/70 leading-relaxed font-sans">{selectedTableData.rlsDescription}</p>
                  </div>

                  <div className="p-4 bg-charcoal/30 border border-cream/5 rounded-sm space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-warm-gold uppercase tracking-wider block">Integrity Cascades</span>
                      <p className="text-[11px] text-cream/70 font-sans mt-1">
                        {selectedTableData.hasCascade 
                          ? "Cascades deletions automatically. Records are purged if parent references are deleted to ensure zero dangling relationships." 
                          : "Non-cascading row safety. Keeps child items preserved or throws check errors if references are modified."}
                      </p>
                    </div>
                    {selectedTableData.name === "payments" && (
                      <span className="text-[9px] font-mono text-red-400 bg-red-950/20 px-2 py-0.5 border border-red-900/30 rounded-sm self-start mt-2">
                        CONSTRAINT: amount &gt; 0
                      </span>
                    )}
                    {selectedTableData.name === "users" && (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 border border-emerald-900/30 rounded-sm self-start mt-2">
                        CONSTRAINT: REGEX valid_email check
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Schema Creation Code Snippet */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-cream/40 uppercase tracking-widest block">DDL Generated Create Script</span>
                  <div className="bg-obsidian border border-cream/5 p-4 rounded-sm font-mono text-[10px] text-cream/60 overflow-x-auto leading-relaxed max-h-[140px]">
                    <span className="text-emerald-400">CREATE TABLE</span> public.{selectedTableData.name} (<br />
                    {selectedTableData.columns.map((col, idx) => (
                      <div key={idx} className="pl-4">
                        <span className="text-cream font-bold">{col.name}</span> <span className="text-warm-gold">{col.type}</span>
                        {col.key === "PK" && <span className="text-red-400 font-bold"> PRIMARY KEY</span>}
                        {col.notes?.includes("References") && <span className="text-teal-400"> {col.notes.split(" (")[0]}</span>}
                        {idx < selectedTableData.columns.length - 1 ? "," : ""}
                      </div>
                    ))}
                    );
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: API CODE EXPLORER */}
          {activeTab === "api" && (
            <motion.div
              key="api-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar file selection */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-cream/40 block mb-3">
                  Next.js App Router API Routes
                </span>
                
                <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-charcoal">
                  {[
                    { id: "register", label: "POST /api/auth/register", desc: "Zod user auth creation" },
                    { id: "login", label: "POST /api/auth/login", desc: "JWT session handshake" },
                    { id: "clients", label: "GET/POST /api/clients", desc: "Lead CRM management" },
                    { id: "measurements", label: "GET/POST /api/measurements", desc: "Bespoke metric sheets" },
                    { id: "orders", label: "GET/POST /api/orders", desc: "Order pipeline validation" },
                    { id: "payments", label: "POST /api/payments/init", desc: "Gateway payment sessions" },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveApiFile(item.id)}
                      className={`w-full p-3 rounded-sm text-left border transition-all flex flex-col gap-1 ${
                        activeApiFile === item.id
                          ? "bg-warm-gold/10 border-warm-gold text-warm-gold"
                          : "bg-charcoal/30 border-cream/5 text-cream/70 hover:border-warm-gold/25"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">{item.label}</span>
                      <span className="text-[10px] text-cream/40 font-sans">{item.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-charcoal/20 border border-cream/5 rounded-sm text-[10px] font-mono text-cream/50 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1 text-warm-gold">
                    <Info className="w-3.5 h-3.5" />
                    <span className="font-bold uppercase">Workspace Layout</span>
                  </div>
                  <p className="text-[10px]">These server-side files are written physically to the <code>/app/api/...</code> directory layout of the repository, keeping secrets out of the browser client.</p>
                </div>
              </div>

              {/* Code viewer */}
              <div className="lg:col-span-8 bg-[#0E0E0E] border border-cream/10 rounded-sm p-6 space-y-4 flex flex-col justify-between">
                
                <div className="flex justify-between items-center border-b border-cream/5 pb-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-warm-gold">
                      /app/api/{activeApiFile === "payments" ? "payments/initialize" : activeApiFile}/route.ts
                    </h3>
                    <p className="text-[10px] text-cream/50 mt-1 font-sans">Full compilation-validated Route Handler source code</p>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(apiRouteCode[activeApiFile], activeApiFile)}
                    className="px-3 py-1.5 bg-charcoal/40 hover:bg-charcoal border border-cream/10 hover:border-warm-gold/45 text-cream/75 hover:text-warm-gold rounded-sm transition-all font-mono text-[10px] flex items-center space-x-1.5"
                  >
                    {copiedCode === activeApiFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#050505] border border-cream/5 p-4 rounded-sm font-mono text-[11px] text-cream/75 leading-relaxed overflow-x-auto max-h-[350px] scrollbar-thin scrollbar-thumb-charcoal">
                  <pre className="whitespace-pre">{apiRouteCode[activeApiFile]}</pre>
                </div>

                <div className="p-3 bg-charcoal/30 border border-warm-gold/15 rounded-sm text-[10px] font-mono text-cream/75 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-warm-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Validation Note:</strong> Built on top of <code>zod</code>. Requests that do not match the expected structural attributes are auto-rejected with <code>400 Bad Request</code> and precise nested schema validation logs.
                  </span>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: SECURITY & RLS */}
          {activeTab === "rls" && (
            <motion.div
              key="rls-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="p-4 bg-charcoal/30 border border-warm-gold/15 rounded-sm flex items-start gap-3">
                <Lock className="w-5 h-5 text-warm-gold shrink-0 mt-1 animate-pulse" />
                <div>
                  <h3 className="font-serif text-lg font-medium text-warm-gold">Row-Level Security Policy Matrix</h3>
                  <p className="text-xs text-cream/80 leading-relaxed mt-1">
                    Supabase mandates activating Row-Level Security (RLS) to safeguard direct database connections from clients. Below is the active RBAC matrix we configured.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Admin Policy card */}
                <div className="p-5 bg-charcoal/10 border border-cream/5 rounded-sm space-y-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase tracking-widest font-bold">Admin Scope</span>
                  </div>
                  <ul className="text-xs text-cream/70 space-y-2.5 font-sans leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-mono mt-0.5">&bull;</span>
                      Global bypass on all table reads/writes.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-mono mt-0.5">&bull;</span>
                      Authorized to edit system constants and prices.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-red-400 font-mono mt-0.5">&bull;</span>
                      Handles transaction approvals and refund flags.
                    </li>
                  </ul>
                </div>

                {/* Tailor Policy card */}
                <div className="p-5 bg-charcoal/10 border border-cream/5 rounded-sm space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Scissors className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase tracking-widest font-bold">Tailor / Artisan Scope</span>
                  </div>
                  <ul className="text-xs text-cream/70 space-y-2.5 font-sans leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-mono mt-0.5">&bull;</span>
                      Read and write access to all clients and measurements.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-mono mt-0.5">&bull;</span>
                      Authorized to update order status parameters.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-mono mt-0.5">&bull;</span>
                      Forbidden from editing payment billing ledger tables directly.
                    </li>
                  </ul>
                </div>

                {/* Client Policy card */}
                <div className="p-5 bg-charcoal/10 border border-cream/5 rounded-sm space-y-4">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Users className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase tracking-widest font-bold">Client Profile Scope</span>
                  </div>
                  <ul className="text-xs text-cream/70 space-y-2.5 font-sans leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-mono mt-0.5">&bull;</span>
                      Strict row isolation: reading/updating only their own row.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-mono mt-0.5">&bull;</span>
                      Cannot view measurements of any other clients.
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-mono mt-0.5">&bull;</span>
                      Only allowed to view invoices and receipts tied to their client ID.
                    </li>
                  </ul>
                </div>

              </div>

              {/* Postgres Trigger Security Display */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-cream/40 uppercase tracking-widest block">Core PostgreSQL Helper Security Definers</span>
                <div className="bg-obsidian border border-cream/5 p-4 rounded-sm font-mono text-[10px] text-cream/60 overflow-x-auto leading-relaxed max-h-[180px]">
                  <p className="text-warm-gold font-bold">-- Current user role selector bypassing circular security loops</p>
                  <pre className="mt-2 text-cream/80">
{`CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    v_role := (auth.jwt() -> 'user_metadata' ->> 'role');
    IF v_role IS NULL AND auth.uid() IS NOT NULL THEN
        SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
    END IF;
    RETURN COALESCE(v_role, 'client');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}
                  </pre>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: API SANDBOX PLAYGROUND */}
          {activeTab === "playground" && (
            <motion.div
              key="playground-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Request controller - col span 6 */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cream/40 block">
                    1. Compose Simulated Request Payload
                  </span>
                  <p className="text-xs text-cream/60">Configure validation targets and mock authentication states</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Endpoint Select */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-warm-gold uppercase tracking-wider block">Target Endpoint</span>
                    <select
                      value={pgEndpoint}
                      onChange={(e) => handleEndpointChange(e.target.value)}
                      className="w-full bg-obsidian border border-cream/15 text-cream text-xs p-2 focus:border-warm-gold focus:outline-none rounded-sm font-mono"
                    >
                      <option value="register">POST /api/auth/register</option>
                      <option value="login">POST /api/auth/login</option>
                      <option value="create_client">POST /api/clients</option>
                      <option value="create_measurement">POST /api/measurements</option>
                      <option value="create_order">POST /api/orders</option>
                      <option value="initialize_payment">POST /api/payments/init</option>
                    </select>
                  </div>

                  {/* Role Select */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-warm-gold uppercase tracking-wider block">Mock Client Auth Role</span>
                    <select
                      value={pgRole}
                      onChange={(e) => setPgRole(e.target.value as any)}
                      className="w-full bg-obsidian border border-cream/15 text-cream text-xs p-2 focus:border-warm-gold focus:outline-none rounded-sm font-mono"
                    >
                      <option value="client">Role: client (Authenticated)</option>
                      <option value="tailor">Role: tailor (Artisan Staff)</option>
                      <option value="admin">Role: admin (Atelier Owner)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Authorization header checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pg-header-chk"
                    checked={pgCustomHeader}
                    onChange={(e) => setPgCustomHeader(e.target.checked)}
                    className="accent-warm-gold rounded-sm border-cream/20"
                  />
                  <label htmlFor="pg-header-chk" className="text-[11px] font-mono text-cream/70 cursor-pointer">
                    Inject <code>Authorization: Bearer jwt_claims</code> header
                  </label>
                </div>

                {/* Edit Request Body */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-warm-gold uppercase tracking-wider">JSON Request Body</span>
                    <button 
                      onClick={() => handleEndpointChange(pgEndpoint)} 
                      className="text-[9px] font-mono text-cream/40 hover:text-warm-gold"
                    >
                      Reset Body
                    </button>
                  </div>
                  <textarea
                    value={pgBody}
                    onChange={(e) => setPgBody(e.target.value)}
                    rows={8}
                    className="w-full bg-[#050505] border border-cream/15 text-cream font-mono text-[11px] p-3 focus:border-warm-gold focus:outline-none rounded-sm focus:ring-1 focus:ring-warm-gold/20"
                  />
                </div>

                {/* Run CTA */}
                <button
                  onClick={handleSimulateApiCall}
                  disabled={pgIsLoading}
                  className="w-full py-3 bg-warm-gold hover:bg-cream text-obsidian font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {pgIsLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting HTTP Frame...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Execute Sandbox Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Request console output - col span 6 */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cream/40 block">
                    2. Web Server Request Logs & Headers
                  </span>
                  <div className="bg-obsidian border border-cream/5 rounded-sm p-4 font-mono text-[10px] text-cream/75 space-y-2">
                    <div>
                      <span className="text-warm-gold font-bold">URI:</span> {pgEndpoint === "register" ? "POST /api/auth/register" : pgEndpoint === "login" ? "POST /api/auth/login" : pgEndpoint === "create_client" ? "POST /api/clients" : pgEndpoint === "create_measurement" ? "POST /api/measurements" : pgEndpoint === "create_order" ? "POST /api/orders" : "POST /api/payments/initialize"}
                    </div>
                    <div>
                      <span className="text-warm-gold font-bold">Headers:</span> <br />
                      <div className="pl-4 text-cream/50">
                        Content-Type: application/json <br />
                        User-Agent: Agbada-Luxe-Atelier/v1.0 <br />
                        {pgCustomHeader ? `Authorization: Bearer jwt_claims_${pgRole}_signature_verified` : "Authorization: none"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* API JSON Response Console */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-cream/40 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-warm-gold" />
                      HTTP Response Header Frame
                    </span>
                    {pgResponse ? (
                      <span className={`px-2 py-0.5 border font-mono text-[9px] rounded-sm uppercase ${
                        pgErrorLog 
                          ? "bg-red-950/40 border-red-800/40 text-red-400" 
                          : "bg-green-950/40 border-green-800/40 text-green-400"
                      }`}>
                        {pgErrorLog ? "400 Bad Request" : "200/201 Success"}
                      </span>
                    ) : (
                      <span className="text-cream/30 text-[9px] font-mono">Awaiting transmission...</span>
                    )}
                  </div>

                  <div className="bg-black border border-cream/10 p-4 rounded-sm font-mono text-[11px] min-h-[180px] max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-charcoal text-cream/80 flex flex-col justify-between">
                    {pgIsLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-2 text-cream/40">
                        <RefreshCw className="w-5 h-5 animate-spin text-warm-gold" />
                        <span>Compiling and validating against Zod model...</span>
                      </div>
                    ) : pgResponse ? (
                      <pre className="text-cream/90">{JSON.stringify(pgResponse, null, 2)}</pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 space-y-2 text-cream/30 text-center">
                        <Send className="w-6 h-6 text-warm-gold/20" />
                        <span>Payload simulation inactive.<br />Configure fields on the left and click execute.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informational badge */}
                <div className="p-3 bg-charcoal/20 border border-cream/5 rounded-sm text-[10px] font-mono text-cream/50 leading-relaxed flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-warm-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Sandbox Engine:</strong> This is a secure local simulation that accurately processes Zod validation errors, authorization mismatches, and structural checks just like our production backend routes.
                  </span>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </section>
  );
}
