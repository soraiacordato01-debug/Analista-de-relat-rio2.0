/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Plus,
  LayoutDashboard,
  Settings,
  History,
  Send,
  BarChart3,
  Activity,
  Maximize2,
  Bell,
  Search,
  Trash2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  User,
  Upload,
  X,
  Target,
  Zap,
  Shield,
  Globe,
  Cpu,
  Layers,
  Users,
  Clock,
  Database,
  AlertCircle,
  Briefcase,
  Moon,
  Sun,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie
} from 'recharts';
import { generateReport, type ReportData } from './services/gemini';
import { cn } from './lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type ViewMode = 'dashboard' | 'history';

const OnetLogo = ({ className }: { className?: string; light?: boolean }) => (
  <div className={cn("flex items-center justify-center font-black tracking-tighter leading-none select-none", className)}>
    <div className="relative flex items-center justify-center">
      <span style={{ color: 'var(--theme-text)' }}>ONET</span>
    </div>
  </div>
);

const DynamicIcon = ({ name, size = 20, className }: { name?: string; size?: number; className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    'activity': Activity,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'target': Target,
    'zap': Zap,
    'shield': Shield,
    'globe': Globe,
    'cpu': Cpu,
    'layers': Layers,
    'users': Users,
    'clock': Clock,
    'database': Database,
    'alert-circle': AlertCircle,
    'check-circle': CheckCircle2,
    'briefcase': Briefcase,
    'bar-chart': BarChart3,
    'pie-chart': PieChart,
    'sparkles': Sparkles,
    'message-square': MessageSquare,
    'settings': Settings,
    'history': History,
    'upload': Upload,
    'user': User,
    'file-text': FileText
  };

  const IconComponent = name ? icons[name.toLowerCase()] : Activity;
  return IconComponent ? <IconComponent size={size} className={className} /> : <Activity size={size} className={className} />;
};

