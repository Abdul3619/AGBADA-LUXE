import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Users, 
  Scissors, 
  Calendar, 
  CreditCard, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Search, 
  Plus, 
  Download, 
  Trash, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Mail, 
  Upload, 
  Star, 
  CheckSquare, 
  XSquare, 
  ShieldCheck,
  Eye,
  Info,
  Sliders,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

// Interfaces mirroring the relational backend schemas
interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

interface Measurement {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  notes: string;
  data: {
    chest?: number;
    waist?: number;
    sleeve?: number;
    shoulder?: number;
    length?: number;
    neck?: number;
    hips?: number;
  };
  createdAt: string;
}

interface OrderItem {
  id: string;
  itemName: string;
  fabric: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  clientId: string;
  clientName: string;
  measurementId?: string;
  serviceId?: string;
  serviceName: string;
  status: "Draft" | "Baste Fitting" | "Production" | "Ready for Collection" | "Delivered";
  totalAmount: number;
  dueDate: string;
  createdAt: string;
  items: OrderItem[];
}

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  orderId: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  transactionRef: string;
  paidAt?: string;
  createdAt: string;
}

interface Testimonial {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  collection: string;
  imageUrl: string;
  isFeatured: boolean;
}

export default function AdminDashboard() {
  // Gating & Role simulation
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "tailor" | "client">("admin");
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "measurements" | "orders" | "appointments" | "billing" | "reviews" | "settings">("overview");

  // Local Reactive State Database Store (Prefilled with realistic seeds corresponding to Step 1 API schema)
  const [clients, setClients] = useState<Client[]>([
    {
      id: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      fullName: "Abdulwahab Abdullah",
      email: "abdulwahab@agbadaluxe.com",
      phone: "+234 809 123 4567",
      address: "No 15 Victoria Island, Lagos, Nigeria",
      notes: "Prefers heavy hand-spun silk blend Aso-Oke with geometric gold threading.",
      createdAt: "2026-06-28T12:00:00Z"
    },
    {
      id: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
      fullName: "Sarah Jenkins",
      email: "sarah.j@luxury-mail.com",
      phone: "+44 7700 900077",
      address: "Apt 4B, 12 Savile Row, London, UK",
      notes: "Interested in SS26 double-breasted suits with relaxed drape.",
      createdAt: "2026-06-29T10:15:00Z"
    },
    {
      id: "e932b10a-8d4e-4f3d-9d41-e94ba7a3d902",
      fullName: "Chief Folake Alakija",
      email: "alakija.folake@royalestate.ng",
      phone: "+234 803 555 1212",
      address: "Banana Island Mansion 3, Lagos, Nigeria",
      notes: "Requests customized deep coral silk laces with matching head-gear (Gele).",
      createdAt: "2026-06-25T15:30:00Z"
    }
  ]);

  const [measurements, setMeasurements] = useState<Measurement[]>([
    {
      id: "m4a1e94b-14df-4f4d-91b5-8dbfdfdf832a",
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      clientName: "Abdulwahab Abdullah",
      type: "Agbada Luxe Sovereign",
      notes: "Heavy fold drape alignment. Leave spacious side slits for cuff displays.",
      data: {
        chest: 44.5,
        waist: 38.0,
        sleeve: 34.0,
        shoulder: 20.5,
        length: 58.0,
        neck: 17.5,
        hips: 46.0
      },
      createdAt: "2026-06-28T14:30:00Z"
    },
    {
      id: "m8b3c90a-8d4e-4e3d-bcf2-f74ad7a3d902",
      clientId: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
      clientName: "Sarah Jenkins",
      type: "Bespoke Lounge Jacket",
      notes: "Unstructured soft shoulder styling with high armholes.",
      data: {
        chest: 40.0,
        waist: 34.0,
        sleeve: 25.5,
        shoulder: 18.0,
        length: 30.5,
        neck: 15.5,
        hips: 41.0
      },
      createdAt: "2026-06-29T11:45:00Z"
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "o1d8601b-8d4e-4f3d-9d41-e94ba7a3d902",
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      clientName: "Abdulwahab Abdullah",
      measurementId: "m4a1e94b-14df-4f4d-91b5-8dbfdfdf832a",
      serviceName: "Sovereign Couture Craft",
      status: "Production",
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
          notes: "Complex filigree embroidery design on breastplate"
        }
      ]
    },
    {
      id: "o9c7601b-8d4e-4f3d-9d41-e94ba7a3d902",
      clientId: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
      clientName: "Sarah Jenkins",
      measurementId: "m8b3c90a-8d4e-4e3d-bcf2-f74ad7a3d902",
      serviceName: "Mayfair Bespoke Suitings",
      status: "Draft",
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
          notes: "Silk satin lapels and bone buttons"
        }
      ]
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "a1a8601b-8d4e-4f3d-9d41-e94ba7a3d902",
      clientId: "c8e1a12d-19df-41cf-9a9f-db8bdfdf3d2e",
      clientName: "Abdulwahab Abdullah",
      serviceId: "s3f8e1a1-d84e-4f3d-9d41-e94ba7a3d902",
      serviceName: "Sovereign Fitting Session",
      appointmentDate: "2026-07-05T10:00:00Z",
      status: "confirmed",
      notes: "Basted fitting for Agbada Luxe Sovereign. Prepare embroidery samples.",
      createdAt: "2026-06-29T10:00:00Z"
    },
    {
      id: "a9b7601b-8d4e-4f3d-9d41-e94ba7a3d902",
      clientId: "a75dfdf3-bb90-4bf6-905a-5ee41fa3d11b",
      clientName: "Sarah Jenkins",
      serviceId: "s4c3d10a-d84e-4f3d-9d41-e94ba7a3d902",
      serviceName: "Savile Row Initial Consultation",
      appointmentDate: "2026-07-10T14:30:00Z",
      status: "scheduled",
      notes: "Introductory custom fit and look alignment.",
      createdAt: "2026-06-30T08:15:00Z"
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-001",
      orderId: "o1d8601b-8d4e-4f3d-9d41-e94ba7a3d902",
      clientName: "Abdulwahab Abdullah",
      invoiceNumber: "INV-2026-081",
      amount: 1850.00,
      status: "Paid",
      transactionRef: "tx_luxe_991823ab",
      paidAt: "2026-06-29T14:15:00Z",
      createdAt: "2026-06-29T14:02:00Z"
    },
    {
      id: "inv-002",
      orderId: "o9c7601b-8d4e-4f3d-9d41-e94ba7a3d902",
      clientName: "Sarah Jenkins",
      invoiceNumber: "INV-2026-082",
      amount: 950.00,
      status: "Pending",
      transactionRef: "tx_luxe_pending_08b",
      createdAt: "2026-06-30T09:05:00Z"
    }
  ]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: "t1",
      clientName: "Abdulwahab Abdullah",
      rating: 5,
      comment: "The Aso-Oke weight and custom embroidery on my Agbada is peerless. I stood out profoundly in London. Truly high-fashion architecture.",
      isApproved: true,
      createdAt: "2026-06-29T18:00:00Z"
    },
    {
      id: "t2",
      clientName: "Sarah Jenkins",
      rating: 5,
      comment: "Draping of the jacket is exquisite. The soft shoulder silhouette sits completely naturally. Perfect Savile Row response.",
      isApproved: false,
      createdAt: "2026-06-30T10:00:00Z"
    }
  ]);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    { id: "g1", title: "Royal Ivory Sovereign Agbada", collection: "Traditional", imageUrl: "https://picsum.photos/seed/agbada1/600/600", isFeatured: true },
    { id: "g2", title: "Obsidian Savile Double-Breasted", collection: "Modern Tailoring", imageUrl: "https://picsum.photos/seed/suit1/600/600", isFeatured: true },
    { id: "g3", title: "Emerald Silk Brocade Kaftan", collection: "Traditional", imageUrl: "https://picsum.photos/seed/kaftan1/600/600", isFeatured: false }
  ]);

  // System Settings State
  const [pricingTraditionalMin, setPricingTraditionalMin] = useState<number>(1200);
  const [pricingTraditionalMax, setPricingTraditionalMax] = useState<number>(3500);
  const [pricingModernMin, setPricingModernMin] = useState<number>(800);
  const [pricingModernMax, setPricingModernMax] = useState<number>(2500);
  const [activeServices, setActiveServices] = useState([
    { id: "s1", name: "Sovereign Fitting Session", duration: 60, active: true },
    { id: "s2", name: "Savile Row Initial Consultation", duration: 45, active: true },
    { id: "s3", name: "VIP Fabric Swatch Custom Selection", duration: 90, active: true }
  ]);

  // Activity Feed
  const [activityFeed, setActivityFeed] = useState([
    { id: "act-1", type: "payment", text: "Invoice INV-2026-081 paid in full ($1,850.00)", time: "2 hours ago" },
    { id: "act-2", type: "measurement", text: "New metric sheet linked to client Abdulwahab Abdullah", time: "4 hours ago" },
    { id: "act-3", type: "appointment", text: "Fitting session confirmed for July 5th", time: "1 day ago" },
    { id: "act-4", type: "client", text: "Client profile created for Chief Folake Alakija", time: "2 days ago" }
  ]);

  // UI state controllers
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientForDrilldown, setSelectedClientForDrilldown] = useState<Client | null>(null);
  
  // Create state models
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [newClientNotes, setNewClientNotes] = useState("");

  const [selectedClientForMeasurement, setSelectedClientForMeasurement] = useState("");
  const [measurementType, setMeasurementType] = useState("Traditional Agbada");
  const [measurementChest, setMeasurementChest] = useState(42);
  const [measurementWaist, setMeasurementWaist] = useState(36);
  const [measurementSleeve, setMeasurementSleeve] = useState(32);
  const [measurementShoulder, setMeasurementShoulder] = useState(19);
  const [measurementLength, setMeasurementLength] = useState(56);
  const [measurementHips, setMeasurementHips] = useState(44);
  const [measurementNeck, setMeasurementNeck] = useState(16);
  const [measurementNotes, setMeasurementNotes] = useState("");

  const [selectedClientForOrder, setSelectedClientForOrder] = useState("");
  const [orderServiceName, setOrderServiceName] = useState("Traditional Royal Suite");
  const [orderItemName, setOrderItemName] = useState("Supreme Crown Agbada Suite");
  const [orderFabric, setOrderFabric] = useState("Hand-spun Golden Aso-Oke");
  const [orderAmount, setOrderAmount] = useState(1950);
  const [orderDueDate, setOrderDueDate] = useState("2026-08-10");
  const [orderItemNotes, setOrderItemNotes] = useState("");

  const [selectedClientForBooking, setSelectedClientForBooking] = useState("");
  const [bookingService, setBookingService] = useState("Sovereign Fitting Session");
  const [bookingDate, setBookingDate] = useState("2026-07-15");
  const [bookingTime, setBookingTime] = useState("11:00");
  const [bookingNotes, setBookingNotes] = useState("");

  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [selectedPrintMeasurement, setSelectedPrintMeasurement] = useState<Measurement | null>(null);
  const [paymentProcessingInvoice, setPaymentProcessingInvoice] = useState<Invoice | null>(null);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState<Invoice | null>(null);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  const triggerAlert = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 4000);
  };

  // Helper function to mock API calls + sync state
  const logActivity = (text: string, type: string = "system") => {
    setActivityFeed(prev => [
      { id: "act-" + Date.now(), type, text, time: "Just now" },
      ...prev
    ]);
  };

  // 1. Client & Measurement Workflow Action
  const handleCreateClientAndMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) {
      triggerAlert("Full Name and Email are strictly required.");
      return;
    }

    // Step 1: Create profile
    const newId = "c-" + Math.random().toString(36).substring(2, 9);
    const newClientObj: Client = {
      id: newId,
      fullName: newClientName,
      email: newClientEmail,
      phone: newClientPhone || "N/A",
      address: newClientAddress || "N/A",
      notes: newClientNotes,
      createdAt: new Date().toISOString()
    };

    setClients(prev => [newClientObj, ...prev]);
    logActivity(`Created profile for ${newClientName}`, "client");

    // Optional immediate step: Link custom baseline metrics
    const newMId = "m-" + Math.random().toString(36).substring(2, 9);
    const newMeasurementObj: Measurement = {
      id: newMId,
      clientId: newId,
      clientName: newClientName,
      type: "Baseline Silhouette Model",
      notes: "Auto-captured on registration",
      data: {
        chest: 40,
        waist: 34,
        sleeve: 33,
        shoulder: 18,
        length: 54,
        neck: 15.5,
        hips: 41
      },
      createdAt: new Date().toISOString()
    };

    setMeasurements(prev => [newMeasurementObj, ...prev]);
    logActivity(`Linked default silhouette coordinates to ${newClientName}`, "measurement");

    // Clear registration inputs
    setNewClientName("");
    setNewClientEmail("");
    setNewClientPhone("");
    setNewClientAddress("");
    setNewClientNotes("");

    triggerAlert("✓ Client profile and metrics generated successfully.");
  };

  // Create Measurement specifically
  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForMeasurement) {
      triggerAlert("Please select an active client profile first.");
      return;
    }

    const clientObj = clients.find(c => c.id === selectedClientForMeasurement);
    if (!clientObj) return;

    const newMId = "m-" + Math.random().toString(36).substring(2, 9);
    const newMeasurementObj: Measurement = {
      id: newMId,
      clientId: selectedClientForMeasurement,
      clientName: clientObj.fullName,
      type: measurementType,
      notes: measurementNotes,
      data: {
        chest: measurementChest,
        waist: measurementWaist,
        sleeve: measurementSleeve,
        shoulder: measurementShoulder,
        length: measurementLength,
        hips: measurementHips,
        neck: measurementNeck
      },
      createdAt: new Date().toISOString()
    };

    setMeasurements(prev => [newMeasurementObj, ...prev]);
    logActivity(`Custom metric card "${measurementType}" generated for ${clientObj.fullName}`, "measurement");
    triggerAlert("✓ Biometric measurement card compiled in database registry.");

    // Clear inputs
    setMeasurementNotes("");
  };

  // 2. Order Lifecycle Workflow Action
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForOrder) {
      triggerAlert("Select a client to link this order to.");
      return;
    }

    const clientObj = clients.find(c => c.id === selectedClientForOrder);
    if (!clientObj) return;

    // Check if client has measurements
    const clientMeas = measurements.find(m => m.clientId === selectedClientForOrder);
    if (!clientMeas) {
      triggerAlert("Warning: Client has no recorded measurements. Please record metrics first.");
      return;
    }

    const newOrderId = "o-" + Math.random().toString(36).substring(2, 9);
    const newOrder: Order = {
      id: newOrderId,
      clientId: selectedClientForOrder,
      clientName: clientObj.fullName,
      measurementId: clientMeas.id,
      serviceName: orderServiceName,
      status: "Draft",
      totalAmount: orderAmount,
      dueDate: orderDueDate,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: "oi-" + Date.now(),
          itemName: orderItemName,
          fabric: orderFabric,
          quantity: 1,
          price: orderAmount,
          notes: orderItemNotes
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    logActivity(`Generated Order draft for ${clientObj.fullName}`, "order");

    // Auto-generate associated Invoice
    const newInvoiceId = "inv-" + Math.random().toString(36).substring(2, 9);
    const newInvoiceObj: Invoice = {
      id: newInvoiceId,
      orderId: newOrderId,
      clientName: clientObj.fullName,
      invoiceNumber: "INV-2026-0" + (invoices.length + 81),
      amount: orderAmount,
      status: "Pending",
      transactionRef: "tx_luxe_pending_" + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoiceObj, ...prev]);
    logActivity(`Invoice ${newInvoiceObj.invoiceNumber} generated for ${clientObj.fullName}`, "billing");

    triggerAlert("✓ Order created, bound to client measurements, and initial invoice queued.");
  };

  // Order status update tracking path
  const advanceOrderStatus = (orderId: string, nextStatus: Order["status"]) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        logActivity(`Order ${o.id.substring(0, 8)} status advanced to: ${nextStatus}`, "order");
        
        // Mock notification trigger
        logActivity(`MOCK DISPATCH: Email notification sent via Resend to client detailing status change to "${nextStatus}".`, "mail");
        return { ...o, status: nextStatus };
      }
      return o;
    }));
    triggerAlert(`Order lifecycle state updated to ${nextStatus}.`);
  };

  // 3. Dynamic Scheduling Workflow Action
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForBooking) {
      triggerAlert("Please select a registered client profile.");
      return;
    }

    const clientObj = clients.find(c => c.id === selectedClientForBooking);
    if (!clientObj) return;

    // Automated Conflict Block check simulation
    const proposedDateTime = `${bookingDate}T${bookingTime}:00Z`;
    const hasConflict = appointments.some(app => {
      const timeDiff = Math.abs(new Date(app.appointmentDate).getTime() - new Date(proposedDateTime).getTime());
      return app.status !== "cancelled" && timeDiff < 45 * 60 * 1000; // 45 minute buffer
    });

    if (hasConflict) {
      triggerAlert("⚠️ Calendar conflict detected! A scheduled fitting is already taking place within 45 minutes of this slot.");
      return;
    }

    const newAppId = "a-" + Math.random().toString(36).substring(2, 9);
    const newAppObj: Appointment = {
      id: newAppId,
      clientId: selectedClientForBooking,
      clientName: clientObj.fullName,
      serviceId: "s-custom",
      serviceName: bookingService,
      appointmentDate: proposedDateTime,
      status: "scheduled",
      notes: bookingNotes,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppObj, ...prev]);
    logActivity(`Calendar fitting scheduled for ${clientObj.fullName} on ${bookingDate} at ${bookingTime}`, "appointment");
    logActivity(`MOCK DISPATCH: Booking confirmation email generated and queued via SendGrid API.`, "mail");
    triggerAlert("✓ Appointment registered on the Master Calendar. Automated notification sent.");
    
    // Clear
    setBookingNotes("");
  };

  // Toggle testimonial approval
  const toggleTestimonialApproval = (id: string) => {
    setTestimonials(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.isApproved;
        logActivity(`Testimonial from ${t.clientName} ${nextState ? "Approved" : "Unapproved"} for Portfolio Gallery.`, "reviews");
        return { ...t, isApproved: nextState };
      }
      return t;
    }));
  };

  // 4. Integrated Payment Workflow Action (Checkout Simulation popup)
  const initiateStripeCheckoutSim = (invoice: Invoice) => {
    setPaymentProcessingInvoice(invoice);
  };

  const completeMockPayment = () => {
    if (!paymentProcessingInvoice) return;

    const invoiceId = paymentProcessingInvoice.id;
    const orderId = paymentProcessingInvoice.orderId;

    // Update Invoice status
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: "Paid",
          paidAt: new Date().toISOString(),
          transactionRef: "tx_luxe_succeeded_" + Math.random().toString(36).substring(2, 9)
        };
      }
      return inv;
    }));

    // Update linked Order status to "Production"
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        logActivity(`Stripe Webhook processed successfully. Order ${orderId.substring(0,8)} advanced from 'Draft' to 'Production'.`, "order");
        return { ...o, status: "Production" };
      }
      return o;
    }));

    logActivity(`Stripe Checkout Successful. Captured $${paymentProcessingInvoice.amount.toLocaleString()} for Invoice ${paymentProcessingInvoice.invoiceNumber}.`, "payment");
    logActivity(`MOCK DISPATCH: Digital invoice receipt PDF generated and emailed to client on success.`, "mail");
    
    setPaymentProcessingInvoice(null);
    triggerAlert("✓ Webhook callback processed. Ledger updated, Order queued, receipt generated.");
  };

  const triggerRefund = (invoice: Invoice) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoice.id) {
        logActivity(`Refunding transaction ref ${inv.transactionRef} for $${inv.amount}`, "payment");
        return { ...inv, status: "Failed", transactionRef: "refunded_" + inv.transactionRef };
      }
      return inv;
    }));
    triggerAlert("✓ Refund process initialized. Financial ledgers adjusted.");
  };

  // Financial statistics
  const totalRevenue = useMemo(() => {
    return invoices
      .filter(i => i.status === "Paid")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [invoices]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status !== "Delivered").length;
  }, [orders]);

  const totalBookingsCount = useMemo(() => {
    return appointments.filter(a => a.status !== "cancelled").length;
  }, [appointments]);

  return (
    <section id="dashboard" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-b border-warm-gold/10">
      
      {/* Alert Banner Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#121212] border-2 border-warm-gold text-cream px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 font-mono text-xs max-w-md"
          >
            <CheckCircle className="w-5 h-5 text-warm-gold shrink-0 animate-pulse" />
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern High-End Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center space-x-2 text-warm-gold text-xs font-syne uppercase tracking-[0.3em] mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Artisan Management Operations</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-cream">
            Atelier <span className="font-light italic text-warm-gold">Dashboard</span>
          </h2>
          <p className="text-cream/70 font-sans text-xs sm:text-sm leading-relaxed max-w-2xl mt-3">
            Unified administrative node for our Lagos & London coordinates. Manage client files, capture biometrics, track couture order drapes, trigger payments, and verify booking conflicts.
          </p>
        </div>

        {/* Role Switch Gating Selector (Simulation control) */}
        <div className="bg-[#0D0D0D] border border-warm-gold/20 rounded-sm p-3 flex items-center justify-between gap-4 self-start md:self-auto shadow-md">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-warm-gold" />
            <span className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Gate Role View:</span>
          </div>
          <div className="flex bg-[#050505] rounded-sm p-1 gap-1 border border-cream/5">
            {(["admin", "tailor", "client"] as const).map(role => (
              <button
                key={role}
                onClick={() => {
                  setCurrentUserRole(role);
                  logActivity(`Simulated view-gating switched to role: [${role.toUpperCase()}]`, "system");
                }}
                className={`px-3 py-1 font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all ${
                  currentUserRole === role
                    ? "bg-warm-gold text-obsidian font-bold"
                    : "text-cream/50 hover:text-cream hover:bg-white/5"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nav Tabs for Dashboard Modules */}
      <div className="flex flex-wrap gap-2 border-b border-cream/10 pb-4 mb-10 overflow-x-auto">
        {[
          { id: "overview", label: "Overview Hub", icon: Activity },
          { id: "clients", label: "Clients Index", icon: Users },
          { id: "measurements", label: "Measurements Registry", icon: Scissors },
          { id: "orders", label: "Couture Orders", icon: TrendingUp },
          { id: "appointments", label: "Calendar Board", icon: Calendar },
          { id: "billing", label: "Payments & Receipts", icon: CreditCard },
          { id: "reviews", label: "Reviews Queue", icon: Star },
          { id: "settings", label: "System Setup", icon: Settings },
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-sm font-mono text-[10px] uppercase tracking-widest transition-all flex items-center space-x-2 border whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-warm-gold text-obsidian border-warm-gold font-bold"
                  : "bg-charcoal/20 text-cream/70 border-cream/5 hover:border-warm-gold/20 hover:bg-charcoal/40"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels with animations */}
      <div className="bg-[#0A0A0A] border border-warm-gold/15 rounded-sm p-6 sm:p-8 min-h-[500px]">
        
        {/* Role-based accessibility warning card if a client views certain panels */}
        {currentUserRole === "client" && activeTab !== "overview" && activeTab !== "appointments" && activeTab !== "reviews" && (
          <div className="h-[350px] flex flex-col justify-center items-center text-center p-6 bg-charcoal/10 border border-red-500/10 rounded-sm">
            <Lock className="w-12 h-12 text-red-400 mb-4 animate-bounce" />
            <h3 className="font-serif text-xl text-cream font-medium">Access Control Blocked</h3>
            <p className="text-xs text-cream/60 max-w-md mt-2 font-mono">
              The role <strong>CLIENT</strong> is strictly forbidden from direct modifications of billing systems, database schemas, and global measurement records. Use the Gating Selector above to switch to <strong>ADMIN</strong> or <strong>TAILOR</strong> views.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW HUB */}
          {(activeTab === "overview" || (currentUserRole === "client" && activeTab !== "overview" && activeTab !== "appointments" && activeTab !== "reviews" ? false : activeTab === "overview")) && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* KPIs Bento Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm relative overflow-hidden group hover:border-warm-gold/20 transition-all">
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-warm-gold/20 group-hover:bg-warm-gold transition-colors" />
                  <span className="text-[10px] font-mono uppercase text-cream/40 tracking-widest block">Atelier Revenue</span>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-serif text-3xl sm:text-4xl text-cream font-bold">${totalRevenue.toLocaleString()}</span>
                    <div className="p-2.5 bg-warm-gold/10 rounded-sm">
                      <DollarSign className="w-5 h-5 text-warm-gold" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-2">✓ Verified ledger receipts</span>
                </div>

                <div className="bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm relative overflow-hidden group hover:border-warm-gold/20 transition-all">
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-warm-gold/20 group-hover:bg-warm-gold transition-colors" />
                  <span className="text-[10px] font-mono uppercase text-cream/40 tracking-widest block">Active Commissions</span>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-serif text-3xl sm:text-4xl text-cream font-bold">{activeOrdersCount}</span>
                    <div className="p-2.5 bg-emerald-500/10 rounded-sm">
                      <Scissors className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-warm-gold/70 block mt-2">In baste & production loops</span>
                </div>

                <div className="bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm relative overflow-hidden group hover:border-warm-gold/20 transition-all">
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-warm-gold/20 group-hover:bg-warm-gold transition-colors" />
                  <span className="text-[10px] font-mono uppercase text-cream/40 tracking-widest block">Fittings Booked</span>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-serif text-3xl sm:text-4xl text-cream font-bold">{totalBookingsCount}</span>
                    <div className="p-2.5 bg-purple-500/10 rounded-sm">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cream/50 block mt-2">Lagos / London calendar slots</span>
                </div>

                <div className="bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm relative overflow-hidden group hover:border-warm-gold/20 transition-all">
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-warm-gold/20 group-hover:bg-warm-gold transition-colors" />
                  <span className="text-[10px] font-mono uppercase text-cream/40 tracking-widest block">Avg Order Value</span>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-serif text-3xl sm:text-4xl text-cream font-bold">$1,400</span>
                    <div className="p-2.5 bg-amber-500/10 rounded-sm">
                      <TrendingUp className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-2">+12% over last quarter</span>
                </div>

              </div>

              {/* Dynamic Sales Trends Custom SVG Chart & Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Custom Elegant Sales Chart - Col span 7 */}
                <div className="lg:col-span-7 bg-[#0E0E0E] border border-cream/5 rounded-sm p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-serif text-lg text-cream font-bold">Lagos-London Revenue Stream</h3>
                      <p className="text-[10px] font-mono text-cream/50">Fiscal trends first half of 2026 (Thousands USD)</p>
                    </div>
                    <span className="text-[9px] font-mono bg-warm-gold/10 text-warm-gold px-2 py-0.5 border border-warm-gold/20 rounded-sm">Live Feed</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative pt-4">
                    <svg viewBox="0 0 500 220" className="w-full h-auto overflow-visible">
                      {/* Grid Lines */}
                      <line x1="30" y1="180" x2="480" y2="180" stroke="#222" strokeWidth="1" />
                      <line x1="30" y1="130" x2="480" y2="130" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="30" y1="80" x2="480" y2="80" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="30" y1="30" x2="480" y2="30" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />

                      {/* Chart Line Path */}
                      <motion.path
                        d="M 50 160 Q 120 120, 190 140 T 330 70 T 470 40"
                        fill="none"
                        stroke="url(#chartGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />

                      {/* Accent Gradient fill */}
                      <path
                        d="M 50 160 Q 120 120, 190 140 T 330 70 T 470 40 L 470 180 L 50 180 Z"
                        fill="url(#areaGradient)"
                        opacity="0.1"
                      />

                      {/* Data Dots & Tooltips */}
                      {[
                        { x: 50, y: 160, val: "$15k", m: "Jan" },
                        { x: 130, y: 125, val: "$24k", m: "Feb" },
                        { x: 210, y: 138, val: "$20k", m: "Mar" },
                        { x: 290, y: 90, val: "$36k", m: "Apr" },
                        { x: 370, y: 60, val: "$45k", m: "May" },
                        { x: 450, y: 40, val: "$54k", m: "Jun" }
                      ].map((pt, idx) => (
                        <g key={idx} className="group/dot cursor-pointer">
                          <circle cx={pt.x} cy={pt.y} r="5" className="fill-warm-gold stroke-obsidian stroke-2 transition-all hover:scale-150" />
                          <text x={pt.x} y={pt.y - 12} textAnchor="middle" className="font-mono text-[9px] fill-warm-gold opacity-0 group-hover/dot:opacity-100 transition-opacity bg-obsidian py-0.5 px-1">{pt.val}</text>
                          <text x={pt.x} y="195" textAnchor="middle" className="font-mono text-[8px] fill-cream/40 uppercase tracking-widest">{pt.m}</text>
                        </g>
                      ))}

                      {/* Gradients declarations */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#C5A850" />
                          <stop offset="100%" stopColor="#E2CA7B" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C5A850" />
                          <stop offset="100%" stopColor="#C5A850" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Audit logs & action feed - Col span 5 */}
                <div className="lg:col-span-5 bg-[#0E0E0E] border border-cream/5 rounded-sm p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold mb-4">Operations Broadcast Feed</h3>
                    <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-charcoal">
                      {activityFeed.map((act) => (
                        <div key={act.id} className="flex gap-3 text-xs border-b border-cream/5 pb-2">
                          <div className="mt-0.5 shrink-0">
                            {act.type === "payment" && <CreditCard className="w-3.5 h-3.5 text-amber-400" />}
                            {act.type === "measurement" && <Scissors className="w-3.5 h-3.5 text-emerald-400" />}
                            {act.type === "appointment" && <Calendar className="w-3.5 h-3.5 text-purple-400" />}
                            {act.type === "client" && <Users className="w-3.5 h-3.5 text-blue-400" />}
                            {act.type === "mail" && <Mail className="w-3.5 h-3.5 text-sky-400" />}
                            {act.type === "system" && <Clock className="w-3.5 h-3.5 text-zinc-400" />}
                          </div>
                          <div>
                            <p className="text-cream/80 leading-relaxed font-sans">{act.text}</p>
                            <span className="text-[9px] font-mono text-cream/35">{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-cream/5 flex justify-between items-center text-[9px] font-mono text-cream/40">
                    <span>Master Node Connected</span>
                    <span>Lagos &bull; London v1.0.4</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: CLIENTS INDEX */}
          {activeTab === "clients" && currentUserRole !== "client" && (
            <motion.div
              key="clients-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search clients by name or email..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full bg-[#0E0E0E] border border-cream/10 text-cream rounded-sm p-2.5 pl-9 text-xs focus:border-warm-gold focus:outline-none placeholder-cream/30"
                  />
                  <Search className="w-4 h-4 text-cream/30 absolute left-3 top-3" />
                </div>

                <div className="text-xs font-mono text-cream/50">
                  Showing {filteredClients.length} of {clients.length} profiles
                </div>
              </div>

              {/* Grid of clients */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                  <div key={client.id} className="bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm relative space-y-4 hover:border-warm-gold/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-lg text-cream font-bold">{client.fullName}</h4>
                        <span className="font-mono text-[9px] text-cream/30 uppercase">{client.id.substring(0, 8)}</span>
                      </div>
                      <p className="text-xs text-warm-gold/80 font-mono mt-1">{client.email}</p>
                      
                      <div className="text-xs font-sans text-cream/70 space-y-1.5 mt-4">
                        <p><strong>Phone:</strong> {client.phone}</p>
                        <p><strong>Address:</strong> {client.address}</p>
                        <p className="text-[11px] text-cream/50 italic mt-2 line-clamp-2">" {client.notes || "No bespoke notes yet."} "</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-cream/5 flex justify-between gap-2 mt-4">
                      <button
                        onClick={() => setSelectedClientForDrilldown(client)}
                        className="px-3 py-1.5 bg-charcoal/40 hover:bg-charcoal border border-cream/10 hover:border-warm-gold text-cream hover:text-warm-gold font-mono text-[9px] uppercase tracking-wider rounded-sm transition-all"
                      >
                        Drill Down History
                      </button>
                      <button
                        onClick={() => {
                          setClients(prev => prev.filter(c => c.id !== client.id));
                          logActivity(`Deleted client folder ${client.fullName}`, "client");
                          triggerAlert("✓ Client purged from registries.");
                        }}
                        className="p-1.5 bg-red-950/20 text-red-400 hover:bg-red-900/30 hover:border-red-500 border border-red-900/30 rounded-sm transition-all"
                        aria-label="Delete client"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Client Card in layout */}
                <form onSubmit={handleCreateClientAndMeasurement} className="bg-[#080808] border-2 border-dashed border-warm-gold/15 p-6 rounded-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base text-warm-gold font-medium flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      Register New Client
                    </h4>
                    <p className="text-[10px] text-cream/40 font-mono mt-1">Triggers auto-baseline measurement profile link</p>

                    <div className="space-y-2 mt-4 text-xs font-mono">
                      <input
                        type="text"
                        placeholder="Full Name (required)"
                        required
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                      />
                      <input
                        type="email"
                        placeholder="Email (required)"
                        required
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                      />
                      <textarea
                        placeholder="Artisan brief notes..."
                        value={newClientNotes}
                        onChange={(e) => setNewClientNotes(e.target.value)}
                        className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35 h-16 resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-warm-gold hover:bg-cream text-obsidian text-[10px] font-bold font-syne uppercase tracking-widest rounded-sm transition-colors mt-4"
                  >
                    Compile Folder
                  </button>
                </form>
              </div>

              {/* Client Drilldown Modal */}
              <AnimatePresence>
                {selectedClientForDrilldown && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className="bg-[#0E0E0E] border-2 border-warm-gold/20 max-w-2xl w-full p-6 sm:p-8 rounded-sm space-y-6 max-h-[90vh] overflow-y-auto"
                    >
                      <div className="flex justify-between items-start border-b border-cream/10 pb-4">
                        <div>
                          <h3 className="font-serif text-2xl text-cream font-bold">{selectedClientForDrilldown.fullName}</h3>
                          <span className="font-mono text-[10px] text-warm-gold">Folder id: {selectedClientForDrilldown.id}</span>
                        </div>
                        <button
                          onClick={() => setSelectedClientForDrilldown(null)}
                          className="px-2.5 py-1 text-xs font-mono border border-cream/20 text-cream/70 hover:text-cream hover:border-warm-gold rounded-sm"
                        >
                          Close Folder
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Measurements link */}
                        <div className="space-y-3">
                          <h4 className="font-mono text-xs uppercase tracking-widest text-warm-gold font-bold">Biometric Metric sheets</h4>
                          <div className="bg-charcoal/10 border border-cream/5 p-3 rounded-sm text-xs font-mono space-y-2">
                            {measurements.filter(m => m.clientId === selectedClientForDrilldown.id).length === 0 ? (
                              <p className="text-cream/40">No metrics recorded.</p>
                            ) : (
                              measurements.filter(m => m.clientId === selectedClientForDrilldown.id).map(m => (
                                <div key={m.id} className="border-b border-cream/5 pb-2 last:border-0 last:pb-0">
                                  <div className="flex justify-between text-cream font-bold">
                                    <span>{m.type}</span>
                                    <span className="text-[10px] text-cream/40">{new Date(m.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-[10px] text-cream/60 mt-1">Chest: {m.data.chest}", Waist: {m.data.waist}", Sleeve: {m.data.sleeve}"</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Order ledger */}
                        <div className="space-y-3">
                          <h4 className="font-mono text-xs uppercase tracking-widest text-warm-gold font-bold">Historical Orders</h4>
                          <div className="bg-charcoal/10 border border-cream/5 p-3 rounded-sm text-xs font-mono space-y-2">
                            {orders.filter(o => o.clientId === selectedClientForDrilldown.id).length === 0 ? (
                              <p className="text-cream/40">No commissions requested.</p>
                            ) : (
                              orders.filter(o => o.clientId === selectedClientForDrilldown.id).map(o => (
                                <div key={o.id} className="border-b border-cream/5 pb-2 last:border-0 last:pb-0">
                                  <div className="flex justify-between text-cream font-bold">
                                    <span className="text-[11px] truncate max-w-[150px]">{o.items[0]?.itemName}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest ${
                                      o.status === "Delivered" ? "bg-green-500/15 text-green-400" : "bg-warm-gold/15 text-warm-gold"
                                    }`}>{o.status}</span>
                                  </div>
                                  <div className="flex justify-between text-[10px] text-cream/50 mt-1">
                                    <span>${o.totalAmount}</span>
                                    <span>Due: {o.dueDate}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TAB 3: MEASUREMENTS REGISTRY */}
          {activeTab === "measurements" && currentUserRole !== "client" && (
            <motion.div
              key="measurements-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Save Measurements Input - Col span 5 */}
                <form onSubmit={handleSaveMeasurement} className="lg:col-span-5 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-4">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold">Log Biometric Metrics</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1">Calibrated coordinates for draping precision</p>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <label className="block text-cream/60">Active Client Folder Link</label>
                    <select
                      value={selectedClientForMeasurement}
                      onChange={(e) => setSelectedClientForMeasurement(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none"
                    >
                      <option value="">-- Choose Client --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                      ))}
                    </select>

                    <label className="block text-cream/60 mt-2">Silhouette / Garment Style</label>
                    <input
                      type="text"
                      value={measurementType}
                      onChange={(e) => setMeasurementType(e.target.value)}
                      placeholder="e.g. Traditional Sovereign Agbada, Slim Fit Lounge Coat"
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                    />

                    {/* Numeric Measurement Matrix Inputs */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-cream/40 text-[10px]">Chest (inches)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementChest}
                          onChange={(e) => setMeasurementChest(parseFloat(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-cream/40 text-[10px]">Waist (inches)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementWaist}
                          onChange={(e) => setMeasurementWaist(parseFloat(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-cream/40 text-[10px]">Sleeve Length (inches)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementSleeve}
                          onChange={(e) => setMeasurementSleeve(parseFloat(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-cream/40 text-[10px]">Shoulder Width (inches)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementShoulder}
                          onChange={(e) => setMeasurementShoulder(parseFloat(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-cream/40 text-[10px]">Garment Length (inches)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementLength}
                          onChange={(e) => setMeasurementLength(parseFloat(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-cream/40 text-[10px]">Neck Collar (inches)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={measurementNeck}
                          onChange={(e) => setMeasurementNeck(parseFloat(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="block text-cream/60 mt-2">Drape Alignment Notes</label>
                    <textarea
                      value={measurementNotes}
                      onChange={(e) => setMeasurementNotes(e.target.value)}
                      placeholder="Special alignments, fabric-tension notes, seam structures..."
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35 h-16 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-warm-gold hover:bg-cream text-obsidian text-[10px] font-bold font-syne uppercase tracking-widest rounded-sm transition-colors mt-2"
                  >
                    Compile Metric Card
                  </button>
                </form>

                {/* Measurements Registry Feed List - Col span 7 */}
                <div className="lg:col-span-7 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-4">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold">Active Metrics Index</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1">Printable metric cards for atelier workshop hand-offs</p>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-charcoal">
                    {measurements.map(m => (
                      <div key={m.id} className="p-4 bg-charcoal/20 border border-cream/10 rounded-sm space-y-3 hover:border-warm-gold/25 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif text-base text-cream font-bold">{m.clientName}</h4>
                            <span className="font-mono text-[9px] text-warm-gold">{m.type}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPrintMeasurement(m);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="p-1.5 bg-charcoal/80 text-cream/80 hover:text-warm-gold border border-cream/10 hover:border-warm-gold/30 rounded-sm transition-all flex items-center space-x-1 font-mono text-[9px] uppercase tracking-wider"
                            >
                              <Download className="w-3 h-3" />
                              <span>Print Card</span>
                            </button>
                            <button
                              onClick={() => {
                                setMeasurements(prev => prev.filter(item => item.id !== m.id));
                                logActivity(`Purged measurement card ${m.id}`, "measurement");
                                triggerAlert("✓ Metric file deleted.");
                              }}
                              className="p-1.5 bg-red-950/20 text-red-400 hover:bg-red-900/30 border border-red-900/30 rounded-sm transition-all"
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Visual Metric Bento Block */}
                        <div className="grid grid-cols-4 gap-2 text-[11px] font-mono bg-obsidian p-3 rounded-sm border border-cream/5">
                          <div className="text-center p-1 border-r border-cream/5">
                            <span className="text-[8px] text-cream/40 uppercase tracking-wider block">Chest</span>
                            <span className="text-warm-gold font-bold">{m.data.chest || "N/A"}"</span>
                          </div>
                          <div className="text-center p-1 border-r border-cream/5">
                            <span className="text-[8px] text-cream/40 uppercase tracking-wider block">Waist</span>
                            <span className="text-warm-gold font-bold">{m.data.waist || "N/A"}"</span>
                          </div>
                          <div className="text-center p-1 border-r border-cream/5">
                            <span className="text-[8px] text-cream/40 uppercase tracking-wider block">Sleeve</span>
                            <span className="text-warm-gold font-bold">{m.data.sleeve || "N/A"}"</span>
                          </div>
                          <div className="text-center p-1">
                            <span className="text-[8px] text-cream/40 uppercase tracking-wider block">Length</span>
                            <span className="text-warm-gold font-bold">{m.data.length || "N/A"}"</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-cream/60 italic font-mono">"{m.notes}"</p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: COUTURE ORDERS LIFE-CYCLE */}
          {activeTab === "orders" && currentUserRole !== "client" && (
            <motion.div
              key="orders-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Create Couture Order Link Form - Col span 4 */}
                <form onSubmit={handleCreateOrder} className="lg:col-span-4 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-4 self-start">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold">Commission Couture</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1">Bind Client measurements directly to active invoice queue</p>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <label className="block text-cream/60">Client File Link</label>
                    <select
                      value={selectedClientForOrder}
                      onChange={(e) => setSelectedClientForOrder(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none"
                    >
                      <option value="">-- Select Registered Client --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                      ))}
                    </select>

                    <label className="block text-cream/60 mt-2">Couture Service Segment</label>
                    <input
                      type="text"
                      value={orderServiceName}
                      onChange={(e) => setOrderServiceName(e.target.value)}
                      placeholder="e.g. Mayfair Bespoke Suitings, Traditional Royal Suite"
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                    />

                    <label className="block text-cream/60 mt-2">Garment Description</label>
                    <input
                      type="text"
                      value={orderItemName}
                      onChange={(e) => setOrderItemName(e.target.value)}
                      placeholder="e.g. Obsidian Double-Breasted Suit"
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                    />

                    <label className="block text-cream/60 mt-2">Selected Loom Fabric</label>
                    <input
                      type="text"
                      value={orderFabric}
                      onChange={(e) => setOrderFabric(e.target.value)}
                      placeholder="e.g. Hand-spun Silk Aso-Oke"
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                    />

                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-cream/40 text-[10px]">Agreed Price ($)</label>
                        <input
                          type="number"
                          value={orderAmount}
                          onChange={(e) => setOrderAmount(parseInt(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-cream/40 text-[10px]">Delivery Due</label>
                        <input
                          type="date"
                          value={orderDueDate}
                          onChange={(e) => setOrderDueDate(e.target.value)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="block text-cream/60 mt-2">Atelier Workshop Directives</label>
                    <textarea
                      value={orderItemNotes}
                      onChange={(e) => setOrderItemNotes(e.target.value)}
                      placeholder="Baste stitch guidelines, pocket structures, cuffs alignments..."
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35 h-16 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-warm-gold hover:bg-cream text-obsidian text-[10px] font-bold font-syne uppercase tracking-widest rounded-sm transition-colors mt-2"
                  >
                    Authorize Order & Invoice
                  </button>
                </form>

                {/* Couture Commissions Active Flow - Col span 8 */}
                <div className="lg:col-span-8 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-4">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold">Couture Commissions Registry</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1">Real-time status tracking and client communication pipeline</p>
                  </div>

                  <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-charcoal">
                    {orders.map(order => (
                      <div key={order.id} className="p-5 bg-charcoal/20 border border-cream/10 rounded-sm space-y-4 hover:border-warm-gold/20 transition-all relative">
                        
                        {/* Title details bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div>
                            <span className="px-2 py-0.5 border border-warm-gold/30 text-warm-gold text-[8px] font-mono uppercase tracking-widest rounded-sm">
                              {order.serviceName}
                            </span>
                            <h4 className="font-serif text-lg text-cream font-bold mt-2">
                              {order.clientName}
                            </h4>
                            <p className="text-xs text-cream/60 font-mono">Commission ref: #{order.id.substring(0, 8)}</p>
                          </div>
                          
                          <div className="text-right sm:text-right font-mono text-xs">
                            <span className="text-cream/40">Commission Value:</span>
                            <p className="text-warm-gold font-bold text-lg">${order.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Bound metrics verification banner */}
                        <div className="bg-obsidian border border-cream/5 p-3 rounded-sm text-[10px] font-mono text-cream/60 flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <CheckSquare className="w-4 h-4 shrink-0" />
                            Linked Biometrics: ID {order.measurementId?.substring(0, 8)}
                          </span>
                          <span>Due: {order.dueDate}</span>
                        </div>

                        {/* Interactive Steps Timeline */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[9px] font-mono text-cream/40 uppercase tracking-widest block">Artisan Workshop Status Machine:</span>
                          <div className="grid grid-cols-5 gap-1 text-[9px] font-mono">
                            {(["Draft", "Baste Fitting", "Production", "Ready for Collection", "Delivered"] as const).map(step => {
                              const isCurrent = order.status === step;
                              return (
                                <button
                                  key={step}
                                  type="button"
                                  onClick={() => advanceOrderStatus(order.id, step)}
                                  className={`p-2 rounded-sm text-center border transition-all truncate ${
                                    isCurrent
                                      ? "bg-warm-gold text-obsidian border-warm-gold font-bold shadow-sm shadow-warm-gold/15"
                                      : "bg-charcoal/40 text-cream/50 border-cream/5 hover:border-cream/30 hover:text-cream"
                                  }`}
                                >
                                  {step}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Item and directives brief */}
                        <div className="bg-obsidian border border-cream/5 p-3 rounded-sm space-y-1.5">
                          <p className="text-xs font-mono text-cream/70">
                            <strong>Garment:</strong> {order.items[0]?.itemName} &bull; <strong className="text-warm-gold">Fabric:</strong> {order.items[0]?.fabric}
                          </p>
                          {order.items[0]?.notes && (
                            <p className="text-[10px] font-mono text-cream/40 italic">
                              "Directives: {order.items[0].notes}"
                            </p>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: CALENDAR BOARD */}
          {activeTab === "appointments" && (
            <motion.div
              key="appointments-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Book Consultation Form - Col span 4 */}
                <form onSubmit={handleCreateAppointment} className="lg:col-span-4 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-4 self-start">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold">Reserve Fitting Slot</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1">Automatic conflict verification of calendar buffers</p>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <label className="block text-cream/60">Registered Client File Link</label>
                    <select
                      value={selectedClientForBooking}
                      onChange={(e) => setSelectedClientForBooking(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none"
                    >
                      <option value="">-- Choose Active Profile --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                      ))}
                    </select>

                    <label className="block text-cream/60 mt-2">Artisan Booking Service</label>
                    <select
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none"
                    >
                      {activeServices.map(srv => (
                        <option key={srv.id} value={srv.name}>{srv.name} ({srv.duration} mins)</option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-cream/40 text-[10px]">Select Date</label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-cream/40 text-[10px]">Select Time Slot</label>
                        <input
                          type="time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="block text-cream/60 mt-2">Consultation Notes / Sample requests</label>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Request particular lace samples, traditional thread colors..."
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2 text-xs rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35 h-16 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-warm-gold hover:bg-cream text-obsidian text-[10px] font-bold font-syne uppercase tracking-widest rounded-sm transition-colors mt-2"
                  >
                    Confirm & Dispatch Bookings
                  </button>
                </form>

                {/* Calendar master feed view - Col span 8 */}
                <div className="lg:col-span-8 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-6">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold">Atelier Master Calendar Board</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1 font-sans">Active reservation loops across Lagos & London coordinate slots</p>
                  </div>

                  {/* Calendar Visual Layout Row Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] border-b border-cream/10 pb-2 mb-4 uppercase tracking-widest text-cream/40">
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-charcoal">
                    {appointments.map(app => (
                      <div key={app.id} className="p-4 bg-charcoal/20 border border-cream/10 rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-warm-gold/20 transition-all">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 text-[8px] font-mono rounded-sm border uppercase tracking-wider ${
                            app.status === "confirmed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          }`}>
                            {app.status}
                          </span>
                          <h4 className="font-serif text-base text-cream font-bold mt-2">{app.clientName}</h4>
                          <p className="text-[11px] text-warm-gold font-mono">{app.serviceName}</p>
                          {app.notes && <p className="text-[10px] text-cream/50 italic font-mono mt-1">"{app.notes}"</p>}
                        </div>

                        <div className="text-left sm:text-right space-y-2">
                          <p className="text-xs font-mono text-cream font-bold">
                            {new Date(app.appointmentDate).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs font-mono text-cream/70 flex items-center gap-1 sm:justify-end">
                            <Clock className="w-3.5 h-3.5 text-warm-gold" />
                            {new Date(app.appointmentDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                          </p>

                          <div className="flex gap-2 justify-start sm:justify-end pt-1">
                            {app.status === "scheduled" && (
                              <button
                                onClick={() => {
                                  setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, status: "confirmed" } : a));
                                  logActivity(`Confirmed appointment ${app.id.substring(0,6)}`, "appointment");
                                  triggerAlert("✓ Appointment slot confirmed.");
                                }}
                                className="px-2 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 rounded-sm text-[9px] font-mono uppercase"
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, status: "cancelled" } : a));
                                logActivity(`Cancelled appointment ${app.id.substring(0,6)}`, "appointment");
                                triggerAlert("✓ Appointment status changed to Cancelled.");
                              }}
                              className="px-2 py-1 bg-red-950/20 text-red-400 border border-red-900/30 rounded-sm text-[9px] font-mono uppercase"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 6: PAYMENTS & RECEIPTS */}
          {activeTab === "billing" && currentUserRole !== "client" && (
            <motion.div
              key="billing-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-serif text-lg text-cream font-bold">Payments Ledger & Invoices</h3>
                <p className="text-[10px] font-mono text-cream/50 mt-1">Direct integration loop with Stripe checkout systems and webhook simulators</p>
              </div>

              {/* Invoices Index Table */}
              <div className="bg-[#0E0E0E] border border-cream/5 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-charcoal/50 border-b border-cream/10 text-cream/40 text-[9px] uppercase tracking-wider">
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Gateway Reference</th>
                      <th className="p-4">Paid Timestamp</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream/5">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-cream">{inv.invoiceNumber}</td>
                        <td className="p-4 font-sans text-cream/80">{inv.clientName}</td>
                        <td className="p-4 font-bold text-warm-gold">${inv.amount.toLocaleString()}</td>
                        <td className="p-4 text-cream/40">{inv.transactionRef}</td>
                        <td className="p-4 text-cream/50">{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "Pending Handshake"}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-wider ${
                            inv.status === "Paid" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          {inv.status === "Pending" && (
                            <button
                              onClick={() => initiateStripeCheckoutSim(inv)}
                              className="px-2 py-1 bg-warm-gold hover:bg-cream text-obsidian rounded-sm text-[9px] font-bold uppercase tracking-wider"
                            >
                              Pay (Stripe Sim)
                            </button>
                          )}
                          <button
                            onClick={() => setShowInvoiceViewer(inv)}
                            className="p-1 bg-charcoal/40 text-cream/70 hover:text-warm-gold border border-cream/5 hover:border-warm-gold/20 rounded-sm inline-flex items-center justify-center align-middle"
                            title="View Invoice PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {inv.status === "Paid" && (
                            <button
                              onClick={() => triggerRefund(inv)}
                              className="px-2 py-1 bg-red-950/20 text-red-400 border border-red-900/30 rounded-sm text-[9px] font-mono uppercase hover:bg-red-900/30"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Checkout flow overlay modal popup */}
              <AnimatePresence>
                {paymentProcessingInvoice && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="bg-[#0D0D0D] border border-warm-gold max-w-md w-full p-6 sm:p-8 rounded-sm space-y-6 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-warm-gold" />
                      
                      <div className="flex justify-between items-start border-b border-cream/10 pb-4">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-warm-gold">Payment Gateway Integration Portal</span>
                          <h3 className="font-serif text-xl text-cream font-bold mt-1">Stripe Checkout</h3>
                        </div>
                        <button
                          onClick={() => setPaymentProcessingInvoice(null)}
                          className="px-2 py-1 text-[10px] font-mono border border-cream/10 hover:border-warm-gold rounded-sm text-cream/60 hover:text-cream"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="bg-obsidian border border-cream/5 p-4 rounded-sm space-y-3 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-cream/50">Billing Email:</span>
                          <span className="text-cream font-bold">abdulwahab@agbadaluxe.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/50">Invoice Number:</span>
                          <span className="text-cream font-bold">{paymentProcessingInvoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/50">Amount:</span>
                          <span className="text-warm-gold font-bold text-sm">${paymentProcessingInvoice.amount.toLocaleString()} USD</span>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-sm text-[10px] font-mono text-blue-300 leading-relaxed">
                        ⚠️ <strong>Integrations Handshake Simulation:</strong> Clicking "Complete Simulated Purchase" mimics a successful Stripe webhook callback (`charge.successful`). It synchronously advances the order to 'Production', executes digital invoice PDF compilation, and dispatches a notification via Resend API.
                      </div>

                      <button
                        onClick={completeMockPayment}
                        className="w-full py-3 bg-warm-gold hover:bg-cream text-obsidian text-xs font-bold font-syne uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Complete Simulated Purchase
                      </button>

                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Simple elegant invoice PDF pop-up */}
              <AnimatePresence>
                {showInvoiceViewer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                  >
                    <motion.div
                      className="bg-cream text-obsidian max-w-xl w-full p-8 rounded-sm space-y-6 shadow-2xl relative"
                    >
                      <button
                        onClick={() => setShowInvoiceViewer(null)}
                        className="absolute top-4 right-4 px-3 py-1 bg-obsidian text-cream text-[10px] uppercase font-mono rounded-sm hover:bg-charcoal transition-colors"
                      >
                        Close PDF
                      </button>

                      <div className="border-b border-obsidian/10 pb-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="font-serif text-2xl font-bold tracking-tight">AGBADA LUXE</h2>
                            <p className="text-[9px] font-mono text-obsidian/60">House of Haute Couture &bull; Lagos-London</p>
                          </div>
                          <div className="text-right font-mono text-xs">
                            <h3 className="font-bold uppercase tracking-wider text-[11px]">Invoice Document</h3>
                            <p>{showInvoiceViewer.invoiceNumber}</p>
                            <p className="text-[10px] text-obsidian/60 mt-1">{new Date(showInvoiceViewer.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 font-sans text-xs">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-obsidian/40 block">Billed To</span>
                          <p className="font-bold text-sm mt-1">{showInvoiceViewer.clientName}</p>
                          <p className="text-obsidian/70">Atelier Private Client Folder</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-obsidian/40 block">Origin Office</span>
                          <p className="font-bold text-sm mt-1">Savile Row Office</p>
                          <p className="text-obsidian/70">18 Savile Row, Mayfair, London</p>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="border-t border-b border-obsidian/10 py-4 font-mono text-xs">
                        <div className="flex justify-between font-bold text-obsidian/40 text-[9px] uppercase tracking-wider mb-2">
                          <span>Description</span>
                          <span>Line Total</span>
                        </div>
                        <div className="flex justify-between font-sans">
                          <div>
                            <p className="font-bold">Bespoke Silhouette Commision</p>
                            <span className="text-[10px] text-obsidian/60">Includes hand looming and custom baste fitting alignments</span>
                          </div>
                          <span className="font-mono font-bold">${showInvoiceViewer.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Summary calculations */}
                      <div className="flex justify-between items-center pt-2 font-mono text-xs">
                        <div className="text-[10px] text-obsidian/50">
                          <strong>Payment Status:</strong> {showInvoiceViewer.status.toUpperCase()}<br />
                          <strong>Transaction Ref:</strong> {showInvoiceViewer.transactionRef.substring(0, 16)}
                        </div>
                        <div className="text-right">
                          <span className="text-obsidian/50 block">Amount Payable (USD):</span>
                          <p className="font-serif text-2xl font-bold text-obsidian">${showInvoiceViewer.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-obsidian/5 text-center font-mono text-[9px] text-obsidian/40 uppercase tracking-[0.2em]">
                        Thank you for commissioning our House.
                      </div>

                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TAB 7: TESTIMONIAL REVIEW QUEUE */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Review moderation queue - Col span 7 */}
                <div className="lg:col-span-7 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-6">
                  <div>
                    <h3 className="font-serif text-lg text-cream font-bold">Client Review Moderation</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1">Single-click toggle to push verified testimonials straight to public layouts</p>
                  </div>

                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-charcoal">
                    {testimonials.map(test => (
                      <div key={test.id} className="p-4 bg-charcoal/20 border border-cream/10 rounded-sm space-y-3 relative hover:border-warm-gold/20 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif text-base text-cream font-bold">{test.clientName}</h4>
                            <div className="flex gap-1 text-warm-gold mt-1">
                              {Array.from({ length: test.rating }).map((_, idx) => (
                                <Star key={idx} className="w-3.5 h-3.5 fill-warm-gold" />
                              ))}
                            </div>
                          </div>

                          {/* Approval Switch Toggle */}
                          {currentUserRole !== "client" ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] text-cream/40 uppercase tracking-wider">Approved?</span>
                              <button
                                onClick={() => toggleTestimonialApproval(test.id)}
                                className={`w-12 h-6 rounded-full transition-all border p-0.5 flex ${
                                  test.isApproved 
                                    ? "bg-warm-gold/25 border-warm-gold justify-end" 
                                    : "bg-charcoal border-cream/10 justify-start"
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full transition-colors ${test.isApproved ? "bg-warm-gold" : "bg-cream/40"}`} />
                              </button>
                            </div>
                          ) : (
                            <span className={`px-2 py-0.5 text-[8px] font-mono rounded-sm border uppercase tracking-wider ${
                              test.isApproved ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            }`}>
                              {test.isApproved ? "Active on Site" : "Pending Mod"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-cream/75 leading-relaxed font-sans italic">
                          " {test.comment} "
                        </p>
                        <span className="text-[9px] font-mono text-cream/30 block text-right">{new Date(test.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit review simulated pipeline - Col span 5 */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const nameInput = form.elements.namedItem("revName") as HTMLInputElement;
                    const commentInput = form.elements.namedItem("revComment") as HTMLTextAreaElement;
                    if (!nameInput.value || !commentInput.value) return;

                    const newReview: Testimonial = {
                      id: "t-" + Date.now(),
                      clientName: nameInput.value,
                      rating: 5,
                      comment: commentInput.value,
                      isApproved: false, // Must pass through moderation queue
                      createdAt: new Date().toISOString()
                    };

                    setTestimonials(prev => [newReview, ...prev]);
                    logActivity(`New client testimonial received from ${nameInput.value}. Queued for Moderation.`, "reviews");
                    triggerAlert("✓ Testimonial submitted. Sent to admin moderation queue.");
                    nameInput.value = "";
                    commentInput.value = "";
                  }}
                  className="lg:col-span-5 bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-4 self-start"
                >
                  <div>
                    <h3 className="font-serif text-lg text-warm-gold font-bold">Client Review Pipeline</h3>
                    <p className="text-[10px] font-mono text-cream/50 mt-1">Simulates the external frontend client submission experience</p>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <label className="block text-cream/60">Client Signature (Name)</label>
                    <input
                      name="revName"
                      type="text"
                      required
                      placeholder="Your full signature name..."
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35"
                    />

                    <label className="block text-cream/60 mt-2">Testimonial Comment</label>
                    <textarea
                      name="revComment"
                      required
                      placeholder="Share your bespoke luxury experience..."
                      className="w-full bg-obsidian border border-cream/10 text-cream p-2.5 rounded-sm focus:border-warm-gold focus:outline-none placeholder-cream/35 h-24 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-warm-gold hover:bg-cream text-obsidian text-[10px] font-bold font-syne uppercase tracking-widest rounded-sm transition-colors"
                  >
                    Dispatch Feedback Row
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* TAB 8: SYSTEM SETTINGS */}
          {activeTab === "settings" && currentUserRole !== "client" && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Access control and active segments */}
              <div className="bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-cream font-bold">Price Matrix Sectors</h3>
                  <p className="text-[10px] font-mono text-cream/50 mt-1">Set global guidelines for automated invoicing estimations</p>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 bg-charcoal/20 border border-cream/5 rounded-sm space-y-3">
                    <span className="text-warm-gold font-bold text-[10px] uppercase tracking-widest block">Traditional Couture</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-cream/40 text-[9px]">Min Estimate ($)</label>
                        <input
                          type="number"
                          value={pricingTraditionalMin}
                          onChange={(e) => setPricingTraditionalMin(parseInt(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-1.5 text-xs rounded-sm focus:border-warm-gold"
                        />
                      </div>
                      <div>
                        <label className="text-cream/40 text-[9px]">Max Estimate ($)</label>
                        <input
                          type="number"
                          value={pricingTraditionalMax}
                          onChange={(e) => setPricingTraditionalMax(parseInt(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-1.5 text-xs rounded-sm focus:border-warm-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-charcoal/20 border border-cream/5 rounded-sm space-y-3">
                    <span className="text-warm-gold font-bold text-[10px] uppercase tracking-widest block">Modern Savile Suits</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-cream/40 text-[9px]">Min Estimate ($)</label>
                        <input
                          type="number"
                          value={pricingModernMin}
                          onChange={(e) => setPricingModernMin(parseInt(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-1.5 text-xs rounded-sm focus:border-warm-gold"
                        />
                      </div>
                      <div>
                        <label className="text-cream/40 text-[9px]">Max Estimate ($)</label>
                        <input
                          type="number"
                          value={pricingModernMax}
                          onChange={(e) => setPricingModernMax(parseInt(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-cream/10 text-cream p-1.5 text-xs rounded-sm focus:border-warm-gold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logActivity("Global pricing matrix configurations updated.", "system");
                    triggerAlert("✓ Global system pricing constants updated.");
                  }}
                  className="w-full py-2.5 bg-warm-gold hover:bg-cream text-obsidian text-[10px] font-bold font-syne uppercase tracking-widest rounded-sm transition-colors"
                >
                  Apply Financial Rules
                </button>
              </div>

              {/* Gating services toggle */}
              <div className="bg-[#0E0E0E] border border-cream/5 p-6 rounded-sm space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-cream font-bold">Enabled Active Services</h3>
                  <p className="text-[10px] font-mono text-cream/50 mt-1">Activate or disable slots and services on the client booking page</p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  {activeServices.map(srv => (
                    <div key={srv.id} className="p-3 bg-charcoal/20 border border-cream/5 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="text-cream font-bold block">{srv.name}</span>
                        <span className="text-[9px] text-cream/40">{srv.duration} Minutes fitting session</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveServices(prev => prev.map(s => s.id === srv.id ? { ...s, active: !s.active } : s));
                          logActivity(`Consultation service '${srv.name}' toggled.`, "system");
                        }}
                        className={`px-3 py-1 text-[9px] uppercase tracking-wider font-bold rounded-sm border transition-all ${
                          srv.active
                            ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                            : "bg-charcoal border-cream/10 text-cream/40"
                        }`}
                      >
                        {srv.active ? "Active" : "Disabled"}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mock secure storage file upload simulation */}
                <div className="p-4 bg-charcoal/30 border border-warm-gold/20 rounded-sm space-y-3">
                  <div className="flex items-center gap-1.5 text-warm-gold">
                    <Upload className="w-4 h-4" />
                    <span className="font-bold text-[10px] uppercase tracking-widest block">Secure Media Storage</span>
                  </div>
                  <p className="text-[10px] text-cream/60 leading-relaxed font-sans">
                    Simulated asset uploader to securely write fashion illustration sketches, fabric receipt scans, and basted images into <code>Supabase Storage Bucket: couture-media</code>.
                  </p>
                  <button
                    onClick={() => {
                      logActivity(`Uploaded draft_model_sketch_7.png securely into Supabase couture-media bucket.`, "system");
                      triggerAlert("✓ File securely written to Supabase Storage Bucket.");
                    }}
                    className="w-full py-1.5 bg-charcoal/60 hover:bg-charcoal text-cream hover:text-warm-gold border border-cream/10 hover:border-warm-gold/30 rounded-sm text-[9px] uppercase font-mono"
                  >
                    Simulate Upload Sketch
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </section>
  );
}
