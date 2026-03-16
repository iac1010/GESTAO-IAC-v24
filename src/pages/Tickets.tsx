import { useState } from 'react';
import { useStore, TicketStatus } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Edit, Hammer, Clock, ShieldAlert, Bell, Wrench, ExternalLink, Filter, Search, Tag } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { Modal } from '../components/Modal';
import { motion, AnimatePresence } from 'motion/react';

export default function Tickets() {
  const navigate = useNavigate();
  const { tickets, clients, deleteTicket, updateTicket } = useStore();
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const client = clients.find(c => c.id === ticket.clientId);
    const searchStr = `${ticket.osNumber || ''} ${ticket.title} ${client?.name} ${ticket.technician} ${ticket.type} ${ticket.maintenanceCategory || ''} ${ticket.maintenanceSubcategory || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const preventivas = tickets.filter(t => t.type === 'PREVENTIVA').length;
  const corretivas = tickets.filter(t => t.type === 'CORRETIVA').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDO': return 'bg-[#16a34a]'; // Green
      case 'REALIZANDO': return 'bg-[#0078d7]'; // Blue
      case 'PENDENTE_APROVACAO': return 'bg-[#f0a30a]'; // Yellow/Gold
      case 'REJEITADO': return 'bg-[#ee1111]'; // Red
      default: return 'bg-[#71717a]'; // Zinc
    }
  };

  return (
    <div className="min-h-screen bg-[#004a7c] text-white -m-8 p-8 md:p-12 overflow-x-hidden relative flex flex-col">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,1000 C300,800 400,900 1000,600 L1000,1000 L0,1000 Z" fill="white" fillOpacity="0.1" />
          <path d="M0,800 C200,600 500,700 1000,400 L1000,800 L0,800 Z" fill="white" fillOpacity="0.05" />
        </svg>
      </div>

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 shrink-0">
        <div className="flex items-center gap-6">
          <BackButton />
          <div>
            <h1 className="text-6xl font-light tracking-tight text-white">Ordens de Serviço</h1>
            <p className="text-xl opacity-60 mt-2 font-light text-white">Gerencie as manutenções e atendimentos</p>
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link 
            to="/tickets/new"
            className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 flex items-center gap-3 border border-white/20 backdrop-blur-md transition-all rounded-2xl shadow-2xl font-bold tracking-widest uppercase text-sm"
          >
            <Plus className="w-6 h-6" />
            Nova Ordem
          </Link>
        </motion.div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-10"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex items-center justify-between shadow-2xl group hover:bg-white/10 transition-all">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Corretivas</p>
              <p className="text-5xl font-black text-white">{corretivas}</p>
            </div>
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-10 h-10" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex items-center justify-between shadow-2xl group hover:bg-white/10 transition-all">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Preventivas</p>
              <p className="text-5xl font-black text-white">{preventivas}</p>
            </div>
            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
              <Clock className="w-10 h-10" />
            </div>
          </motion.div>
        </div>

        {/* Search and List Section */}
        <div className="relative z-10">
          <div className="mb-8 max-w-xl relative">
            <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Buscar ordens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl outline-none transition-all text-xl font-light placeholder:text-white/20 backdrop-blur-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTickets.slice().reverse().map((ticket) => {
                const client = clients.find(c => c.id === ticket.clientId);

                return (
                  <motion.div 
                    layout
                    key={ticket.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className={`aspect-square p-6 flex flex-col justify-between shadow-xl relative group cursor-pointer transition-all border border-white/10 ${ticket.color ? '' : getStatusColor(ticket.status)}`}
                    style={ticket.color ? { backgroundColor: ticket.color } : {}}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    {/* Top Section */}
                    <div>
                      <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center mb-4">
                        <Wrench className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight mb-1 line-clamp-2">
                        {ticket.title || `Manutenção ${ticket.type}`}
                      </h3>
                      <p className="text-[10px] text-white/70 font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Cód: {ticket.osNumber || 'S/N'}
                      </p>
                      <p className="text-xs text-white/60 mt-2 line-clamp-1">
                        {client?.name || 'Local não especificado'}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">
                        STATUS / TÉCNICO
                      </p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-black text-white truncate">
                          {ticket.status.replace('_', ' ')}
                        </p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/tickets/${ticket.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </Link>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setTicketToDelete(ticket.id);
                            }}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredTickets.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-6 backdrop-blur-md border border-white/10">
                  <Wrench className="w-12 h-12 text-white/40" />
                </div>
                <h3 className="text-2xl font-light opacity-60">Nenhuma ordem encontrada</h3>
                <p className="opacity-40 mt-2">Tente ajustar sua busca ou crie uma nova ordem.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Modal 
        isOpen={!!ticketToDelete} 
        onClose={() => setTicketToDelete(null)} 
        title="Confirmar Exclusão"
        maxWidth="sm"
        glass
      >
        <div className="space-y-8 p-2">
          <div className="flex items-center gap-4 text-amber-400 bg-amber-400/10 p-4 rounded-2xl border border-amber-400/20">
            <ShieldAlert className="w-8 h-8 shrink-0" />
            <p className="font-medium leading-relaxed">Tem certeza que deseja excluir este atendimento? Esta ação não pode ser desfeita.</p>
          </div>
          
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button 
              onClick={() => setTicketToDelete(null)}
              className="px-8 py-4 text-white/60 hover:text-white font-bold transition-colors"
            >
              CANCELAR
            </button>
            <button 
              onClick={() => {
                if (ticketToDelete) deleteTicket(ticketToDelete);
                setTicketToDelete(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              EXCLUIR
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
