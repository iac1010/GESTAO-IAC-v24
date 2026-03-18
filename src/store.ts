import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './lib/supabase';
import { toast } from 'react-hot-toast';
import { NBR5674_STANDARDS } from './constants/maintenance';

export type Client = {
  id: string;
  name: string;
  document?: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
  locations?: { id: string; name: string }[];
};

export type ChecklistItem = {
  id: string;
  task: string;
  category: string;
  clientId?: string; // Legacy: If undefined, it's a global checklist item
  clientIds?: string[]; // New: Array of client IDs. If empty or undefined, and clientId is also undefined, it's global.
};

export type TicketType = 'PREVENTIVA' | 'CORRETIVA' | 'TAREFA';

export type TicketStatus = 'PENDENTE_APROVACAO' | 'APROVADO' | 'AGUARDANDO_MATERIAL' | 'REALIZANDO' | 'CONCLUIDO' | 'REJEITADO';

export type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Quote = {
  id: string;
  clientId: string;
  date: string;
  items: QuoteItem[];
  totalValue: number;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';
};

export type Receipt = {
  id: string;
  clientId: string;
  date: string;
  value: number;
  description: string;
};

export type Cost = {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
};

export type Appointment = {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'TICKET' | 'MEETING' | 'OTHER';
  ticketId?: string;
  notes?: string;
};

export type Ticket = {
  id: string;
  osNumber?: string;
  title?: string;
  type: TicketType;
  status?: TicketStatus;
  maintenanceCategory?: string;
  maintenanceSubcategory?: string;
  clientId?: string;
  date: string;
  technician: string;
  observations: string;
  color?: string;
  
  // QR Code / Public Reporting fields
  reportedBy?: string;
  location?: string;
  photoBefore?: string;
  budgetAmount?: number;
  budgetApproved?: boolean;
  
  // Corretiva fields
  reportedProblem?: string;
  productsForQuote?: string;
  serviceReport?: string;
  
  // Preventiva fields
  checklistResults?: {
    taskId: string;
    status: 'OK' | 'NOK' | 'NA';
    notes: string;
  }[];
  images?: string[];
  history?: {
    id: string;
    date: string;
    note: string;
    userName?: string;
  }[];
};

export type CompanyData = {
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
};

export type Product = {
  id: string;
  code?: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: 'LIMPEZA' | 'PISCINA' | 'GERAL';
};

export type SupplyItem = {
  id: string;
  name: string;
  category: 'LIMPEZA' | 'PISCINA';
  currentStock: number;
  minStock: number;
  unit: string;
  lastPrice?: number;
  clientId?: string;
};

export type SupplyQuotation = {
  id: string;
  date: string;
  items: {
    supplyItemId: string;
    quantity: number;
  }[];
  responses: {
    supplierId: string;
    prices: { [supplyItemId: string]: number };
    status: 'PENDING' | 'RECEIVED';
  }[];
  status: 'OPEN' | 'CLOSED';
};

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export type Payment = {
  id: string;
  clientId: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: PaymentStatus;
  reference: string;
};

export type LegalAgreement = {
  id: string;
  clientId: string;
  totalAmount: number;
  installments: number;
  remainingInstallments: number;
  status: 'ACTIVE' | 'COMPLETED' | 'BREACHED';
  startDate: string;
  notes?: string;
};

export type ScheduledMaintenance = {
  id: string;
  clientId: string;
  standardId: string;
  item: string;
  frequency: 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
  lastDone?: string;
  nextDate: string;
  status: 'PENDING' | 'DONE' | 'OVERDUE';
  category: string;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  link?: string;
};

export type ConsumptionReading = {
  id: string;
  clientId: string;
  type: 'WATER' | 'GAS';
  previousValue: number;
  currentValue: number;
  consumption: number;
  date: string;
  unit: string;
  billed: boolean;
};

export type Vote = {
  id: string;
  userId: string;
  userName: string;
  optionId: string;
  timestamp: string;
  signature: string;
};

export type AssemblyOption = {
  id: string;
  text: string;
};

export type Assembly = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
  options: AssemblyOption[];
  votes: Vote[];
  legalValidityHash: string;
};

export type DigitalFolderItem = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  date: string;
  amount?: number;
  fileUrl: string;
  status: 'PENDING' | 'VALIDATED' | 'REJECTED';
  signatures: {
    id: string;
    userName: string;
    role: string;
    date: string;
  }[];
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'MAINTENANCE' | 'EVENT' | 'GENERAL' | 'SECURITY';
  tower?: string;
  apartmentLine?: string;
  clientId: string;
};

export type Package = {
  id: string;
  residentName: string;
  apartment: string;
  tower: string;
  carrier: string;
  trackingCode?: string;
  receivedAt: string;
  pickedUpAt?: string;
  status: 'PENDING' | 'PICKED_UP';
  qrCode: string;
  photoUrl?: string;
  clientId?: string;
};

export type Visitor = {
  id: string;
  name: string;
  document?: string;
  type: 'VISITOR' | 'SERVICE_PROVIDER';
  apartment: string;
  tower: string;
  validUntil: string;
  qrCode: string;
  status: 'ACTIVE' | 'EXPIRED' | 'USED';
};

export type CriticalEvent = {
  id: string;
  device: string;
  location: string;
  type: 'PUMP' | 'DOOR' | 'FIRE' | 'ELECTRICAL';
  status: 'NORMAL' | 'ALERT' | 'CRITICAL';
  lastUpdate: string;
  description: string;
};

export type EnergyRecord = {
  month: string;
  consumption: number; // kWh
  solarGeneration: number; // kWh
  sensorSavings: number; // kWh (estimated savings from sensors)
  costWithoutTech: number; // R$
  actualCost: number; // R$
};

interface AppState {
  clients: Client[];
  checklistItems: ChecklistItem[];
  tickets: Ticket[];
  quotes: Quote[];
  receipts: Receipt[];
  costs: Cost[];
  appointments: Appointment[];
  products: Product[];
  suppliers: Supplier[];
  supplyItems: SupplyItem[];
  supplyQuotations: SupplyQuotation[];
  payments: Payment[];
  legalAgreements: LegalAgreement[];
  scheduledMaintenances: ScheduledMaintenance[];
  notifications: AppNotification[];
  consumptionReadings: ConsumptionReading[];
  digitalFolder: DigitalFolderItem[];
  assemblies: Assembly[];
  notices: Notice[];
  packages: Package[];
  visitors: Visitor[];
  criticalEvents: CriticalEvent[];
  energyData: EnergyRecord[];
  companyLogo: string | null;
  companySignature: string | null;
  companyData: CompanyData | null;
  companySettingsId: string | null;
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  menuOrder: string[];
  hiddenTiles: string[];
  isLoading: boolean;
  
  fetchInitialData: () => Promise<void>;
  setCompanyLogo: (logo: string | null) => Promise<void>;
  setCompanySignature: (signature: string | null) => Promise<void>;
  setCompanyData: (data: CompanyData) => Promise<void>;
  setMenuOrder: (order: string[]) => Promise<void>;
  toggleTileVisibility: (tileId: string) => void;
  toggleTheme: () => Promise<void>;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, client: Omit<Client, 'id'>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  addChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  updateChecklistItem: (id: string, item: Omit<ChecklistItem, 'id'>) => void;
  deleteChecklistItem: (id: string) => void;
  
  addTicket: (ticket: Omit<Ticket, 'id'>) => void;
  updateTicket: (id: string, ticket: Omit<Ticket, 'id'>) => void;
  deleteTicket: (id: string) => void;

  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (id: string, quote: Omit<Quote, 'id'>) => void;
  deleteQuote: (id: string) => void;

