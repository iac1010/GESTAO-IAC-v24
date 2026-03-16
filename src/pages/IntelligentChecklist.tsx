import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { NBR5674_STANDARDS } from '../constants/maintenance';
import { 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  RefreshCw, 
  Building2,
  Bell,
  Check,
  Download,
  FileText
} from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { format, isAfter, parseISO, addMonths, addYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { generatePdf } from '../utils/pdfGenerator';
import { useRef } from 'react';

export default function IntelligentChecklist() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { 
    clients, 
    scheduledMaintenances, 
    generateSchedulesForClient, 
    updateScheduledMaintenance,
    addScheduledMaintenance,
    addNotification,
    companyLogo
  } = useStore();

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    item: '',
    frequency: 'Mensal' as const,
    category: 'Geral'
  });

  const clientSchedules = useMemo(() => {
    return scheduledMaintenances.filter(m => m.clientId === selectedClientId);
  }, [scheduledMaintenances, selectedClientId]);

  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === selectedClientId);
  }, [clients, selectedClientId]);

  const handleGenerate = () => {
    if (!selectedClientId) return;
    generateSchedulesForClient(selectedClientId);
    addNotification({
      title: 'Cronograma Gerado',
      message: `Cronograma NBR 5674 gerado com sucesso para ${selectedClient?.name}.`,
      type: 'SUCCESS'
    });
  };

  const handleAddTask = () => {
    if (!selectedClientId || !newTask.item) return;
    
    const nextDate = new Date();
    if (newTask.frequency === 'Mensal') nextDate.setMonth(nextDate.getMonth() + 1);
    else if (newTask.frequency === 'Trimestral') nextDate.setMonth(nextDate.getMonth() + 3);
    else if (newTask.frequency === 'Semestral') nextDate.setMonth(nextDate.getMonth() + 6);
    else nextDate.setFullYear(nextDate.getFullYear() + 1);

    addScheduledMaintenance({
      clientId: selectedClientId,
      standardId: 'custom-' + Date.now(),
      item: newTask.item,
      frequency: newTask.frequency,
      nextDate: nextDate.toISOString().split('T')[0],
      status: 'PENDING',
      category: newTask.category
    });

    addNotification({
      title: 'Tarefa Adicionada',
      message: `Tarefa "${newTask.item}" adicionada ao cronograma.`,
      type: 'SUCCESS'
    });

    setShowAddTaskModal(false);
    setNewTask({ item: '', frequency: 'Mensal', category: 'Geral' });
  };

  const handleMarkAsDone = (id: string, frequency: string) => {
    const lastDone = new Date().toISOString().split('T')[0];
    const nextDateObj = new Date();
    
    if (frequency === 'Mensal') nextDateObj.setMonth(nextDateObj.getMonth() + 1);
    else if (frequency === 'Trimestral') nextDateObj.setMonth(nextDateObj.getMonth() + 3);
    else if (frequency === 'Semestral') nextDateObj.setMonth(nextDateObj.getMonth() + 6);
    else nextDateObj.setFullYear(nextDateObj.getFullYear() + 1);

    const nextDate = nextDateObj.toISOString().split('T')[0];

    updateScheduledMaintenance(id, {
      lastDone,
      nextDate,
      status: 'DONE'
    });

    addNotification({
      title: 'Manutenção Concluída',
      message: `Manutenção registrada. Próxima data: ${format(nextDateObj, 'dd/MM/yyyy')}`,
      type: 'INFO'
    });
  };

  const handleExportPDF = async () => {
    if (!printRef.current || !selectedClient) return;
    
    try {
      addNotification({
        title: 'Gerando PDF',
        message: 'Preparando seu checklist para exportação...',
        type: 'INFO'
      });
      
      await generatePdf(printRef.current, `Checklist_${selectedClient.name}_${format(new Date(), 'dd_MM_yyyy')}.pdf`);
      
      addNotification({
        title: 'PDF Gerado',
        message: 'O checklist foi exportado com sucesso.',
        type: 'SUCCESS'
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      addNotification({
        title: 'Erro na Exportação',
        message: 'Não foi possível gerar o PDF do checklist.',
        type: 'ERROR'
      });
    }
  };

  const getStatusIcon = (status: string, nextDate: string) => {
    const isOverdue = isAfter(new Date(), parseISO(nextDate));
    if (isOverdue) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (status === 'DONE') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="min-h-screen bg-[#004a7c] text-white -m-8 p-8 md:p-12 overflow-x-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,1000 C300,800 400,900 1000,600 L1000,1000 L0,1000 Z" fill="white" fillOpacity="0.1" />
          <path d="M0,800 C200,600 500,700 1000,400 L1000,800 L0,800 Z" fill="white" fillOpacity="0.05" />
        </svg>
      </div>

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <BackButton />
          <div>
            <h1 className="text-6xl font-light tracking-tight">Checklist Inteligente</h1>
            <p className="text-xl opacity-60 mt-2 font-light">Cronograma automático NBR 5674</p>
          </div>
        </div>

        {selectedClientId && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95"
              title="Exportar Checklist em PDF"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Adicionar Tarefa
            </button>
            {clientSchedules.length === 0 && (
              <button
                onClick={handleGenerate}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border border-white/20 backdrop-blur-md shadow-lg active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Gerar Cronograma
              </button>
            )}
          </div>
        )}
      </header>

      <main className="relative z-10">
        {!selectedClientId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map(client => (
              <button
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-md hover:bg-white/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* 3D-like Building Icon */}
                <div className="relative w-32 h-32 mx-auto mb-8 perspective-1000 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-x-12 rotate-y-12 shadow-2xl" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl transform -translate-z-4 border border-white/20" />
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
                    {companyLogo ? (
                      <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <img 
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/building-5691535-4741038.png" 
                        alt="Building" 
                        className="w-full h-full object-contain p-2"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://img.icons8.com/3d-fluency/188/city-buildings.png";
                        }}
                      />
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-2">{client.name}</h3>
                <p className="text-white/50 text-sm uppercase tracking-widest font-bold">
                  {scheduledMaintenances.filter(m => m.clientId === client.id).length} Tarefas Ativas
                </p>
                
                <div className="mt-8 flex justify-center">
                  <span className="px-6 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-white text-white group-hover:text-[#004a7c] transition-colors">
                    Abrir Unidade
                  </span>
                </div>
              </button>
            ))}
            
            {clients.length === 0 && (
              <div className="col-span-full bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-md">
                <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-4 opacity-50 grayscale" />
                  ) : (
                    <img 
                      src="https://cdn3d.iconscout.com/3d/premium/thumb/building-5691535-4741038.png" 
                      alt="Building" 
                      className="w-full h-full object-contain p-4 opacity-50 grayscale"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = "https://img.icons8.com/3d-fluency/188/city-buildings.png";
                      }}
                    />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">Nenhum cliente cadastrado</h3>
                <p className="text-white/50 max-w-md mx-auto">
                  Cadastre condomínios na aba de Clientes para começar a gerenciar as manutenções.
                </p>
              </div>
            )}
          </div>
        ) : clientSchedules.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-md">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Nenhum cronograma ativo para {selectedClient?.name}</h3>
            <p className="text-white/50 max-w-md mx-auto mb-8">
              Este cliente ainda não possui um cronograma de manutenção inteligente baseado na NBR 5674.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleGenerate}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 border border-white/20 shadow-lg active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Gerar Cronograma Automático
              </button>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Adicionar Tarefa Manual
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientSchedules.map(schedule => {
              const isOverdue = isAfter(new Date(), parseISO(schedule.nextDate));
              
              return (
                <div 
                  key={schedule.id}
                  className={`bg-white/5 border ${isOverdue ? 'border-red-500/30' : 'border-white/10'} rounded-3xl p-6 backdrop-blur-md hover:bg-white/10 transition-all relative overflow-hidden group`}
                >
                  {isOverdue && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      Atrasado
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                      {getStatusIcon(schedule.status, schedule.nextDate)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      {schedule.frequency}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{schedule.item}</h3>
                  <p className="text-sm text-white/50 mb-6 line-clamp-2">
                    {NBR5674_STANDARDS.find(s => s.id === schedule.standardId)?.description || 'Tarefa personalizada adicionada pelo usuário.'}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40">Última Realização:</span>
                      <span className="font-medium">{schedule.lastDone ? format(parseISO(schedule.lastDone), 'dd/MM/yyyy') : 'Nunca'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/40">Próxima Manutenção:</span>
                      <span className={`font-bold ${isOverdue ? 'text-red-400' : 'text-emerald-400'}`}>
                        {format(parseISO(schedule.nextDate), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkAsDone(schedule.id, schedule.frequency)}
                    className="w-full py-4 rounded-2xl bg-white/5 hover:bg-emerald-500 text-white transition-all font-bold flex items-center justify-center gap-2 group/btn border border-white/10 hover:border-emerald-500 active:scale-95"
                  >
                    <Check className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                    Marcar como Realizado
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {selectedClientId && clientSchedules.length > 0 && (
          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4 backdrop-blur-md">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-blue-400">Alertas Inteligentes Ativados</h4>
              <p className="text-sm text-white/60 mt-1">
                O sistema monitora automaticamente as datas de vencimento. Você receberá notificações 7 dias antes de cada manutenção e alertas imediatos em caso de atraso.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#004a7c] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-black mb-6">Nova Tarefa Preventiva</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Item da Manutenção</label>
                <input 
                  type="text"
                  value={newTask.item}
                  onChange={(e) => setNewTask({...newTask, item: e.target.value})}
                  placeholder="Ex: Limpeza de Ar Condicionado"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30 transition-all text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Frequência</label>
                <select
                  value={newTask.frequency}
                  onChange={(e) => setNewTask({...newTask, frequency: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30 transition-all text-white"
                >
                  <option value="Mensal" className="bg-[#004a7c]">Mensal</option>
                  <option value="Trimestral" className="bg-[#004a7c]">Trimestral</option>
                  <option value="Semestral" className="bg-[#004a7c]">Semestral</option>
                  <option value="Anual" className="bg-[#004a7c]">Anual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Categoria</label>
                <input 
                  type="text"
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  placeholder="Ex: Elétrica, Hidráulica..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30 transition-all text-white"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddTask}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Template (Hidden) */}
      <div className="hidden">
        <div ref={printRef} className="p-12 bg-white text-zinc-900 font-sans w-[210mm] min-h-[297mm]">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 tracking-tight">FLORES MANUTENÇÃO PREDIAL LTDA</h1>
              <p className="text-zinc-500 font-medium text-sm">Relatório de Inspeção e Manutenção Preventiva</p>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center overflow-hidden">
              {companyLogo ? (
                <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          
          <div className="w-full h-0.5 bg-zinc-300 mb-8" />

          {/* Info Box */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 mb-10 grid grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Condomínio/Prédio:</p>
              <p className="text-xl font-bold border-b border-zinc-300 pb-1">{selectedClient?.name || '________________________________'}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Data da Inspeção:</p>
              <p className="text-xl font-bold border-b border-zinc-300 pb-1">____ / ____ / 20____</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Responsável Técnico:</p>
              <p className="text-xl font-bold border-b border-zinc-300 pb-1">________________________________</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Assinatura:</p>
              <p className="text-xl font-bold border-b border-zinc-300 pb-1">________________________________</p>
            </div>
          </div>

          {/* Section Title */}
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">ITENS DE VERIFICAÇÃO</h2>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100 border-y border-zinc-300">
                <th className="py-3 px-2 text-center text-[10px] font-black uppercase tracking-widest text-zinc-600 w-12">OK</th>
                <th className="py-3 px-2 text-center text-[10px] font-black uppercase tracking-widest text-zinc-600 w-12">NOK</th>
                <th className="py-3 px-2 text-center text-[10px] font-black uppercase tracking-widest text-zinc-600 w-12">N/A</th>
                <th className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-600">Item / Descrição</th>
                <th className="py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-600 w-48">Observações</th>
              </tr>
            </thead>
            <tbody>
              {clientSchedules.map((schedule, idx) => (
                <tr key={idx} className="border-b border-zinc-200">
                  <td className="py-4 px-2 text-center">
                    <div className="w-5 h-5 border-2 border-zinc-300 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="w-5 h-5 border-2 border-zinc-300 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="w-5 h-5 border-2 border-zinc-300 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-zinc-900">{schedule.item}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tight">
                      {schedule.category} - {schedule.frequency}
                    </p>
                  </td>
                  <td className="py-4 px-4 border-l border-zinc-200">
                    <div className="h-6" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="mt-auto pt-20 text-center">
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Documento gerado automaticamente pelo sistema de gestão integrada.<br />
              A conformidade com a NBR 5674 é de responsabilidade do síndico/gestor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
