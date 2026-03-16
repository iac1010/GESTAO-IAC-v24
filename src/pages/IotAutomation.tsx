import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Zap,
  Droplets,
  DoorOpen,
  Lightbulb,
  Power,
  Settings,
  History,
  ShieldCheck,
  Activity,
  Clock,
  Lock,
  Unlock,
  Plus,
  X,
  Cpu,
  Wifi,
  Radio,
  Share2
} from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface AutomationItem {
  id: string;
  name: string;
  type: 'PUMP' | 'LIGHT' | 'GATE' | 'SENSOR';
  status: 'ON' | 'OFF' | 'OPEN' | 'CLOSED' | 'ACTIVE';
  lastAction: string;
  location: string;
  protocol?: string;
}

export default function IotAutomation() {
  const { addNotification } = useStore();
  const [showConfig, setShowConfig] = useState(false);
  const [automations, setAutomations] = useState<AutomationItem[]>([
    { id: '1', name: 'Bomba de Água', type: 'PUMP', status: 'OFF', lastAction: new Date().toISOString(), location: 'Casa de Máquinas', protocol: 'MQTT' },
    { id: '2', name: 'Luz da Quadra', type: 'LIGHT', status: 'OFF', lastAction: new Date().toISOString(), location: 'Área Esportiva', protocol: 'Zigbee' },
    { id: '3', name: 'Luzes Salão de Festa', type: 'LIGHT', status: 'OFF', lastAction: new Date().toISOString(), location: 'Bloco A - Térreo', protocol: 'Matter' },
    { id: '4', name: 'Abertura de Portão', type: 'GATE', status: 'CLOSED', lastAction: new Date().toISOString(), location: 'Entrada Principal', protocol: 'WiFi' },
  ]);

  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'LIGHT' as AutomationItem['type'],
    location: '',
    protocol: 'Matter'
  });

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(item => {
      if (item.id === id) {
        let newStatus = item.status;
        if (item.type === 'GATE') {
          newStatus = item.status === 'OPEN' ? 'CLOSED' : 'OPEN';
          toast.success(`${item.name} ${newStatus === 'OPEN' ? 'abrindo...' : 'fechando...'}`);
        } else {
          newStatus = item.status === 'ON' ? 'OFF' : 'ON';
          toast.success(`${item.name} ${newStatus === 'ON' ? 'ligado' : 'desligado'}`);
        }

        addNotification({
          title: 'Automação IoT',
          message: `${item.name} foi ${newStatus.toLowerCase()} via painel remoto.`,
          type: 'INFO'
        });

        return { ...item, status: newStatus, lastAction: new Date().toISOString() };
      }
      return item;
    }));
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.location) {
      toast.error('Preencha todos os campos');
      return;
    }

    const device: AutomationItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDevice.name,
      type: newDevice.type,
      location: newDevice.location,
      protocol: newDevice.protocol,
      status: newDevice.type === 'GATE' ? 'CLOSED' : 'OFF',
      lastAction: new Date().toISOString()
    };

    setAutomations(prev => [...prev, device]);
    setShowConfig(false);
    setNewDevice({ name: '', type: 'LIGHT', location: '', protocol: 'Matter' });
    toast.success('Dispositivo cadastrado com sucesso!');
    
    addNotification({
      title: 'Novo Dispositivo IoT',
      message: `${device.name} foi adicionado ao sistema via protocolo ${device.protocol}.`,
      type: 'SUCCESS'
    });
  };

  const getIcon = (type: AutomationItem['type'], status: AutomationItem['status']) => {
    const active = status === 'ON' || status === 'OPEN' || status === 'ACTIVE';
    switch (type) {
      case 'PUMP':
        return <Droplets className={`w-8 h-8 ${active ? 'text-blue-400' : 'text-white/40'}`} />;
      case 'LIGHT':
        return <Lightbulb className={`w-8 h-8 ${active ? 'text-yellow-400' : 'text-white/40'}`} />;
      case 'GATE':
        return active ? <Unlock className="w-8 h-8 text-emerald-400" /> : <Lock className="w-8 h-8 text-white/40" />;
      case 'SENSOR':
        return <Activity className={`w-8 h-8 ${active ? 'text-purple-400' : 'text-white/40'}`} />;
      default:
        return <Zap className="w-8 h-8 text-white/40" />;
    }
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
            <h1 className="text-6xl font-light tracking-tight">Automações IoT</h1>
            <p className="text-xl opacity-60 mt-2 font-light">Controle remoto de dispositivos conectados</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-500/20 backdrop-blur-md shadow-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Hub IoT Online
          </div>
          <button 
            onClick={() => setShowConfig(true)}
            className="p-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-md shadow-xl group"
          >
            <Settings className="w-5 h-5 text-white/60 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </header>

      {/* Automation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        {automations.map((item) => {
          const isActive = item.status === 'ON' || item.status === 'OPEN' || item.status === 'ACTIVE';
          return (
            <motion.div
              key={item.id}
              layout
              className={`bg-white/5 border border-white/10 backdrop-blur-md rounded-[32px] p-8 shadow-xl relative overflow-hidden transition-all group ${
                isActive ? 'ring-2 ring-emerald-500/50 bg-white/10' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl transition-all duration-500 ${
                  isActive ? 'bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-white/5'
                }`}>
                  {getIcon(item.type, item.status)}
                </div>
                <button
                  onClick={() => toggleAutomation(item.id)}
                  className={`w-14 h-8 rounded-full relative transition-all duration-300 ${
                    isActive ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    animate={{ x: isActive ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              <h3 className="text-2xl font-black text-white mb-1">{item.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded">
                  {item.protocol}
                </span>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  {item.location}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Status</span>
                  <span className={`text-xs font-black uppercase tracking-widest ${
                    isActive ? 'text-emerald-400' : 'text-white/40'
                  }`}>
                    {item.status === 'OPEN' ? 'Aberto' : item.status === 'CLOSED' ? 'Fechado' : item.status === 'ON' ? 'Ligado' : item.status === 'OFF' ? 'Desligado' : 'Ativo'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 block">Último Acionamento</span>
                  <span className="text-[10px] font-bold text-white/40">
                    {format(new Date(item.lastAction), "HH:mm:ss")}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add New Device Shortcut Card */}
        <button
          onClick={() => setShowConfig(true)}
          className="bg-white/5 border-2 border-dashed border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all group"
        >
          <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-white/40" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-white/40">Novo Dispositivo</span>
        </button>
      </div>

      {/* Secondary Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-md overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <History className="w-5 h-5 text-white/60" />
              </div>
              <h2 className="text-2xl font-black text-white">Log de Atividades</h2>
            </div>
            <button className="text-sm font-bold text-white hover:underline opacity-60">Ver Tudo</button>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {[
                { time: '14:02', event: 'Portão Principal: Abertura Remota', user: 'Síndico', status: 'Sucesso' },
                { time: '13:45', event: 'Bomba de Água: Desligamento Automático', user: 'Sistema', status: 'Sucesso' },
                { time: '12:00', event: 'Luzes Salão: Programação Diária', user: 'Agendamento', status: 'Sucesso' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="text-sm font-black text-white/40 w-16">{item.time}</div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{item.event}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Por: {item.user}</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white text-[#004a7c] rounded-[40px] p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-black mb-4">Segurança</h3>
            <p className="opacity-60 font-medium mb-6 text-sm">Todos os acionamentos são criptografados ponta-a-ponta e registrados para auditoria.</p>
            <div className="flex items-center gap-3 p-4 bg-[#004a7c]/5 rounded-2xl border border-[#004a7c]/10">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold">Monitoramento de Carga Ativo</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-[40px] p-8 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-black text-white">Consumo IoT</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/40">Dispositivos</span>
                <span className="text-sm font-bold text-white">{automations.length} Ativos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/40">Latência</span>
                <span className="text-sm font-bold text-emerald-400">12ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/40">Sinal Mesh</span>
                <span className="text-sm font-bold text-white">Excelente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfig(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#004a7c] border border-white/10 rounded-[40px] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Cadastrar Dispositivo</h2>
                </div>
                <button 
                  onClick={() => setShowConfig(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <form onSubmit={handleAddDevice} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nome do Dispositivo</label>
                    <input
                      type="text"
                      value={newDevice.name}
                      onChange={e => setNewDevice({...newDevice, name: e.target.value})}
                      placeholder="Ex: Luz da Piscina"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Localização</label>
                    <input
                      type="text"
                      value={newDevice.location}
                      onChange={e => setNewDevice({...newDevice, location: e.target.value})}
                      placeholder="Ex: Área de Lazer"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block">Tipo de Dispositivo</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'LIGHT', label: 'Luz', icon: Lightbulb },
                      { id: 'PUMP', label: 'Bomba', icon: Droplets },
                      { id: 'GATE', label: 'Portão', icon: DoorOpen },
                      { id: 'SENSOR', label: 'Sensor', icon: Activity },
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setNewDevice({...newDevice, type: type.id as any})}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                          newDevice.type === type.id 
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        <type.icon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block">Protocolo de Comunicação</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'Matter', label: 'Matter', icon: Share2, desc: 'Universal' },
                      { id: 'MQTT', label: 'MQTT', icon: Cpu, desc: 'Industrial' },
                      { id: 'Zigbee', label: 'Zigbee', icon: Radio, desc: 'Mesh' },
                      { id: 'WiFi', label: 'WiFi', icon: Wifi, desc: 'Direto' },
                    ].map(protocol => (
                      <button
                        key={protocol.id}
                        type="button"
                        onClick={() => setNewDevice({...newDevice, protocol: protocol.id})}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                          newDevice.protocol === protocol.id 
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        <protocol.icon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{protocol.label}</span>
                        <span className="text-[8px] opacity-60 uppercase tracking-tighter">{protocol.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
                  >
                    Finalizar Cadastro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
