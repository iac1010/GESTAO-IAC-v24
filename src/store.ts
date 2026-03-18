import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './lib/supabase';
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
  type: 'BALANCE_SHEET' | 'INVOICE' | 'TAX_DOC';
  title: string;
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
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  menuOrder: string[];
  hiddenTiles: string[];
  isLoading: boolean;
  
  fetchInitialData: () => Promise<void>;
  setCompanyLogo: (logo: string | null) => void;
  setCompanySignature: (signature: string | null) => void;
  setCompanyData: (data: CompanyData) => void;
  setMenuOrder: (order: string[]) => void;
  toggleTileVisibility: (tileId: string) => void;
  toggleTheme: () => void;
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
          const [
            { data: clientsData },
            { data: ticketsData },
            { data: productsData },
            { data: quotesData },
            { data: receiptsData },
            { data: costsData },
            { data: appointmentsData },
            { data: checklistData }
          ] = await Promise.all([
            supabase.from('clients').select('*'),
            supabase.from('tickets').select('*'),
            supabase.from('products').select('*'),
            supabase.from('quotes').select('*'),
            supabase.from('receipts').select('*'),
            supabase.from('costs').select('*'),
            supabase.from('appointments').select('*'),
            supabase.from('checklist_items').select('*')
          ]);

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
              color: t.color
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

          set(newState);
        } catch (error) {
          console.error('Erro ao buscar dados iniciais do Supabase:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setCompanyLogo: (logo) => set({ companyLogo: logo }),
      setCompanySignature: (signature) => set({ companySignature: signature }),
      setCompanyData: (data) => set({ companyData: data }),
      setMenuOrder: (order) => set({ menuOrder: order }),
      toggleTileVisibility: (tileId) => set((state) => ({
        hiddenTiles: state.hiddenTiles.includes(tileId)
          ? state.hiddenTiles.filter(id => id !== tileId)
          : [...state.hiddenTiles, tileId]
      })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
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
            name: client.name,
            document: client.document,
            contact_person: client.contactPerson,
            phone: client.phone,
            email: client.email,
            address: client.address,
            notes: client.notes
          };

          const { data, error } = await supabase.from('clients').insert([dbClient]).select().single();
          
          if (error) {
            console.warn('Erro ao persistir no Supabase, mantendo apenas local:', error);
            return;
          }

          // Se o Supabase retornou um ID diferente (ou o mesmo), atualizamos se necessário
          if (data && data.id !== id) {
            set((state) => ({
              clients: state.clients.map(c => c.id === id ? { ...newClient, id: data.id } : c)
            }));
          }
        } catch (error) {
          console.warn('Erro de conexão com Supabase, mantendo apenas local:', error);
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
          await supabase.from('checklist_items').insert([{
            task: item.task,
            category: item.category,
            client_id: item.clientId,
            client_ids: item.clientIds
          }]);
        } catch (e) { console.error(e); }
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
          await supabase.from('tickets').insert([{
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
        } catch (e) { console.error(e); }
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
          await supabase.from('quotes').insert([{
            client_id: quote.clientId,
            date: quote.date,
            total_value: quote.totalValue,
            status: quote.status,
            items: quote.items
          }]);
        } catch (e) { console.error(e); }
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
          await supabase.from('receipts').insert([{
            client_id: receipt.clientId,
            date: receipt.date,
            value: receipt.value,
            description: receipt.description
          }]);
        } catch (e) { console.error(e); }
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
          await supabase.from('costs').insert([{
            description: cost.description,
            value: cost.value,
            date: cost.date,
            category: cost.category
          }]);
        } catch (e) { console.error(e); }
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
          await supabase.from('appointments').insert([{
            title: appointment.title,
            start_time: appointment.start,
            end_time: appointment.end,
            type: appointment.type,
            ticket_id: appointment.ticketId,
            notes: appointment.notes
          }]);
        } catch (e) { console.error(e); }
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
          await supabase.from('products').insert([{
            code: product.code,
            name: product.name,
            description: product.description,
            price: product.price,
            unit: product.unit
          }]);
        } catch (e) { console.error(e); }
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

      addSupplier: (supplier) => set((state) => ({ suppliers: [...state.suppliers, { ...supplier, id: uuidv4() }] })),
      updateSupplier: (id, updated) => set((state) => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...updated, id } : s)
      })),
      deleteSupplier: (id) => set((state) => ({ suppliers: state.suppliers.filter(s => s.id !== id) })),

      addSupplyItem: (item) => set((state) => ({ supplyItems: [...state.supplyItems, { ...item, id: uuidv4() }] })),
      updateSupplyItem: (id, updated) => set((state) => ({
        supplyItems: state.supplyItems.map(i => i.id === id ? { ...updated, id } : i)
      })),
      deleteSupplyItem: (id) => set((state) => ({ supplyItems: state.supplyItems.filter(i => i.id !== id) })),
      updateStock: (id, quantity) => set((state) => ({
        supplyItems: state.supplyItems.map(i => i.id === id ? { ...i, currentStock: i.currentStock + quantity } : i)
      })),

      createQuotation: (items) => set((state) => {
        const id = uuidv4();
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

        return { supplyQuotations: [...state.supplyQuotations, newQuotation] };
      }),

      updateQuotationResponse: (quotationId, supplierId, prices) => set((state) => ({
        supplyQuotations: state.supplyQuotations.map(q => {
          if (q.id !== quotationId) return q;
          return {
            ...q,
            responses: q.responses.map(r => 
              r.supplierId === supplierId ? { ...r, prices, status: 'RECEIVED' } : r
            )
          };
        })
      })),

      addPayment: (payment) => set((state) => ({ payments: [...state.payments, { ...payment, id: uuidv4() }] })),
      updatePayment: (id, updated) => set((state) => ({
        payments: state.payments.map(p => p.id === id ? { ...p, ...updated } : p)
      })),
      deletePayment: (id) => set((state) => ({ payments: state.payments.filter(p => p.id !== id) })),

      addLegalAgreement: (agreement) => set((state) => ({ legalAgreements: [...state.legalAgreements, { ...agreement, id: uuidv4() }] })),
      updateLegalAgreement: (id, updated) => set((state) => ({
        legalAgreements: state.legalAgreements.map(a => a.id === id ? { ...a, ...updated } : a)
      })),
      deleteLegalAgreement: (id) => set((state) => ({ legalAgreements: state.legalAgreements.filter(a => a.id !== id) })),
      
      addScheduledMaintenance: (maintenance) => set((state) => ({
        scheduledMaintenances: [...state.scheduledMaintenances, { ...maintenance, id: uuidv4() }]
      })),
      updateScheduledMaintenance: (id, updated) => set((state) => ({
        scheduledMaintenances: state.scheduledMaintenances.map(m => m.id === id ? { ...m, ...updated } : m)
      })),
      deleteScheduledMaintenance: (id) => set((state) => ({
        scheduledMaintenances: state.scheduledMaintenances.filter(m => m.id !== id)
      })),
      generateSchedulesForClient: (clientId) => {
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

      addConsumptionReading: (reading) => set((state) => ({
        consumptionReadings: [...state.consumptionReadings, { ...reading, id: uuidv4() }]
      })),
      addDigitalFolderItem: (item) => set((state) => ({
        digitalFolder: [...state.digitalFolder, { ...item, id: uuidv4(), status: 'PENDING', signatures: [] }]
      })),
      validateDigitalFolderItem: (id, userName, role) => set((state) => ({
        digitalFolder: state.digitalFolder.map(item => {
          if (item.id !== id) return item;
          const newSignature = { id: uuidv4(), userName, role, date: new Date().toISOString() };
          const newSignatures = [...item.signatures, newSignature];
          const newStatus = newSignatures.length >= 3 ? 'VALIDATED' : item.status;
          return { ...item, signatures: newSignatures, status: newStatus };
        })
      })),

      addAssembly: (assembly) => set((state) => ({
        assemblies: [
          ...state.assemblies,
          {
            ...assembly,
            id: uuidv4(),
            votes: [],
            legalValidityHash: `SHA256-${uuidv4().substring(0, 8).toUpperCase()}`
          }
        ]
      })),

      castVote: (assemblyId, optionId, userName) => set((state) => ({
        assemblies: state.assemblies.map(a => {
          if (a.id !== assemblyId) return a;
          const vote: Vote = {
            id: uuidv4(),
            userId: 'current-user', // In a real app, this would be the logged in user's ID
            userName,
            optionId,
            timestamp: new Date().toISOString(),
            signature: `SIG-${uuidv4().substring(0, 12).toUpperCase()}`
          };
          return { ...a, votes: [...a.votes, vote] };
        })
      })),

      closeAssembly: (id) => set((state) => ({
        assemblies: state.assemblies.map(a => a.id === id ? { ...a, status: 'CLOSED' } : a)
      })),

      deleteAssembly: (id) => set((state) => ({
        assemblies: state.assemblies.filter(a => a.id !== id)
      })),

      addNotice: (notice) => set((state) => ({
        notices: [
          { ...notice, id: uuidv4(), date: new Date().toISOString() },
          ...state.notices
        ]
      })),

      updateNotice: (id, updated) => set((state) => ({
        notices: state.notices.map(n => n.id === id ? { ...n, ...updated } : n)
      })),

      deleteNotice: (id) => set((state) => ({
        notices: state.notices.filter(n => n.id !== id)
      })),

      addPackage: (pkg) => set((state) => {
        const id = uuidv4();
        const newPkg: Package = {
          ...pkg,
          id,
          receivedAt: new Date().toISOString(),
          status: 'PENDING',
          qrCode: `PKG-${id.substring(0, 8).toUpperCase()}`
        };
        
        // Auto-notify logic
        state.addNotification({
          title: 'Nova Encomenda!',
          message: `Pacote de ${pkg.carrier} para ${pkg.residentName} (${pkg.apartment} ${pkg.tower}). QR Code enviado via WhatsApp.`,
          type: 'SUCCESS'
        });

        return { packages: [newPkg, ...state.packages] };
      }),

      pickupPackage: (id) => set((state) => {
        const pkg = state.packages.find(p => p.id === id);
        if (pkg) {
          state.addNotification({
            title: 'Encomenda Retirada',
            message: `O pacote de ${pkg.carrier} foi retirado por ${pkg.residentName}.`,
            type: 'INFO'
          });
        }
        return {
          packages: state.packages.map(p => 
            p.id === id ? { ...p, status: 'PICKED_UP', pickedUpAt: new Date().toISOString() } : p
          )
        };
      }),

      addVisitor: (visitor) => set((state) => {
        const id = uuidv4();
        const newVisitor: Visitor = {
          ...visitor,
          id,
          qrCode: `VIS-${id}`,
          status: 'ACTIVE'
        };
        return { visitors: [newVisitor, ...state.visitors] };
      }),

      revokeVisitor: (id) => set((state) => ({
        visitors: state.visitors.map(v => v.id === id ? { ...v, status: 'EXPIRED' } : v)
      })),

      updateCriticalEvent: (id, status, description) => set((state) => {
        const updatedEvents = state.criticalEvents.map(e => 
          e.id === id ? { ...e, status, description, lastUpdate: new Date().toISOString() } : e
        );

        if (status === 'CRITICAL') {
          const event = updatedEvents.find(e => e.id === id);
          state.addNotification({
            title: 'ALERTA CRÍTICO!',
            message: `${event?.device}: ${description}`,
            type: 'ERROR'
          });
        }

        return { criticalEvents: updatedEvents };
      }),

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