  addReceipt: (receipt: Omit<Receipt, 'id'>) => void;
  deleteReceipt: (id: string) => void;

  addCost: (cost: Omit<Cost, 'id'>) => void;
  deleteCost: (id: string) => void;

  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Omit<Appointment, 'id'>) => void;
  deleteAppointment: (id: string) => void;

  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  importProducts: (products: Omit<Product, 'id'>[]) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Omit<Supplier, 'id'>) => void;
  deleteSupplier: (id: string) => void;

  addSupplyItem: (item: Omit<SupplyItem, 'id'>) => void;
  updateSupplyItem: (id: string, item: Omit<SupplyItem, 'id'>) => void;
  deleteSupplyItem: (id: string) => void;
  updateStock: (id: string, quantity: number) => void;

  createQuotation: (items: { supplyItemId: string; quantity: number }[]) => void;
  updateQuotationResponse: (quotationId: string, supplierId: string, prices: { [key: string]: number }) => void;
  
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  addLegalAgreement: (agreement: Omit<LegalAgreement, 'id'>) => void;
  updateLegalAgreement: (id: string, agreement: Partial<LegalAgreement>) => void;
  deleteLegalAgreement: (id: string) => void;

  addScheduledMaintenance: (maintenance: Omit<ScheduledMaintenance, 'id'>) => void;
  updateScheduledMaintenance: (id: string, maintenance: Partial<ScheduledMaintenance>) => void;
  deleteScheduledMaintenance: (id: string) => void;
  generateSchedulesForClient: (clientId: string) => void;
  
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  addConsumptionReading: (reading: Omit<ConsumptionReading, 'id'>) => void;
  addDigitalFolderItem: (item: Omit<DigitalFolderItem, 'id' | 'signatures' | 'status'>) => void;
  validateDigitalFolderItem: (id: string, userName: string, role: string) => void;
  addAssembly: (assembly: Omit<Assembly, 'id' | 'votes' | 'legalValidityHash'>) => void;
  castVote: (assemblyId: string, optionId: string, userName: string) => void;
  closeAssembly: (id: string) => void;
  deleteAssembly: (id: string) => void;

  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;

  addPackage: (pkg: Omit<Package, 'id' | 'receivedAt' | 'status' | 'qrCode'>) => void;
  pickupPackage: (id: string) => void;
  
  addVisitor: (visitor: Omit<Visitor, 'id' | 'qrCode' | 'status'>) => void;
  revokeVisitor: (id: string) => void;

  updateCriticalEvent: (id: string, status: CriticalEvent['status'], description: string) => void;
  addTicketHistory: (ticketId: string, note: string, userName?: string) => void;
  setEnergyData: (data: EnergyRecord[]) => void;

  restoreData: (data: Partial<AppState>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      clients: [],
      checklistItems: [],
      tickets: [],
      quotes: [],
      receipts: [],
      costs: [],
      appointments: [],
      products: [],
      suppliers: [],
      supplyItems: [],
      supplyQuotations: [],
      payments: [],
      legalAgreements: [],
      scheduledMaintenances: [],
      notifications: [],
      consumptionReadings: [],
      digitalFolder: [],
      notices: [],
      packages: [],
      visitors: [],
      criticalEvents: [],
      energyData: [],
      assemblies: [],
      companyLogo: '',
      companySignature: '',
      companySettingsId: null,
      companyData: {
        name: '',
        document: '',
        phone: '',
        email: '',
        address: '',
        website: ''
      },
      theme: 'light',
      isAuthenticated: false,
      menuOrder: ['dashboard', 'accountability', 'consumption', 'clients', 'products', 'supplies', 'tickets', 'kanban', 'quotes', 'receipts', 'financial', 'calendar', 'settings'],
      hiddenTiles: [],
      isLoading: false,
      
      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          // Fetch all data in parallel
          const results = await Promise.all([
            supabase.from('clients').select('*'),
            supabase.from('tickets').select('*'),
            supabase.from('products').select('*'),
            supabase.from('quotes').select('*'),
            supabase.from('receipts').select('*'),
            supabase.from('costs').select('*'),
            supabase.from('appointments').select('*'),
            supabase.from('checklist_items').select('*'),
            supabase.from('suppliers').select('*'),
            supabase.from('supply_items').select('*'),
            supabase.from('payments').select('*'),
            supabase.from('legal_agreements').select('*'),
            supabase.from('scheduled_maintenances').select('*'),
            supabase.from('consumption_readings').select('*'),
            supabase.from('assemblies').select('*'),
            supabase.from('notices').select('*'),
            supabase.from('packages').select('*'),
            supabase.from('visitors').select('*'),
            supabase.from('critical_events').select('*'),
            supabase.from('digital_folder').select('*'),
            supabase.from('supply_quotations').select('*'),
            supabase.from('company_settings').select('*').single()
          ]);

          const [
            clientsRes, ticketsRes, productsRes, quotesRes, receiptsRes, 
            costsRes, appointmentsRes, checklistRes, suppliersRes, 
            supplyItemsRes, paymentsRes, legalAgreementsRes, 
            scheduledMaintenancesRes, consumptionReadingsRes, 
            assembliesRes, noticesRes, packagesRes, visitorsRes, 
            criticalEventsRes, digitalFolderRes, supplyQuotationsRes, 
            companySettingsRes
          ] = results;

          // Check for errors
          results.forEach((res, index) => {
            if (res.error) {
              console.error(`Erro ao carregar tabela (index ${index}):`, res.error);
              if (res.error.code === '42P01') {
                toast.error(`Tabela não encontrada no Supabase. Verifique se executou o script SQL.`);
              }
            }
          });

          const clientsData = clientsRes.data;
          const ticketsData = ticketsRes.data;
          const productsData = productsRes.data;
          const quotesData = quotesRes.data;
          const receiptsData = receiptsRes.data;
          const costsData = costsRes.data;
          const appointmentsData = appointmentsRes.data;
          const checklistData = checklistRes.data;
          const suppliersData = suppliersRes.data;
          const supplyItemsData = supplyItemsRes.data;
          const paymentsData = paymentsRes.data;
          const legalAgreementsData = legalAgreementsRes.data;
          const scheduledMaintenancesData = scheduledMaintenancesRes.data;
          const consumptionReadingsData = consumptionReadingsRes.data;
          const assembliesData = assembliesRes.data;
          const noticesData = noticesRes.data;
          const packagesData = packagesRes.data;
          const visitorsData = visitorsRes.data;
          const criticalEventsData = criticalEventsRes.data;
          const companySettingsData = companySettingsRes.data;

          const newState: Partial<AppState> = {};

          if (clientsData) {
            newState.clients = clientsData.map(c => ({
              id: c.id,
              name: c.name,
              document: c.document,
              contactPerson: c.contact_person,
              phone: c.phone,
              email: c.email,
              address: c.address,
              notes: c.notes
            }));
          }

          if (ticketsData) {
            newState.tickets = ticketsData.map(t => ({
              id: t.id,
              osNumber: t.os_number,
              title: t.title,
              type: t.type as TicketType,
              status: t.status as TicketStatus,
              maintenanceCategory: t.maintenance_category,
              maintenanceSubcategory: t.maintenance_subcategory,
              clientId: t.client_id,
              date: t.date,
              technician: t.technician,
              observations: t.observations,
              reportedProblem: t.reported_problem,
              productsForQuote: t.products_for_quote,
              serviceReport: t.service_report,
              checklistResults: t.checklist_results,
              images: t.images,
              reportedBy: t.reported_by,
              location: t.location,
              photoBefore: t.photo_before,
              budgetAmount: t.budget_amount,
              budgetApproved: t.budget_approved,
              color: t.color,
              history: t.history
            }));
          }

          if (productsData) {
            newState.products = productsData.map(p => ({
              id: p.id,
              code: p.code,
              name: p.name,
              description: p.description,
              price: Number(p.price),
              unit: p.unit
            }));
          }

          if (quotesData) {
            newState.quotes = quotesData.map(q => ({
              id: q.id,
              clientId: q.client_id,
              date: q.date,
              totalValue: Number(q.total_value),
              status: q.status as any,
              items: q.items
            }));
          }

          if (receiptsData) {
            newState.receipts = receiptsData.map(r => ({
              id: r.id,
              clientId: r.client_id,
              date: r.date,
              value: Number(r.value),
              description: r.description
            }));
          }

          if (costsData) {
            newState.costs = costsData.map(c => ({
              id: c.id,
              description: c.description,
              value: Number(c.value),
              date: c.date,
              category: c.category
            }));
          }

          if (appointmentsData) {
            newState.appointments = appointmentsData.map(a => ({
              id: a.id,
              title: a.title,
              start: a.start_time,
              end: a.end_time,
              type: a.type as any,
              ticketId: a.ticket_id,
              notes: a.notes
            }));
          }

          if (checklistData) {
            newState.checklistItems = checklistData.map(i => ({
              id: i.id,
              task: i.task,
              category: i.category,
              clientId: i.client_id,
              clientIds: i.client_ids
            }));
          }

          if (suppliersData) {
            newState.suppliers = suppliersData.map(s => ({
              id: s.id,
              name: s.name,
              contact: s.contact,
              phone: s.phone,
              email: s.email,
              category: s.category
            }));
          }

          if (supplyItemsData) {
            newState.supplyItems = supplyItemsData.map(i => ({
              id: i.id,
              name: i.name,
              category: i.category,
              currentStock: i.current_stock,
              minStock: i.min_stock,
              unit: i.unit,
              lastPrice: i.last_price ? Number(i.last_price) : undefined,
              clientId: i.client_id
            }));
          }

          if (paymentsData) {
            newState.payments = paymentsData.map(p => ({
              id: p.id,
              clientId: p.client_id,
              amount: Number(p.amount),
              dueDate: p.due_date,
              paymentDate: p.payment_date,
              status: p.status as any,
              reference: p.reference
            }));
          }

          if (legalAgreementsData) {
            newState.legalAgreements = legalAgreementsData.map(a => ({
              id: a.id,
              clientId: a.client_id,
              totalAmount: Number(a.total_amount),
              installments: a.installments,
              remainingInstallments: a.remaining_installments,
              status: a.status as any,
              startDate: a.start_date,
              notes: a.notes
            }));
          }

          if (scheduledMaintenancesData) {
            newState.scheduledMaintenances = scheduledMaintenancesData.map(m => ({
              id: m.id,
              clientId: m.client_id,
              standardId: m.standard_id,
              item: m.item,
              frequency: m.frequency,
              lastDone: m.last_done,
              nextDate: m.next_date,
              status: m.status as any,
              category: m.category
            }));
          }

          if (consumptionReadingsData) {
            newState.consumptionReadings = consumptionReadingsData.map(r => ({
              id: r.id,
              clientId: r.client_id,
              type: r.type as any,
              previousValue: Number(r.previous_value),
              currentValue: Number(r.current_value),
              consumption: Number(r.consumption),
              date: r.date,
              unit: r.unit,
              billed: r.billed
            }));
          }

          if (assembliesData) {
            newState.assemblies = assembliesData.map(a => ({
              id: a.id,
              title: a.title,
              description: a.description,
              date: a.date,
              status: a.status as any,
              options: a.options,
              votes: a.votes,
              legalValidityHash: a.legal_validity_hash
            }));
          }

          if (noticesData) {
            newState.notices = noticesData.map(n => ({
              id: n.id,
              title: n.title,
              content: n.content,
              date: n.date,
              category: n.category as any,
              tower: n.tower,
              apartmentLine: n.apartment_line,
              clientId: n.client_id
            }));
          }

          if (packagesData) {
            newState.packages = packagesData.map(p => ({
              id: p.id,
              residentName: p.resident_name,
              apartment: p.apartment,
              tower: p.tower,
              carrier: p.carrier,
              trackingCode: p.tracking_code,
              receivedAt: p.received_at,
              pickedUpAt: p.picked_up_at,
              status: p.status as any,
              qrCode: p.qr_code,
              photoUrl: p.photo_url,
              clientId: p.client_id
            }));
          }

          if (visitorsData) {
            newState.visitors = visitorsData.map(v => ({
              id: v.id,
              name: v.name,
              document: v.document,
              type: v.type as any,
              apartment: v.apartment,
              tower: v.tower,
              validUntil: v.valid_until,
              qrCode: v.qr_code,
              status: v.status as any
            }));
          }

          if (criticalEventsData) {
            newState.criticalEvents = criticalEventsData.map(e => ({
              id: e.id,
              device: e.device,
              location: e.location,
              type: e.type as any,
              status: e.status as any,
              lastUpdate: e.last_update,
              description: e.description
            }));
          }

          if (digitalFolderRes.data) {
            newState.digitalFolder = digitalFolderRes.data.map(i => ({
              id: i.id,
              clientId: i.client_id,
              title: i.title,
              description: i.description,
              category: i.category,
              date: i.date,
              amount: i.amount ? Number(i.amount) : undefined,
              fileUrl: i.file_url,
              status: i.status as any,
              signatures: i.signatures
            }));
          }

          if (supplyQuotationsRes.data) {
            newState.supplyQuotations = supplyQuotationsRes.data.map(q => ({
              id: q.id,
              date: q.date,
              items: q.items,
              responses: q.responses,
              status: q.status as any
            }));
          }

          if (companySettingsData) {
            newState.companySettingsId = companySettingsData.id;
            newState.companyData = {
              name: companySettingsData.name,
              document: companySettingsData.document,
              phone: companySettingsData.phone,
              email: companySettingsData.email,
              address: companySettingsData.address,
              website: companySettingsData.website
            };
            newState.companyLogo = companySettingsData.logo_url;
            newState.companySignature = companySettingsData.signature_url;
            newState.theme = companySettingsData.theme as any;
            if (companySettingsData.menu_order) {
              newState.menuOrder = companySettingsData.menu_order;
            }
          }

          set(newState);
        } catch (error) {
          console.error('Erro ao buscar dados iniciais do Supabase:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setCompanyLogo: async (logo) => {
        set({ companyLogo: logo });
        const id = get().companySettingsId;
        if (id) {
          try {
            await supabase.from('company_settings').update({ logo_url: logo }).eq('id', id);
          } catch (e) { console.error(e); }
        }
      },
      setCompanySignature: async (signature) => {
        set({ companySignature: signature });
        const id = get().companySettingsId;
        if (id) {
          try {
            await supabase.from('company_settings').update({ signature_url: signature }).eq('id', id);
          } catch (e) { console.error(e); }
        }
      },
      setCompanyData: async (data) => {
        set({ companyData: data });
        const id = get().companySettingsId;
        if (id) {
          try {
            await supabase.from('company_settings').update({ 
              name: data.name,
              document: data.document,
              phone: data.phone,
              email: data.email,
              address: data.address,
              website: data.website
            }).eq('id', id);
          } catch (e) { console.error(e); }
        }
      },
      setMenuOrder: async (order) => {
        set({ menuOrder: order });
        const id = get().companySettingsId;
        if (id) {
          try {
            await supabase.from('company_settings').update({ menu_order: order }).eq('id', id);
          } catch (e) { console.error(e); }
        }
      },
      toggleTileVisibility: (tileId) => set((state) => ({
        hiddenTiles: state.hiddenTiles.includes(tileId)
          ? state.hiddenTiles.filter(id => id !== tileId)
          : [...state.hiddenTiles, tileId]
      })),
      toggleTheme: async () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        const id = get().companySettingsId;
        if (id) {
          try {
            await supabase.from('company_settings').update({ theme: newTheme }).eq('id', id);
          } catch (e) { console.error(e); }
        }
      },
      
      login: (user, pass) => {
        if (user === 'admin' && pass === '123') {
          set({ isAuthenticated: true });
          // Ao fazer login, busca os dados do Supabase
          get().fetchInitialData();
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      
      addClient: async (client) => {
        const id = uuidv4();
        const newClient: Client = { ...client, id };

        // 1. Atualiza o estado local imediatamente (Optimistic Update)
        set((state) => ({ clients: [...state.clients, newClient] }));

        // 2. Tenta persistir no Supabase
        try {
          const dbClient = {
            id, // Inclui o ID gerado localmente
            name: client.name,
            document: client.document,
            contact_person: client.contactPerson,
            phone: client.phone,
            email: client.email,
            address: client.address,
            notes: client.notes
          };

          const { error } = await supabase.from('clients').insert([dbClient]);
          
          if (error) {
            console.error('Erro ao persistir no Supabase:', error);
            if (error.code === '42P01') {
              toast.error('Tabela "clients" não encontrada. Você executou o script SQL no Supabase?');
            } else {
              toast.error(`Erro ao salvar no Supabase: ${error.message}`);
            }
          } else {
            toast.success('Cliente salvo no Supabase com sucesso!');
          }
        } catch (error: any) {
          console.error('Erro de conexão com Supabase:', error);
          toast.error('Erro de conexão com Supabase. Verifique suas chaves.');
        }
      },

      updateClient: async (id, updatedClient) => {
        // 1. Atualiza localmente
        set((state) => ({
          clients: state.clients.map(c => c.id === id ? { ...updatedClient, id } : c)
        }));

        // 2. Tenta persistir no Supabase
        try {
          const dbClient = {
            name: updatedClient.name,
            document: updatedClient.document,
            contact_person: updatedClient.contactPerson,
            phone: updatedClient.phone,
            email: updatedClient.email,
            address: updatedClient.address,
            notes: updatedClient.notes
          };

          const { error } = await supabase.from('clients').update(dbClient).eq('id', id);
          
          if (error) {
            console.warn('Erro ao atualizar no Supabase, mantendo apenas local:', error);
          }
        } catch (error) {
          console.warn('Erro de conexão com Supabase ao atualizar:', error);
        }
      },

      deleteClient: async (id) => {
        // 1. Remove localmente
        set((state) => ({ clients: state.clients.filter(c => c.id !== id) }));

        // 2. Tenta remover no Supabase
        try {
          const { error } = await supabase.from('clients').delete().eq('id', id);
          
          if (error) {
            console.warn('Erro ao deletar no Supabase, mantendo apenas local:', error);
          }
        } catch (error) {
          console.warn('Erro de conexão com Supabase ao deletar:', error);
        }
      },
      
      addChecklistItem: async (item) => {
        const id = uuidv4();
        const newItem = { ...item, id };
        set((state) => ({ checklistItems: [...state.checklistItems, newItem] }));
        
        try {
          const { error } = await supabase.from('checklist_items').insert([{
            id,
            task: item.task,
            category: item.category,
            client_id: item.clientId,
            client_ids: item.clientIds
          }]);
          if (error) {
            console.error('Erro Supabase addChecklistItem:', error);
            toast.error(`Erro ao salvar checklist: ${error.message}`);
          } else {
            toast.success('Checklist salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar checklist.');
        }
      },
      updateChecklistItem: async (id, updatedItem) => {
        set((state) => ({
          checklistItems: state.checklistItems.map(i => i.id === id ? { ...updatedItem, id } : i)
        }));
        
        try {
          await supabase.from('checklist_items').update({
            task: updatedItem.task,
            category: updatedItem.category,
            client_id: updatedItem.clientId,
            client_ids: updatedItem.clientIds
          }).eq('id', id);
        } catch (e) { console.error(e); }
      },
      deleteChecklistItem: async (id) => {
        set((state) => ({ checklistItems: state.checklistItems.filter(i => i.id !== id) }));
        try {
          await supabase.from('checklist_items').delete().eq('id', id);
        } catch (e) { console.error(e); }
      },
      
      addTicket: async (ticket) => {
        const state = get();
        let osNumber = ticket.osNumber;
        if (!osNumber && ticket.type !== 'TAREFA') {
          let maxOs = 0;
          state.tickets.forEach(t => {
            if (t.osNumber && t.osNumber.startsWith('OS-')) {
              const num = parseInt(t.osNumber.replace('OS-', ''), 10);
              if (!isNaN(num) && num > maxOs) {
                maxOs = num;
              }
            }
          });
          osNumber = `OS-${String(maxOs + 1).padStart(4, '0')}`;
        }
        
        const id = uuidv4();
        const newTicket = { ...ticket, id, osNumber };
        set((state) => ({ tickets: [...state.tickets, newTicket] }));

        try {
          const { error } = await supabase.from('tickets').insert([{
            id,
            os_number: osNumber,
            title: ticket.title,
            type: ticket.type,
            status: ticket.status,
            maintenance_category: ticket.maintenanceCategory,
            maintenance_subcategory: ticket.maintenanceSubcategory,
            client_id: ticket.clientId,
            date: ticket.date,
            technician: ticket.technician,
            observations: ticket.observations,
            reported_problem: ticket.reportedProblem,
            products_for_quote: ticket.productsForQuote,
            service_report: ticket.serviceReport,
            checklist_results: ticket.checklistResults,
            images: ticket.images,
            reported_by: ticket.reportedBy,
            location: ticket.location,
            photo_before: ticket.photoBefore,
            budget_amount: ticket.budgetAmount,
            budget_approved: ticket.budgetApproved,
            color: ticket.color
          }]);
          if (error) {
            console.error('Erro Supabase addTicket:', error);
            toast.error(`Erro ao salvar OS: ${error.message}`);
          } else {
            toast.success(`OS ${osNumber || ''} salva no Supabase!`);
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar OS.');
        }
      },
      updateTicket: async (id, updatedTicket) => {
        set((state) => ({
          tickets: state.tickets.map(t => t.id === id ? { ...updatedTicket, id } : t)
        }));

        try {
          await supabase.from('tickets').update({
            os_number: updatedTicket.osNumber,
            title: updatedTicket.title,
            type: updatedTicket.type,
            status: updatedTicket.status,
            maintenance_category: updatedTicket.maintenanceCategory,
            maintenance_subcategory: updatedTicket.maintenanceSubcategory,
            client_id: updatedTicket.clientId,
            date: updatedTicket.date,
            technician: updatedTicket.technician,
            observations: updatedTicket.observations,
            reported_problem: updatedTicket.reportedProblem,
            products_for_quote: updatedTicket.productsForQuote,
            service_report: updatedTicket.serviceReport,
            checklist_results: updatedTicket.checklistResults,
            images: updatedTicket.images,
            reported_by: updatedTicket.reportedBy,
            location: updatedTicket.location,
            photo_before: updatedTicket.photoBefore,
            budget_amount: updatedTicket.budgetAmount,
            budget_approved: updatedTicket.budgetApproved,
            color: updatedTicket.color
          }).eq('id', id);
        } catch (e) { console.error(e); }
      },
      deleteTicket: async (id) => {
        set((state) => ({ tickets: state.tickets.filter(t => t.id !== id) }));
        try {
          await supabase.from('tickets').delete().eq('id', id);
        } catch (e) { console.error(e); }
      },

      addQuote: async (quote) => {
        const id = uuidv4();
        const newQuote = { ...quote, id };
        set((state) => ({ quotes: [...state.quotes, newQuote] }));

        try {
          const { error } = await supabase.from('quotes').insert([{
            id,
            client_id: quote.clientId,
            date: quote.date,
            total_value: quote.totalValue,
            status: quote.status,
            items: quote.items
          }]);
          if (error) {
            console.error('Erro Supabase addQuote:', error);
            toast.error(`Erro ao salvar orçamento: ${error.message}`);
          } else {
            toast.success('Orçamento salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar orçamento.');
        }
      },
      updateQuote: async (id, updatedQuote) => {
        set((state) => ({
          quotes: state.quotes.map(q => q.id === id ? { ...updatedQuote, id } : q)
        }));

        try {
          await supabase.from('quotes').update({
            client_id: updatedQuote.clientId,
            date: updatedQuote.date,
            total_value: updatedQuote.totalValue,
            status: updatedQuote.status,
            items: updatedQuote.items
          }).eq('id', id);
        } catch (e) { console.error(e); }
      },
      deleteQuote: async (id) => {
        set((state) => ({ quotes: state.quotes.filter(q => q.id !== id) }));
        try {
          await supabase.from('quotes').delete().eq('id', id);
        } catch (e) { console.error(e); }
      },

      addReceipt: async (receipt) => {
        const id = uuidv4();
        const newReceipt = { ...receipt, id };
        set((state) => ({ receipts: [...state.receipts, newReceipt] }));

        try {
          const { error } = await supabase.from('receipts').insert([{
            id,
            client_id: receipt.clientId,
            date: receipt.date,
            value: receipt.value,
            description: receipt.description
          }]);
          if (error) {
            console.error('Erro Supabase addReceipt:', error);
            toast.error(`Erro ao salvar recibo: ${error.message}`);
          } else {
            toast.success('Recibo salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar recibo.');
        }
      },
      deleteReceipt: async (id) => {
        set((state) => ({ receipts: state.receipts.filter(r => r.id !== id) }));
        try {
          await supabase.from('receipts').delete().eq('id', id);
        } catch (e) { console.error(e); }
      },

      addCost: async (cost) => {
        const id = uuidv4();
        const newCost = { ...cost, id };
        set((state) => ({ costs: [...state.costs, newCost] }));

        try {
          const { error } = await supabase.from('costs').insert([{
            id,
            description: cost.description,
            value: cost.value,
            date: cost.date,
            category: cost.category
          }]);
          if (error) {
            console.error('Erro Supabase addCost:', error);
            toast.error(`Erro ao salvar custo: ${error.message}`);
          } else {
            toast.success('Custo salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar custo.');
        }
      },
      deleteCost: async (id) => {
        set((state) => ({ costs: state.costs.filter(c => c.id !== id) }));
        try {
          await supabase.from('costs').delete().eq('id', id);
        } catch (e) { console.error(e); }
      },

      addAppointment: async (appointment) => {
        const id = uuidv4();
        const newAppointment = { ...appointment, id };
        set((state) => ({ appointments: [...state.appointments, newAppointment] }));

        try {
          const { error } = await supabase.from('appointments').insert([{
            id,
            title: appointment.title,
            start_time: appointment.start,
            end_time: appointment.end,
            type: appointment.type,
            ticket_id: appointment.ticketId,
            notes: appointment.notes
          }]);
          if (error) {
            console.error('Erro Supabase addAppointment:', error);
            toast.error(`Erro ao salvar compromisso: ${error.message}`);
          } else {
            toast.success('Compromisso salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar compromisso.');
        }
      },
      updateAppointment: async (id, updatedAppointment) => {
        set((state) => ({
          appointments: state.appointments.map(a => a.id === id ? { ...updatedAppointment, id } : a)
        }));

        try {
          await supabase.from('appointments').update({
            title: updatedAppointment.title,
            start_time: updatedAppointment.start,
            end_time: updatedAppointment.end,
            type: updatedAppointment.type,
            ticket_id: updatedAppointment.ticketId,
            notes: updatedAppointment.notes
          }).eq('id', id);
        } catch (e) { console.error(e); }
      },
      deleteAppointment: async (id) => {
        set((state) => ({ appointments: state.appointments.filter(a => a.id !== id) }));
        try {
          await supabase.from('appointments').delete().eq('id', id);
        } catch (e) { console.error(e); }
      },

      addProduct: async (product) => {
        const id = uuidv4();
        const newProduct = { ...product, id };
        set((state) => ({ products: [...state.products, newProduct] }));

        try {
          const { error } = await supabase.from('products').insert([{
            id,
            code: product.code,
            name: product.name,
            description: product.description,
            price: product.price,
            unit: product.unit
          }]);
          if (error) {
            console.error('Erro Supabase addProduct:', error);
            toast.error(`Erro ao salvar produto: ${error.message}`);
          } else {
            toast.success('Produto salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar produto.');
        }
      },
      updateProduct: async (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...updatedProduct, id } : p)
        }));

        try {
          await supabase.from('products').update({
            code: updatedProduct.code,
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: updatedProduct.price,
            unit: updatedProduct.unit
          }).eq('id', id);
        } catch (e) { console.error(e); }
      },
      deleteProduct: async (id) => {
        set((state) => ({ products: state.products.filter(p => p.id !== id) }));
        try {
          await supabase.from('products').delete().eq('id', id);
        } catch (e) { console.error(e); }
      },
      importProducts: (newProducts) => set((state) => ({ 
        products: [...state.products, ...newProducts.map(p => ({ ...p, id: uuidv4() }))]
      })),

      addSupplier: async (supplier) => {
        const id = uuidv4();
        const newSupplier = { ...supplier, id };
        set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
        try {
          const { error } = await supabase.from('suppliers').insert([{
            id,
            name: supplier.name,
            contact: supplier.contact,
            phone: supplier.phone,
            email: supplier.email,
            category: supplier.category
          }]);
          if (error) {
            console.error('Erro Supabase addSupplier:', error);
            toast.error(`Erro ao salvar fornecedor: ${error.message}`);
          } else {
            toast.success('Fornecedor salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar fornecedor.');
        }
      },
      updateSupplier: async (id, updated) => {
        set((state) => ({
          suppliers: state.suppliers.map(s => s.id === id ? { ...updated, id } : s)
        }));
        try {
          const { error } = await supabase.from('suppliers').update({
            name: updated.name,
            contact: updated.contact,
            phone: updated.phone,
            email: updated.email,
            category: updated.category
          }).eq('id', id);
          if (error) console.error('Erro Supabase updateSupplier:', error);
        } catch (e) { console.error(e); }
      },
      deleteSupplier: async (id) => {
        set((state) => ({ suppliers: state.suppliers.filter(s => s.id !== id) }));
        try {
          const { error } = await supabase.from('suppliers').delete().eq('id', id);
          if (error) console.error('Erro Supabase deleteSupplier:', error);
        } catch (e) { console.error(e); }
      },

      addSupplyItem: async (item) => {
        const id = uuidv4();
        const newItem = { ...item, id };
        set((state) => ({ supplyItems: [...state.supplyItems, newItem] }));
        try {
          const { error } = await supabase.from('supply_items').insert([{
            id,
            name: item.name,
            category: item.category,
            current_stock: item.currentStock,
            min_stock: item.minStock,
            unit: item.unit,
            last_price: item.lastPrice,
            client_id: item.clientId
          }]);
          if (error) {
            console.error('Erro Supabase addSupplyItem:', error);
            toast.error(`Erro ao salvar item de suprimento: ${error.message}`);
          } else {
            toast.success('Item de suprimento salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar item de suprimento.');
        }
      },
      updateSupplyItem: async (id, updated) => {
        set((state) => ({
          supplyItems: state.supplyItems.map(i => i.id === id ? { ...updated, id } : i)
        }));
        try {
          const { error } = await supabase.from('supply_items').update({
            name: updated.name,
            category: updated.category,
            current_stock: updated.currentStock,
            min_stock: updated.minStock,
            unit: updated.unit,
            last_price: updated.lastPrice,
            client_id: updated.clientId
          }).eq('id', id);
          if (error) console.error('Erro Supabase updateSupplyItem:', error);
        } catch (e) { console.error(e); }
      },
      deleteSupplyItem: async (id) => {
        set((state) => ({ supplyItems: state.supplyItems.filter(i => i.id !== id) }));
        try {
          const { error } = await supabase.from('supply_items').delete().eq('id', id);
          if (error) console.error('Erro Supabase deleteSupplyItem:', error);
        } catch (e) { console.error(e); }
      },
      updateStock: async (id, quantity) => {
        const item = get().supplyItems.find(i => i.id === id);
        if (!item) return;
        const newStock = item.currentStock + quantity;
        set((state) => ({
          supplyItems: state.supplyItems.map(i => i.id === id ? { ...i, currentStock: newStock } : i)
        }));
        try {
          const { error } = await supabase.from('supply_items').update({ current_stock: newStock }).eq('id', id);
          if (error) console.error('Erro Supabase updateStock:', error);
        } catch (e) { console.error(e); }
      },

      createQuotation: async (items) => {
        const id = uuidv4();
        const state = get();
        const relevantSuppliers = state.suppliers.filter(s => 
          items.some(qi => {
            const supplyItem = state.supplyItems.find(si => si.id === qi.supplyItemId);
            return supplyItem?.category === s.category || s.category === 'GERAL';
          })
        );

        const newQuotation: SupplyQuotation = {
          id,
          date: new Date().toISOString(),
          items,
          responses: relevantSuppliers.map(s => ({
            supplierId: s.id,
            prices: {},
            status: 'PENDING'
          })),
          status: 'OPEN'
        };

        set((state) => ({ supplyQuotations: [...state.supplyQuotations, newQuotation] }));

        try {
          const { error } = await supabase.from('supply_quotations').insert([{
            id,
            date: newQuotation.date,
            items,
            responses: newQuotation.responses,
            status: 'OPEN'
          }]);
          if (error) {
            console.error('Erro Supabase createQuotation:', error);
            toast.error(`Erro ao criar cotação: ${error.message}`);
          } else {
            toast.success('Cotação criada no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao criar cotação.');
        }
      },

      updateQuotationResponse: async (quotationId, supplierId, prices) => {
        const state = get();
        const quotation = state.supplyQuotations.find(q => q.id === quotationId);
        if (!quotation) return;

        const newResponses = quotation.responses.map(r => 
          r.supplierId === supplierId ? { ...r, prices, status: 'RECEIVED' as const } : r
        );

        set((state) => ({
          supplyQuotations: state.supplyQuotations.map(q => 
            q.id === quotationId ? { ...q, responses: newResponses } : q
          )
        }));

        try {
          const { error } = await supabase.from('supply_quotations').update({ 
            responses: newResponses 
          }).eq('id', quotationId);
          if (error) console.error('Erro Supabase updateQuotationResponse:', error);
        } catch (e) { console.error(e); }
      },

      addPayment: async (payment) => {
        const id = uuidv4();
        const newPayment = { ...payment, id };
        set((state) => ({ payments: [...state.payments, newPayment] }));
        try {
          const { error } = await supabase.from('payments').insert([{
            id,
            client_id: payment.clientId,
            amount: payment.amount,
            due_date: payment.dueDate,
            payment_date: payment.paymentDate,
            status: payment.status,
            reference: payment.reference
          }]);
          if (error) {
            console.error('Erro Supabase addPayment:', error);
            toast.error(`Erro ao salvar pagamento: ${error.message}`);
          } else {
            toast.success('Pagamento salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar pagamento.');
        }
      },
      updatePayment: async (id, updated) => {
        set((state) => ({
          payments: state.payments.map(p => p.id === id ? { ...p, ...updated } : p)
        }));
        try {
          const { error } = await supabase.from('payments').update({
            client_id: updated.clientId,
            amount: updated.amount,
            due_date: updated.dueDate,
            payment_date: updated.paymentDate,
            status: updated.status,
            reference: updated.reference
          }).eq('id', id);
          if (error) console.error('Erro Supabase updatePayment:', error);
        } catch (e) { console.error(e); }
      },
      deletePayment: async (id) => {
        set((state) => ({ payments: state.payments.filter(p => p.id !== id) }));
        try {
          const { error } = await supabase.from('payments').delete().eq('id', id);
          if (error) console.error('Erro Supabase deletePayment:', error);
        } catch (e) { console.error(e); }
      },

      addLegalAgreement: async (agreement) => {
        const id = uuidv4();
        const newAgreement = { ...agreement, id };
        set((state) => ({ legalAgreements: [...state.legalAgreements, newAgreement] }));
        try {
          const { error } = await supabase.from('legal_agreements').insert([{
            id,
            client_id: agreement.clientId,
            total_amount: agreement.totalAmount,
            installments: agreement.installments,
            remaining_installments: agreement.remainingInstallments,
            status: agreement.status,
            start_date: agreement.startDate,
            notes: agreement.notes
          }]);
          if (error) {
            console.error('Erro Supabase addLegalAgreement:', error);
            toast.error(`Erro ao salvar acordo: ${error.message}`);
          } else {
            toast.success('Acordo jurídico salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar acordo.');
        }
      },
      updateLegalAgreement: async (id, updated) => {
        set((state) => ({
          legalAgreements: state.legalAgreements.map(a => a.id === id ? { ...a, ...updated } : a)
        }));
        try {
          const { error } = await supabase.from('legal_agreements').update({
            client_id: updated.clientId,
            total_amount: updated.totalAmount,
            installments: updated.installments,
            remaining_installments: updated.remainingInstallments,
            status: updated.status,
            start_date: updated.startDate,
            notes: updated.notes
          }).eq('id', id);
          if (error) console.error('Erro Supabase updateLegalAgreement:', error);
        } catch (e) { console.error(e); }
      },
      deleteLegalAgreement: async (id) => {
        set((state) => ({ legalAgreements: state.legalAgreements.filter(a => a.id !== id) }));
        try {
          const { error } = await supabase.from('legal_agreements').delete().eq('id', id);
          if (error) console.error('Erro Supabase deleteLegalAgreement:', error);
        } catch (e) { console.error(e); }
      },
      
      addScheduledMaintenance: async (maintenance) => {
        const id = uuidv4();
        const newMaintenance = { ...maintenance, id };
        set((state) => ({
          scheduledMaintenances: [...state.scheduledMaintenances, newMaintenance]
        }));
        try {
          const { error } = await supabase.from('scheduled_maintenances').insert([{
            id,
            client_id: maintenance.clientId,
            standard_id: maintenance.standardId,
            item: maintenance.item,
            frequency: maintenance.frequency,
            last_done: maintenance.lastDone,
            next_date: maintenance.nextDate,
            status: maintenance.status,
            category: maintenance.category
          }]);
          if (error) {
            console.error('Erro Supabase addScheduledMaintenance:', error);
            toast.error(`Erro ao salvar manutenção: ${error.message}`);
          } else {
            toast.success('Manutenção agendada salva no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar manutenção.');
        }
      },
      updateScheduledMaintenance: async (id, updated) => {
        set((state) => ({
          scheduledMaintenances: state.scheduledMaintenances.map(m => m.id === id ? { ...m, ...updated } : m)
        }));
        try {
          const { error } = await supabase.from('scheduled_maintenances').update({
            client_id: updated.clientId,
            standard_id: updated.standardId,
            item: updated.item,
            frequency: updated.frequency,
            last_done: updated.lastDone,
            next_date: updated.nextDate,
            status: updated.status,
            category: updated.category
          }).eq('id', id);
          if (error) console.error('Erro Supabase updateScheduledMaintenance:', error);
        } catch (e) { console.error(e); }
      },
      deleteScheduledMaintenance: async (id) => {
        set((state) => ({
          scheduledMaintenances: state.scheduledMaintenances.filter(m => m.id !== id)
        }));
        try {
          const { error } = await supabase.from('scheduled_maintenances').delete().eq('id', id);
          if (error) console.error('Erro Supabase deleteScheduledMaintenance:', error);
        } catch (e) { console.error(e); }
      },
      generateSchedulesForClient: async (clientId) => {
        const newSchedules: ScheduledMaintenance[] = NBR5674_STANDARDS.map((std: any) => {
          const nextDate = new Date();
          if (std.frequency === 'Mensal') nextDate.setMonth(nextDate.getMonth() + 1);
          else if (std.frequency === 'Trimestral') nextDate.setMonth(nextDate.getMonth() + 3);
          else if (std.frequency === 'Semestral') nextDate.setMonth(nextDate.getMonth() + 6);
          else nextDate.setFullYear(nextDate.getFullYear() + 1);

          return {
            id: uuidv4(),
            clientId,
            standardId: std.id,
            item: std.item,
            frequency: std.frequency,
            nextDate: nextDate.toISOString().split('T')[0],
            status: 'PENDING',
            category: std.category
          };
        });

        set((state) => ({
          scheduledMaintenances: [
            ...state.scheduledMaintenances.filter(m => m.clientId !== clientId),
            ...newSchedules
          ]
        }));

        try {
          // Remove antigos e insere novos no Supabase
          await supabase.from('scheduled_maintenances').delete().eq('client_id', clientId);
          const { error } = await supabase.from('scheduled_maintenances').insert(newSchedules.map(m => ({
            id: m.id,
            client_id: m.clientId,
            standard_id: m.standardId,
            item: m.item,
            frequency: m.frequency,
            next_date: m.nextDate,
            status: m.status,
            category: m.category
          })));
          if (error) console.error('Erro Supabase generateSchedulesForClient:', error);
        } catch (e) { console.error(e); }
      },

      addNotification: (notif) => set((state) => ({
        notifications: [
          { ...notif, id: uuidv4(), date: new Date().toISOString(), read: false },
          ...state.notifications
        ].slice(0, 50) // Keep last 50
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      clearNotifications: () => set({ notifications: [] }),

      addConsumptionReading: async (reading) => {
        const id = uuidv4();
        const newReading = { ...reading, id };
        set((state) => ({
          consumptionReadings: [...state.consumptionReadings, newReading]
        }));
        try {
          const { error } = await supabase.from('consumption_readings').insert([{
            id,
            client_id: reading.clientId,
            type: reading.type,
            previous_value: reading.previousValue,
            current_value: reading.currentValue,
            consumption: reading.consumption,
            date: reading.date,
            unit: reading.unit,
            billed: reading.billed
          }]);
          if (error) {
            console.error('Erro Supabase addConsumptionReading:', error);
            toast.error(`Erro ao salvar leitura: ${error.message}`);
          } else {
            toast.success('Leitura de consumo salva no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar leitura.');
        }
      },
      addDigitalFolderItem: async (item) => {
        const id = uuidv4();
        const newItem: DigitalFolderItem = { 
          ...item, 
          id, 
          status: 'PENDING', 
          signatures: [],
          date: new Date().toISOString()
        };
        set((state) => ({
          digitalFolder: [...state.digitalFolder, newItem]
        }));
        try {
          const { error } = await supabase.from('digital_folder').insert([{
            id,
            client_id: item.clientId,
            title: item.title,
            description: item.description,
            category: item.category,
            date: newItem.date,
            amount: item.amount,
            file_url: item.fileUrl,
            status: 'PENDING',
            signatures: []
          }]);
          if (error) {
            console.error('Erro Supabase addDigitalFolderItem:', error);
            toast.error(`Erro ao salvar documento: ${error.message}`);
          } else {
            toast.success('Documento salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar documento.');
        }
      },
      validateDigitalFolderItem: async (id, userName, role) => {
        const item = get().digitalFolder.find(i => i.id === id);
        if (!item) return;

        const newSignature = { id: uuidv4(), userName, role, date: new Date().toISOString() };
        const newSignatures = [...item.signatures, newSignature];
        const newStatus = newSignatures.length >= 3 ? 'VALIDATED' : item.status;

        set((state) => ({
          digitalFolder: state.digitalFolder.map(i => 
            i.id === id ? { ...i, signatures: newSignatures, status: newStatus } : i
          )
        }));

        try {
          const { error } = await supabase.from('digital_folder').update({ 
            signatures: newSignatures, 
            status: newStatus 
          }).eq('id', id);
          if (error) console.error('Erro Supabase validateDigitalFolderItem:', error);
        } catch (e) { console.error(e); }
      },

      addAssembly: async (assembly) => {
        const id = uuidv4();
        const newAssembly = {
          ...assembly,
          id,
          votes: [],
          legalValidityHash: `SHA256-${uuidv4().substring(0, 8).toUpperCase()}`
        };
        set((state) => ({
          assemblies: [...state.assemblies, newAssembly]
        }));
        try {
          const { error } = await supabase.from('assemblies').insert([{
            id,
            title: assembly.title,
            description: assembly.description,
            date: assembly.date,
            status: assembly.status,
            options: assembly.options,
            votes: [],
            legal_validity_hash: newAssembly.legalValidityHash
          }]);
          if (error) {
            console.error('Erro Supabase addAssembly:', error);
            toast.error(`Erro ao salvar assembleia: ${error.message}`);
          } else {
            toast.success('Assembleia salva no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar assembleia.');
        }
      },

      castVote: async (assemblyId, optionId, userName) => {
        const assembly = get().assemblies.find(a => a.id === assemblyId);
        if (!assembly) return;

        const vote: Vote = {
          id: uuidv4(),
          userId: 'current-user',
          userName,
          optionId,
          timestamp: new Date().toISOString(),
          signature: `SIG-${uuidv4().substring(0, 12).toUpperCase()}`
        };

        const newVotes = [...assembly.votes, vote];

        set((state) => ({
          assemblies: state.assemblies.map(a => a.id === assemblyId ? { ...a, votes: newVotes } : a)
        }));

        try {
          const { error } = await supabase.from('assemblies').update({ votes: newVotes }).eq('id', assemblyId);
          if (error) console.error('Erro Supabase castVote:', error);
        } catch (e) { console.error(e); }
      },

      closeAssembly: async (id) => {
        set((state) => ({
          assemblies: state.assemblies.map(a => a.id === id ? { ...a, status: 'CLOSED' } : a)
        }));
        try {
          const { error } = await supabase.from('assemblies').update({ status: 'CLOSED' }).eq('id', id);
          if (error) console.error('Erro Supabase closeAssembly:', error);
        } catch (e) { console.error(e); }
      },

      deleteAssembly: async (id) => {
        set((state) => ({
          assemblies: state.assemblies.filter(a => a.id !== id)
        }));
        try {
          const { error } = await supabase.from('assemblies').delete().eq('id', id);
          if (error) console.error('Erro Supabase deleteAssembly:', error);
        } catch (e) { console.error(e); }
      },

      addNotice: async (notice) => {
        const id = uuidv4();
        const newNotice = { ...notice, id, date: new Date().toISOString() };
        set((state) => ({
          notices: [newNotice, ...state.notices]
        }));
        try {
          const { error } = await supabase.from('notices').insert([{
            id,
            title: notice.title,
            content: notice.content,
            date: newNotice.date,
            category: notice.category,
            tower: notice.tower,
            apartment_line: notice.apartmentLine,
            client_id: notice.clientId
          }]);
          if (error) {
            console.error('Erro Supabase addNotice:', error);
            toast.error(`Erro ao salvar comunicado: ${error.message}`);
          } else {
            toast.success('Comunicado salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar comunicado.');
        }
      },

      updateNotice: async (id, updated) => {
        set((state) => ({
          notices: state.notices.map(n => n.id === id ? { ...n, ...updated } : n)
        }));
        try {
          const { error } = await supabase.from('notices').update({
            title: updated.title,
            content: updated.content,
            category: updated.category,
            tower: updated.tower,
            apartment_line: updated.apartmentLine,
            client_id: updated.clientId
          }).eq('id', id);
          if (error) console.error('Erro Supabase updateNotice:', error);
        } catch (e) { console.error(e); }
      },

      deleteNotice: async (id) => {
        set((state) => ({
          notices: state.notices.filter(n => n.id !== id)
        }));
        try {
          const { error } = await supabase.from('notices').delete().eq('id', id);
          if (error) console.error('Erro Supabase deleteNotice:', error);
        } catch (e) { console.error(e); }
      },

      addPackage: async (pkg) => {
        const id = uuidv4();
        const newPkg: Package = {
          ...pkg,
          id,
          receivedAt: new Date().toISOString(),
          status: 'PENDING',
          qrCode: `PKG-${id.substring(0, 8).toUpperCase()}`
        };
        
        set((state) => ({ packages: [newPkg, ...state.packages] }));

        try {
          const { error } = await supabase.from('packages').insert([{
            id,
            resident_name: pkg.residentName,
            apartment: pkg.apartment,
            tower: pkg.tower,
            carrier: pkg.carrier,
            tracking_code: pkg.trackingCode,
            received_at: newPkg.receivedAt,
            status: 'PENDING',
            qr_code: newPkg.qrCode,
            photo_url: pkg.photoUrl,
            client_id: pkg.clientId
          }]);
          if (error) {
            console.error('Erro Supabase addPackage:', error);
            toast.error(`Erro ao salvar encomenda: ${error.message}`);
          } else {
            toast.success('Encomenda salva no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar encomenda.');
        }

        get().addNotification({
          title: 'Nova Encomenda!',
          message: `Pacote de ${pkg.carrier} para ${pkg.residentName} (${pkg.apartment} ${pkg.tower}). QR Code enviado via WhatsApp.`,
          type: 'SUCCESS'
        });
      },

      pickupPackage: async (id) => {
        const pkg = get().packages.find(p => p.id === id);
        if (!pkg) return;
        const pickedUpAt = new Date().toISOString();

        set((state) => ({
          packages: state.packages.map(p => 
            p.id === id ? { ...p, status: 'PICKED_UP', pickedUpAt } : p
          )
        }));

        try {
          const { error } = await supabase.from('packages').update({ 
            status: 'PICKED_UP', 
            picked_up_at: pickedUpAt 
          }).eq('id', id);
          if (error) console.error('Erro Supabase pickupPackage:', error);
        } catch (e) { console.error(e); }

        get().addNotification({
          title: 'Encomenda Retirada',
          message: `O pacote de ${pkg.carrier} foi retirado por ${pkg.residentName}.`,
          type: 'INFO'
        });
      },

      addVisitor: async (visitor) => {
        const id = uuidv4();
        const newVisitor: Visitor = {
          ...visitor,
          id,
          qrCode: `VIS-${id}`,
          status: 'ACTIVE'
        };
        set((state) => ({ visitors: [newVisitor, ...state.visitors] }));
        try {
          const { error } = await supabase.from('visitors').insert([{
            id,
            name: visitor.name,
            document: visitor.document,
            type: visitor.type,
            apartment: visitor.apartment,
            tower: visitor.tower,
            valid_until: visitor.validUntil,
            qr_code: newVisitor.qrCode,
            status: 'ACTIVE'
          }]);
          if (error) {
            console.error('Erro Supabase addVisitor:', error);
            toast.error(`Erro ao salvar visitante: ${error.message}`);
          } else {
            toast.success('Visitante salvo no Supabase!');
          }
        } catch (e: any) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar visitante.');
        }
      },

      revokeVisitor: async (id) => {
        set((state) => ({
          visitors: state.visitors.map(v => v.id === id ? { ...v, status: 'EXPIRED' } : v)
        }));
        try {
          const { error } = await supabase.from('visitors').update({ status: 'EXPIRED' }).eq('id', id);
          if (error) console.error('Erro Supabase revokeVisitor:', error);
        } catch (e) { console.error(e); }
      },

      updateCriticalEvent: async (id, status, description) => {
        const lastUpdate = new Date().toISOString();
        set((state) => ({
          criticalEvents: state.criticalEvents.map(e => 
            e.id === id ? { ...e, status, description, lastUpdate } : e
          )
        }));

        try {
          const { error } = await supabase.from('critical_events').update({ 
            status, 
            description, 
            last_update: lastUpdate 
          }).eq('id', id);
          if (error) console.error('Erro Supabase updateCriticalEvent:', error);
        } catch (e) { console.error(e); }

        if (status === 'CRITICAL') {
          const event = get().criticalEvents.find(e => e.id === id);
          get().addNotification({
            title: 'ALERTA CRÍTICO!',
            message: `${event?.device}: ${description}`,
            type: 'ERROR'
          });
        }
      },

      addTicketHistory: async (ticketId, note, userName) => {
        const newEntry = {
          id: uuidv4(),
          date: new Date().toISOString(),
          note,
          userName
        };
        
        let updatedHistory: any[] = [];
        
        set((state) => {
          const ticket = state.tickets.find(t => t.id === ticketId);
          updatedHistory = [...(ticket?.history || []), newEntry];
          return {
            tickets: state.tickets.map(t => 
              t.id === ticketId ? { ...t, history: updatedHistory } : t
            )
          };
        });

        try {
          const { error } = await supabase.from('tickets').update({ 
            history: updatedHistory 
          }).eq('id', ticketId);
          if (error) {
            console.error('Erro Supabase addTicketHistory:', error);
            toast.error('Erro ao salvar histórico no servidor');
          } else {
            toast.success('Histórico atualizado');
          }
        } catch (e) { 
          console.error(e);
          toast.error('Erro de conexão ao salvar histórico');
        }
      },

      setEnergyData: (energyData) => set({ energyData }),

      restoreData: (data) => set((state) => ({
        ...state,
        ...data,
        // Ensure we don't accidentally overwrite functions if they were included in JSON
        clients: data.clients || state.clients,
        checklistItems: data.checklistItems || state.checklistItems,
        tickets: data.tickets || state.tickets,
        quotes: data.quotes || state.quotes,
        receipts: data.receipts || state.receipts,
        costs: data.costs || state.costs,
        appointments: data.appointments || state.appointments,
        products: data.products || state.products,
        companyLogo: data.companyLogo !== undefined ? data.companyLogo : state.companyLogo,
        companySignature: data.companySignature !== undefined ? data.companySignature : state.companySignature,
        companyData: data.companyData !== undefined ? data.companyData : state.companyData,
        theme: data.theme || state.theme,
        menuOrder: data.menuOrder || state.menuOrder,
        hiddenTiles: data.hiddenTiles || state.hiddenTiles,
      })),
    }),
    {
      name: 'manutencao-storage',
    }
  )
);
