import { useMemo, useState, useEffect } from 'react';
import { useStore, ConsumptionReading } from '../store';
import { 
  Droplets, 
  Flame, 
  TrendingUp, 
  AlertCircle, 
  Plus,
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function ConsumptionDashboard() {
  const navigate = useNavigate();
  const { clients, consumptionReadings, addConsumptionReading, addNotification } = useStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'WATER' | 'GAS'>('all');

  // Mock data if empty
  const displayReadings = useMemo(() => {
    return consumptionReadings;
  }, [consumptionReadings]);

  const filteredReadings = useMemo(() => {
    return displayReadings.filter(r => {
      const clientMatch = selectedClient === 'all' || r.clientId === selectedClient;
      const typeMatch = selectedType === 'all' || r.type === selectedType;
      return clientMatch && typeMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [displayReadings, selectedClient, selectedType]);

  const stats = useMemo(() => {
    const water = displayReadings.filter(r => r.type === 'WATER');
    const gas = displayReadings.filter(r => r.type === 'GAS');
    
    const totalWater = water.reduce((acc, curr) => acc + curr.consumption, 0);
    const totalGas = gas.reduce((acc, curr) => acc + curr.consumption, 0);
    
    return {
      totalWater,
      totalGas,
      avgWater: totalWater / (water.length || 1),
      avgGas: totalGas / (gas.length || 1)
    };
  }, [displayReadings]);

  const chartData = useMemo(() => {
    const data: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStr = format(date, 'MMM/yy', { locale: ptBR });
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      
      const waterCons = displayReadings
        .filter(r => r.type === 'WATER' && isWithinInterval(new Date(r.date), { start, end }))
        .reduce((acc, curr) => acc + curr.consumption, 0);
        
      const gasCons = displayReadings
        .filter(r => r.type === 'GAS' && isWithinInterval(new Date(r.date), { start, end }))
        .reduce((acc, curr) => acc + curr.consumption, 0);
        
      data.push({ name: monthStr, Água: waterCons, Gás: gasCons });
    }
    return data;
  }, [displayReadings]);

  const simulateIoTReadings = () => {
    setIsSimulating(true);
    setTimeout(() => {
      clients.forEach(client => {
        ['WATER', 'GAS'].forEach(type => {
          const lastReading = displayReadings
            .filter(r => r.clientId === client.id && r.type === type)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            
          const prevVal = lastReading ? lastReading.currentValue : 100;
          const consumption = 2 + Math.random() * 5;
          
          addConsumptionReading({
            clientId: client.id,
            type: type as 'WATER' | 'GAS',
            previousValue: prevVal,
            currentValue: prevVal + consumption,
            consumption: consumption,
            date: new Date().toISOString().split('T')[0],
            unit: 'm³',
            billed: false
          });
        });
      });
      
      addNotification({
        title: 'Leituras IoT Recebidas',
        message: 'Novas medições de água e gás foram processadas automaticamente via sensores.',
        type: 'SUCCESS'
      });
      
      setIsSimulating(false);
    }, 2000);
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
            <h1 className="text-6xl font-light tracking-tight">Consumo</h1>
            <p className="text-xl opacity-60 mt-2 font-light">Monitoramento IoT em tempo real</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={simulateIoTReadings}
            disabled={isSimulating}
            className="bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all backdrop-blur-md disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSimulating ? 'animate-spin' : ''}`} /> 
            Sincronizar
          </button>
          <button className="bg-white text-[#004a7c] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all shadow-xl">
            <Plus className="w-5 h-5" /> Nova Leitura
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md"
        >
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Droplets className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">Consumo Água (Mês)</p>
          <h3 className="text-4xl font-black text-white">{stats.totalWater.toFixed(1)} <span className="text-lg text-white/40">m³</span></h3>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+2.4% vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md"
        >
          <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Flame className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">Consumo Gás (Mês)</p>
          <h3 className="text-4xl font-black text-white">{stats.totalGas.toFixed(1)} <span className="text-lg text-white/40">m³</span></h3>
          <div className="mt-4 flex items-center gap-2 text-rose-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+5.1% vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md"
        >
          <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">Sensores Ativos</p>
          <h3 className="text-4xl font-black text-white">124 <span className="text-lg text-white/40">unid</span></h3>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Operacionais</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md"
        >
          <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
            <BarChart3 className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">Faturamento Automático</p>
          <h3 className="text-4xl font-black text-white">98%</h3>
          <div className="mt-4 flex items-center gap-2 text-white/40 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Próximo ciclo em 12 dias</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative z-10">
        <div className="lg:col-span-2 bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-indigo-400" /> Tendência de Consumo Global
            </h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0, 74, 124, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Água" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Gás" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-md overflow-hidden">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-400" /> Alertas de Consumo Atípico
          </h3>
          <div className="space-y-6">
            {clients.slice(0, 4).map((client, i) => (
              <div key={client.id} className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-black text-rose-100">{client.name}</p>
                    <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">Unidade {100 + i * 10}</p>
                  </div>
                  <div className="bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                    ALERTA
                  </div>
                </div>
                <p className="text-sm text-rose-100/70 mb-4">Aumento repentino de 45% no consumo de água nas últimas 24h. Possível vazamento detectado.</p>
                <button className="w-full py-3 bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                  Notificar Morador
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-md overflow-hidden relative z-10">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-2xl font-black flex items-center gap-3">
            <Clock className="w-6 h-6 text-indigo-400" /> Histórico de Leituras IoT
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Buscar unidade..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-white/30 transition-all text-white" 
              />
            </div>
            <select 
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/30 transition-all text-white"
            >
              <option value="all" className="bg-[#004a7c]">Todos os Clientes</option>
              {clients.map(c => <option key={c.id} value={c.id} className="bg-[#004a7c]">{c.name}</option>)}
            </select>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/30 transition-all text-white"
            >
              <option value="all" className="bg-[#004a7c]">Todos os Tipos</option>
              <option value="WATER" className="bg-[#004a7c]">Água</option>
              <option value="GAS" className="bg-[#004a7c]">Gás</option>
            </select>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">
              <Download className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-4 text-xs font-black text-white/40 uppercase tracking-widest">Data</th>
                <th className="px-8 py-4 text-xs font-black text-white/40 uppercase tracking-widest">Unidade/Cliente</th>
                <th className="px-8 py-4 text-xs font-black text-white/40 uppercase tracking-widest">Tipo</th>
                <th className="px-8 py-4 text-xs font-black text-white/40 uppercase tracking-widest">Leitura Anterior</th>
                <th className="px-8 py-4 text-xs font-black text-white/40 uppercase tracking-widest">Leitura Atual</th>
                <th className="px-8 py-4 text-xs font-black text-white/40 uppercase tracking-widest">Consumo</th>
                <th className="px-8 py-4 text-xs font-black text-white/40 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReadings.map(reading => {
                const client = clients.find(c => c.id === reading.clientId);
                return (
                  <tr key={reading.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-white/60">{format(new Date(reading.date), 'dd/MM/yyyy')}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-white">{client?.name}</p>
                      <p className="text-xs text-white/40">{client?.address}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {reading.type === 'WATER' ? (
                          <Droplets className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Flame className="w-4 h-4 text-orange-400" />
                        )}
                        <span className="font-bold text-white/80">{reading.type === 'WATER' ? 'Água' : 'Gás'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-white/40">{reading.previousValue.toFixed(2)} m³</td>
                    <td className="px-8 py-6 text-sm font-bold text-white">{reading.currentValue.toFixed(2)} m³</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-white/10 text-white rounded-lg font-black text-xs">
                        {reading.consumption.toFixed(2)} m³
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        reading.billed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {reading.billed ? 'Faturado' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