const OperationalPulse = () => {
  const [activity, setActivity] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Grid
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--theme-grid').trim() || 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw Wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.05 + offset) * 15 * Math.sin(offset * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Particles (Data Packets)
      for (let i = 0; i < 5; i++) {
        const pOffset = (offset * 50 + i * 40) % canvas.width;
        const pY = canvas.height / 2 + Math.sin(pOffset * 0.05 + offset) * 15 * Math.sin(offset * 0.5);
        
        ctx.fillStyle = '#6366f1';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#6366f1';
        ctx.beginPath();
        ctx.arc(pOffset, pY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      offset += 0.05;
      setActivity(Math.floor(40 + Math.random() * 20));
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="glass-card p-6 rounded-[2rem] mb-4 overflow-hidden relative group border border-white/5 hover:border-indigo-500/20 transition-all">
      <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-10 pointer-events-none" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping absolute inset-0" />
            <div className="w-2 h-2 rounded-full bg-indigo-500 relative" />
          </div>
          <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Fluxo_de_Dados</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-indigo-400/70 uppercase tracking-widest">Bitrate:</span>
          <span className="text-[10px] font-mono text-indigo-400 font-bold">{activity} MB/s</span>
        </div>
      </div>
      
      <div className="relative h-20 bg-black/40 rounded-2xl border border-white/5 overflow-hidden z-10">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={80} 
          className="w-full h-full opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
      </div>

      <div className="mt-4 flex justify-between items-center relative z-10">
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"
            />
          ))}
        </div>
        <span className="text-[7px] font-mono text-slate-600 uppercase tracking-[0.3em]">Protocol_v4.0_Active</span>
      </div>
    </div>
  );
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [history, setHistory] = useState<ReportData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings State
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('PT-BR');
  const [aiModel, setAiModel] = useState('GEMINI-3.1');
  const [processing, setProcessing] = useState('TURBO');

  const reportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const resetSystem = () => {
    if (confirm("Deseja realmente redefinir o sistema? Isso apagará o histórico de missões.")) {
      setHistory([]);
      setReport(null);
      setPrompt('');
      setFileName(null);
      setFileContent(null);
      setShowSettings(false);
      setViewMode('dashboard');
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileName(null);
    setFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !fileContent) return;

    setLoading(true);
    try {
      const fullPrompt = fileContent 
        ? `${prompt}\n\n[DADOS IMPORTADOS DO ARQUIVO ${fileName}]:\n${fileContent}`
        : prompt;
      const data = await generateReport(fullPrompt);
      setReport(data);
      setHistory(prev => [data, ...prev]);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Falha ao gerar o relatório. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!reportRef.current || !report) return;
    
    setExporting(true);
    try {
      // Wait for any images/charts to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${report.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Ocorreu um erro ao gerar o PDF. Verifique se o navegador permite downloads e tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen atmosphere flex flex-col lg:flex-row font-sans overflow-hidden relative transition-colors duration-500",
      !darkMode && "light"
    )} style={{ color: 'var(--theme-text)' }}>
      {/* Global Overlays */}
      <div className="absolute inset-0 noise z-0" />
      <div className="absolute inset-0 grid-bg z-0" />
      <div className="absolute inset-0 scanline z-0 opacity-20" />
      
      {/* Sidebar */}
      <aside className="w-full lg:w-72 border-b lg:border-r border-white/5 p-8 flex flex-col gap-10 no-print shrink-0 relative z-30 transition-colors duration-500" style={{ backgroundColor: 'var(--theme-sidebar)', borderColor: 'var(--theme-border)' }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 text-white mb-2">
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shadow-indigo-500/10 overflow-hidden border border-white/10 p-2 group transition-all hover:border-indigo-500/50 cursor-pointer">
              <BarChart3 className="text-indigo-400 group-hover:scale-110 transition-transform" size={28} />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight tracking-tighter glow-text uppercase" style={{ color: 'var(--theme-text)' }}>Analista de <span className="text-indigo-400">Relatório</span></h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Sistema Ativo</p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setViewMode('dashboard')}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-xs uppercase tracking-[0.2em] relative group overflow-hidden",
              viewMode === 'dashboard' ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
            )}
          >
            <LayoutDashboard size={18} className={cn("transition-colors", viewMode === 'dashboard' ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400")} />
            Dashboard
            {viewMode === 'dashboard' && <motion.div layoutId="active-pill" className="absolute right-0 w-1 h-6 bg-indigo-500 rounded-l-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
          </button>
          
          <button 
            onClick={() => {
              setReport(null);
              setViewMode('dashboard');
            }}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-xs uppercase tracking-[0.2em] text-slate-500 hover:bg-white/5 hover:text-slate-300 group border border-transparent hover:border-white/5"
          >
            <motion.div whileHover={{ rotate: 90 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Plus size={18} className="text-slate-600 group-hover:text-slate-400" />
            </motion.div>
            Nova Missão
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-xs uppercase tracking-[0.2em] text-slate-500 hover:bg-white/5 hover:text-slate-300 group border border-transparent hover:border-white/5"
          >
            <Upload size={18} className="text-slate-600 group-hover:text-slate-400" />
            Importar Dados
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt,.csv,.json,.md"
          />
          
          <button 
            onClick={() => setViewMode('history')}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-xs uppercase tracking-[0.2em] relative group overflow-hidden",
              viewMode === 'history' ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
            )}
          >
            <History size={18} className={cn("transition-colors", viewMode === 'history' ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400")} />
            Arquivos
            {viewMode === 'history' && <motion.div layoutId="active-pill" className="absolute right-0 w-1 h-6 bg-indigo-500 rounded-l-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
          </button>

          {report && (
            <button 
              onClick={exportPDF}
              disabled={exporting}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-xs uppercase tracking-[0.2em] text-emerald-500 hover:bg-emerald-500/10 group border border-transparent hover:border-emerald-500/20 mt-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />}
              Exportar PDF
            </button>
          )}
        </nav>

        <div className="mt-auto space-y-6">
          <OperationalPulse />
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Saúde do Sistema</span>
            </div>
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/3 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-indigo-500" /> Mem: 4.2GB</span>
                <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500" /> CPU: 12%</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group"
          >
            <Settings size={16} className="group-hover:rotate-90 transition-transform" />
            Config_Sistema
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl glass-card rounded-[3rem] overflow-hidden relative z-10 border border-white/10 shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10">
                    <Settings size={24} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tighter uppercase glow-text" style={{ color: 'var(--theme-text)' }}>Configurações do Sistema</h2>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em]">Protocolo_Ajuste_v4.2</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Interface</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-full flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Moon size={16} className={cn("transition-colors", darkMode ? "text-indigo-400" : "text-slate-500")} />
                          <span className="text-xs font-bold text-slate-300">Modo Escuro</span>
                        </div>
                        <div className={cn(
                          "w-10 h-5 rounded-full relative transition-colors",
                          darkMode ? "bg-indigo-500/20" : "bg-slate-800"
                        )}>
                          <motion.div 
                            animate={{ x: darkMode ? 20 : 4 }}
                            className={cn(
                              "absolute top-1 w-3 h-3 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]",
                              darkMode ? "bg-indigo-500" : "bg-slate-400"
                            )} 
                          />
                        </div>
                      </button>
                      <button 
                        onClick={() => setLanguage(prev => prev === 'PT-BR' ? 'EN-US' : 'PT-BR')}
                        className="w-full flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Languages size={16} className="text-slate-500 group-hover:text-indigo-400" />
                          <span className="text-xs font-bold text-slate-300">Idioma</span>
                        </div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{language}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Inteligência</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setAiModel(prev => prev === 'GEMINI-3.1' ? 'GEMINI-2.5' : 'GEMINI-3.1')}
                        className="w-full flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Cpu size={16} className="text-slate-500 group-hover:text-emerald-400" />
                          <span className="text-xs font-bold text-slate-300">Modelo IA</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{aiModel}</span>
                      </button>
                      <button 
                        onClick={() => setProcessing(prev => prev === 'TURBO' ? 'BALANCED' : 'TURBO')}
                        className="w-full flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Zap size={16} className="text-slate-500 group-hover:text-emerald-400" />
                          <span className="text-xs font-bold text-slate-300">Processamento</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{processing}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status da Chave API</h4>
                      <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Conectado_e_Seguro</p>
                    </div>
                    <button 
                      onClick={resetSystem}
                      className="px-6 py-2.5 glass rounded-xl text-[9px] font-black text-rose-500 uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500/10 transition-all"
                    >
                      Redefinir Sistema
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative z-10">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between sticky top-0 z-20 no-print transition-colors duration-500" style={{ backgroundColor: 'var(--theme-sidebar)', borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
            <div className="flex items-center gap-2 text-indigo-400">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              ONET_CORE
            </div>
            <span className="opacity-20">/</span>
            <span className="text-white glow-text">ESPAÇO_TÁTICO</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="BUSCAR_SISTEMA..." 
                className="bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-6 py-2.5 text-[9px] font-black tracking-[0.2em] w-80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700 text-white"
              />
            </div>
            <div className="flex items-center gap-4 pl-8 border-l border-white/10">
              <div className="text-right">
                <p className="text-[10px] font-black tracking-widest uppercase glow-text" style={{ color: 'var(--theme-text)' }}>Operador_01</p>
                <p className="text-[8px] text-indigo-400 font-bold tracking-[0.3em] uppercase">Acesso_Nível_4</p>
              </div>
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center font-black text-[10px] border border-white/10 shadow-lg group hover:border-indigo-500/50 transition-all cursor-pointer relative" style={{ color: 'var(--theme-text)' }}>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#020617] animate-pulse" />
                OP
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {viewMode === 'dashboard' && !report && !loading && (
              <motion.div 
                key="landing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-6xl mx-auto mt-6 space-y-12"
              >
                <div className="glass-card p-16 rounded-[3rem] text-center relative overflow-hidden group corner-accent">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-20 pointer-events-none" />
                  
                  <div className="w-40 h-40 glass rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-indigo-500/20 border border-white/10 relative z-10 group-hover:scale-105 transition-transform duration-700">
                    <OnetLogo className="text-5xl" />
                    <div className="absolute inset-0 rounded-[2.5rem] border border-indigo-500/20 animate-pulse" />
                  </div>
                  
                  <h2 className="text-3xl font-black mb-6 tracking-[0.3em] glow-text uppercase" style={{ color: 'var(--theme-text)' }}>Iniciar Análise</h2>
                  <p className="text-lg mb-12 max-w-xl mx-auto font-medium tracking-wide leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                    Implante protocolos de IA para transformar dados operacionais brutos em <span className="text-indigo-400">inteligência tática estratégica</span>.
                  </p>
                  
                  <form onSubmit={handleGenerate} className="max-w-2xl mx-auto relative z-10">
                    {fileName && (
                      <div className="mb-6 flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-2xl text-indigo-300 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-indigo-400" />
                          <span>ARQUIVO_ANEXADO: {fileName}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={clearFile}
                          className="hover:bg-rose-500/20 hover:text-rose-400 p-2 rounded-xl transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <div className="relative mb-8 group/input">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-[2rem] blur opacity-0 group-focus-within/input:opacity-100 transition duration-1000" />
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="PARÂMETROS_DA_MISSÃO..."
                        className="w-full h-48 p-8 bg-black/60 border border-white/10 rounded-[2rem] text-white focus:ring-0 focus:border-indigo-500/50 outline-none resize-none transition-all placeholder:text-slate-800 font-mono text-sm tracking-tight relative z-10"
                      />
                      <div className="absolute bottom-4 right-6 text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                        Protocol_v2.4_Secure
                      </div>
                    </div>
                    <button
                      disabled={loading || (!prompt.trim() && !fileContent)}
                      className="px-16 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-indigo-500 disabled:opacity-30 transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)] mx-auto group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                      {loading ? 'EXECUTANDO_PROTOCOLOS...' : 'IMPLANTAR_ANÁLISE'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {viewMode === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto mt-12 space-y-6"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase glow-text" style={{ color: 'var(--theme-text)' }}>Arquivos de Missão</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Histórico_de_Relatórios_Gerados</p>
                  </div>
                  <div className="px-4 py-2 glass rounded-xl border border-white/5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    {history.length} REGISTROS
                  </div>
                </div>

                {history.length === 0 ? (
                  <div className="glass-card p-20 rounded-[3rem] text-center border border-dashed border-white/10">
                    <History size={48} className="text-slate-700 mx-auto mb-6 opacity-20" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum registro encontrado no banco de dados.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {history.map((item, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          setReport(item);
                          setViewMode('dashboard');
                        }}
                        className="w-full glass-card p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between group text-left"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-indigo-400 border border-white/10 group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-widest group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--theme-text)' }}>{item.title}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">ID: ONET_REP_{Math.floor(Math.random() * 1000)} | DATA: 24_FEV_2026</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Eficiência</p>
                            <p className="text-[10px] font-black text-emerald-400 uppercase">94.2%</p>
                          </div>
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-500 group-hover:text-white transition-colors border border-white/5">
                            <ArrowLeft size={16} className="rotate-180" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {viewMode === 'dashboard' && report && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg/80 backdrop-blur-md gap-8"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600"
                  >
                    <Activity size={40} />
                  </motion.div>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-serif italic text-slate-900 mb-2">Construindo Inteligência</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">Cruzando dados operacionais e gerando visualizações estratégicas de alto nível...</p>
                </div>
              </motion.div>
            )}

            {report && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10 max-w-[1600px] mx-auto pb-20 relative z-10"
              >
                {/* Report Header Card */}
                <div className="glass-card p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 no-print corner-accent">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500" />
                  
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => setReport(null)}
                      className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 border border-white/10 shadow-lg group"
                    >
                      <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase glow-text mb-2" style={{ color: 'var(--theme-text)' }}>{report.title}</h2>
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        <span className="flex items-center gap-2 text-indigo-400"><History size={14} /> HORA_DA_MISSÃO: 10_FEV_2026</span>
                        <span className="opacity-20">|</span>
                        <span className="text-emerald-400 glow-emerald">STATUS: SUCESSO_OPERACIONAL</span>
                        <span className="opacity-20">|</span>
                        <span className="text-slate-400">ID: ONET_REP_092</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Findings Quick Look */}
                  <div className="hidden xl:flex items-center gap-12 px-12 border-x border-white/5">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Nível_de_Risco</p>
                      <p className="text-sm font-black text-emerald-400 uppercase glow-emerald">Baixo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Eficiência</p>
                      <p className="text-sm font-black text-indigo-400 uppercase glow-text">94.2%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Tendência</p>
                      <p className="text-sm font-black text-emerald-400 uppercase glow-emerald">+12.5%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 pr-8 border-r border-white/10 mr-4">
                      <BarChart3 className="text-indigo-400" size={24} />
                    </div>
                    <button
                      onClick={exportPDF}
                      disabled={exporting}
                      className="px-8 h-14 glass rounded-2xl flex items-center justify-center gap-4 text-slate-400 hover:text-indigo-400 transition-all disabled:opacity-30 border border-white/10 shadow-lg group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {exporting ? <Loader2 className="animate-spin" size={22} /> : <Download size={22} className="group-hover:translate-y-0.5 transition-transform relative z-10" />}
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">Exportar PDF</span>
                    </button>
                    <button className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-rose-500/50 hover:text-rose-500 transition-all border border-white/10 shadow-lg">
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-10">
                  {/* Left Column: Metrics & Content */}
                  <div className="col-span-12 lg:col-span-8 space-y-10">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {report.metrics.slice(0, 3).map((metric, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-card p-10 rounded-[2.5rem] group hover:border-indigo-500/30 transition-all duration-500 corner-accent relative overflow-hidden"
                        >
                          <div className={cn(
                            "absolute top-0 left-0 w-full h-1",
                            metric.trend === 'up' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : 
                            metric.trend === 'down' ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                          )} />
                          
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{metric.label}</p>
                              <p className="text-[9px] text-indigo-400 font-black tracking-widest">REF: {metric.date || 'FEV_26'}</p>
                            </div>
                            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-400/50 border border-white/5 group-hover:text-indigo-400 transition-colors">
                              <DynamicIcon name={metric.icon} size={20} />
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 mb-6">
                            <h4 className="text-3xl font-black tracking-tighter glow-text font-mono truncate" style={{ color: 'var(--theme-text)' }}>{metric.value}</h4>
                            <div className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border self-start",
                              metric.trend === 'up' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                              metric.trend === 'down' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            )}>
                              {metric.trend === 'up' ? <TrendingUp size={14} /> : metric.trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
                              {metric.trend || 'ESTÁVEL'}
                            </div>
                          </div>
                          {/* Visual Progress Bar */}
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '70%' }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className={cn(
                                "h-full rounded-full",
                                metric.trend === 'up' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
                                metric.trend === 'down' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                              )}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Insights Card */}
                    <div className="glass-card p-12 rounded-[3rem] group">
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full -mr-40 -mt-40 group-hover:bg-indigo-500/20 transition-colors duration-1000" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-12">
                          <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-lg">
                            <Sparkles size={24} />
                          </div>
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 mb-1 glow-text">Inteligência Tática</h3>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest">INSIGHTS_GERADOS_POR_IA_V2.4</p>
                          </div>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                          {report.aiInsights.map((insight, i) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex gap-6 group/item"
                            >
                              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  {i % 3 === 0 && <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[8px] font-black uppercase tracking-widest rounded-md border border-rose-500/20">Crítico</span>}
                                  {i % 3 === 1 && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-500/20">Eficiência</span>}
                                  {i % 3 === 2 && <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">Estratégico</span>}
                                </div>
                                <p className="text-slate-400 leading-relaxed text-sm font-medium group-hover/item:text-slate-200 transition-colors">{insight}</p>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Operational Synthesis */}
                    <div className="glass-card p-12 rounded-[3rem]">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-lg">
                          <Activity size={24} />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400 mb-1 glow-emerald">Síntese da Missão</h3>
                          <p className="text-[10px] text-slate-500 font-bold tracking-widest">PROTOCOLO_RESUMO_EXECUTIVO</p>
                        </div>
                      </div>
                      <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-lg font-medium italic mb-12">
                        {report.summary}
                      </div>

                      {/* Sections Bento Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {report.sections.map((section, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                              "glass p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/20 transition-all group relative overflow-hidden",
                              i === 0 ? "md:col-span-2" : ""
                            )}
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors" />
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                              <DynamicIcon name={section.icon} size={60} />
                            </div>
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 relative z-10">
                              <div className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-white/5">
                                <DynamicIcon name={section.icon} size={14} />
                              </div>
                              {section.title}
                            </h4>
                            <div className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors relative z-10">
                              <Markdown>{section.content}</Markdown>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="glass p-12 rounded-[3rem] border border-white/10">
                        <div className="flex items-center justify-between mb-10">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Matriz_de_Execução</p>
                          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        </div>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={report.chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                              <XAxis hide />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }} />
                              <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', padding: '12px 20px' }}
                                itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                              />
                              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                {report.chartData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="glass-card p-12 rounded-[3rem]">
                        <div className="flex items-center justify-between mb-10">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocolo_Mix_Origem</p>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={report.chartData}
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={10}
                                dataKey="value"
                                stroke="none"
                              >
                                {report.chartData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#020617', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tactical System Console */}
                    <div className="glass-card p-8 rounded-[2.5rem] font-mono text-[10px] space-y-2 text-slate-500 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Activity size={40} />
                      </div>
                      <div className="flex items-center gap-4 mb-4 text-indigo-400 font-black tracking-widest uppercase">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Console_de_Sistema_v4.0.2
                      </div>
                      <div className="space-y-1 opacity-60">
                        <p className="text-emerald-500/80">[OK] Protocolos de segurança inicializados...</p>
                        <p>[INFO] Carregando módulos de análise tática...</p>
                        <p>[INFO] Conexão com núcleo ONET estabelecida.</p>
                        <p className="text-indigo-400">[DATA] Sincronizando metadados da missão...</p>
                        <p>[INFO] Relatório gerado com 98.4% de confiança.</p>
                        <p className="text-emerald-500/80">[SUCCESS] Sistema pronto para exportação.</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-slate-700">
                        <span className="animate-pulse">_</span>
                        <span>AGUARDANDO_COMANDO...</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Recommendations & Chat */}
                  <div className="col-span-12 lg:col-span-4 space-y-10 no-print">
                    {/* Chat Widget */}
                    <div className="glass-card rounded-[3rem] overflow-hidden flex flex-col h-[600px] relative group">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-lg">
                            <MessageSquare size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white tracking-widest uppercase glow-text">Consultor_Tático</p>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Conectado</p>
                            </div>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"><Maximize2 size={18} /></button>
                      </div>
                      <div className="flex-1 p-10 flex flex-col items-center justify-center text-center relative z-10">
                        <div className="w-20 h-20 glass rounded-[2rem] flex items-center justify-center text-indigo-400 mb-8 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                          <Sparkles size={32} />
                        </div>
                        <p className="text-[10px] text-slate-400 max-w-[240px] leading-relaxed font-black uppercase tracking-[0.2em]">
                          Consulte o sistema para picos de volume, análise de gargalos ou métricas de desempenho localizadas.
                        </p>
                      </div>
                      <div className="p-8 bg-black/40 border-t border-white/5 relative z-10">
                        <div className="relative group/input">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-1000" />
                          <input 
                            type="text" 
                            placeholder="ENTRADA_DE_CONSULTA..." 
                            className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black tracking-[0.2em] focus:ring-0 focus:border-indigo-500/50 outline-none pr-14 text-white placeholder:text-slate-800 relative z-10"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/40 z-20 group/btn">
                            <Send size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations Card */}
                    <div className="glass-card p-12 rounded-[3rem] relative overflow-hidden group corner-accent">
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-lg">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400 mb-1 glow-emerald">Protocolos de Ação</h3>
                          <p className="text-[10px] text-slate-500 font-bold tracking-widest">RECOMENDAÇÕES_ESTRATÉGICAS</p>
                        </div>
                      </div>
                      <div className="space-y-12">
                        {report.recommendations.map((rec, i) => (
                          <div key={i} className="flex gap-8 group/rec">
                            <span className="text-4xl font-black text-white/5 group-hover/rec:text-indigo-500/20 transition-colors leading-none font-mono">{String(i + 1).padStart(2, '0')}</span>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden Document for PDF Export */}
                <div className="fixed left-[-9999px] top-0 opacity-0 pointer-events-none">
                  <div ref={reportRef} className="report-page">
                    <header className="border-b-4 border-slate-900 pb-10 mb-12 flex justify-between items-end">
                      <div>
                        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">{report.title}</h1>
                        <p className="text-xl text-slate-500 font-serif italic">{report.subtitle}</p>
                      </div>
                      <div className="text-right font-mono text-xs uppercase tracking-widest text-slate-400">
                        <p>Emitido em: {new Date().toLocaleDateString()}</p>
                        <p>Analista: Onet Brasil</p>
                      </div>
                    </header>
                    <section className="mb-12">
                      <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Síntese Operacional</h2>
                      <p className="text-lg leading-relaxed text-slate-700 font-serif italic">{report.summary}</p>
                    </section>
                    <div className="grid grid-cols-3 gap-8 mb-12">
                      {report.metrics.map((m, i) => (
                        <div key={i} className="border-t-2 border-slate-100 pt-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{m.label}</p>
                          <p className="text-3xl font-bold text-slate-900">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    {report.sections.map((s, i) => (
                      <section key={i} className="mb-12">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{s.title}</h3>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                          <Markdown>{s.content}</Markdown>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
