import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  Gavel, 
  FileSignature, 
  Scale,
  BookOpen,
  Copy
} from 'lucide-react';
import { useStore } from '../store';

const DOCUMENT_TEMPLATES = [
  {
    id: 'ata-assembleia',
    title: 'Ata de Assembleia Geral Ordinária',
    category: 'Assembleia',
    description: 'Modelo completo para registro de assembleias ordinárias, incluindo prestação de contas e eleição.',
    legalBasis: 'Código Civil Art. 1.350',
    content: 'Aos [DIA] dias do mês de [MÊS] de [ANO], às [HORA], em primeira convocação...'
  },
  {
    id: 'edital-convocacao',
    title: 'Edital de Convocação de Assembleia',
    category: 'Assembleia',
    description: 'Edital padrão para convocação de condôminos com todos os requisitos legais.',
    legalBasis: 'Código Civil Art. 1.354',
    content: 'Pelo presente edital, ficam convocados todos os senhores condôminos do Edifício [NOME]...'
  },
  {
    id: 'regimento-interno',
    title: 'Modelo de Regimento Interno',
    category: 'Governança',
    description: 'Estrutura base para regimento interno, adaptável para diferentes perfis de condomínio.',
    legalBasis: 'Código Civil Art. 1.334, V',
    content: 'CAPÍTULO I - DO EDIFÍCIO E SEUS FINS. Art. 1º - O Edifício [NOME] destina-se exclusivamente...'
  },
  {
    id: 'contrato-prestacao',
    title: 'Contrato de Prestação de Serviços',
    category: 'Contratos',
    description: 'Contrato padrão para contratação de serviços de manutenção e conservação.',
    legalBasis: 'Código Civil Art. 593 a 609',
    content: 'CONTRATANTE: Condomínio [NOME]. CONTRATADA: [EMPRESA]. OBJETO: Prestação de serviços de...'
  },
  {
    id: 'notificacao-multa',
    title: 'Notificação de Infração e Multa',
    category: 'Convivência',
    description: 'Modelo de notificação para unidades infratoras, respeitando o direito de defesa.',
    legalBasis: 'Código Civil Art. 1.336 e 1.337',
    content: 'Prezado(a) Senhor(a) Morador(a) da Unidade [NÚMERO]. Vimos por meio desta notificar que...'
  },
  {
    id: 'procuracao-assembleia',
    title: 'Procuração para Assembleia',
    category: 'Assembleia',
    description: 'Modelo de procuração com poderes específicos para representação em assembleia.',
    legalBasis: 'Código Civil Art. 653',
    content: 'OUTORGANTE: [NOME]. OUTORGADO: [NOME]. PODERES: Representar o outorgante na assembleia...'
  }
];

export default function DocumentFactory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...new Set(DOCUMENT_TEMPLATES.map(t => t.category))];

  const filteredTemplates = DOCUMENT_TEMPLATES.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Conteúdo copiado para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-8 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <BackButton />
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                <FileSignature className="w-8 h-8 text-blue-600" />
                Fábrica de Documentos
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">Modelos jurídicos prontos para o dia a dia do síndico</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-100 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map(template => (
            <div 
              key={template.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {template.category}
                </span>
              </div>

              <h3 className="text-xl font-black mb-3 leading-tight">{template.title}</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6 flex-grow">
                {template.description}
              </p>

              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Base Jurídica</span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-zinc-300">
                  {template.legalBasis}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleCopy(template.content)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
                <button 
                  className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                  title="Baixar PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black mb-2">Nenhum modelo encontrado</h3>
            <p className="text-slate-500">Tente buscar por outros termos ou categorias.</p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-10 h-10 text-blue-200" />
                <h2 className="text-4xl font-black tracking-tight">Segurança Jurídica</h2>
              </div>
              <p className="text-xl text-blue-100 font-light leading-relaxed">
                Todos os nossos modelos são revisados periodicamente para garantir conformidade com o Código Civil Brasileiro e as leis condominiais vigentes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <BookOpen className="w-6 h-6 mb-3 text-blue-200" />
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Atualizado</p>
                <p className="text-lg font-bold">2024.1</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <Gavel className="w-6 h-6 mb-3 text-blue-200" />
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Revisão</p>
                <p className="text-lg font-bold">Trimestral</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
