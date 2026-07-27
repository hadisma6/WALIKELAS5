import React, { useState, useRef } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Dashboard } from './components/Dashboard';
import { PelanggaranView, PrestasiView, AbsensiView, SiswaView, SettingsView } from './components/DataViews';
import { LaporanView } from './components/LaporanView';
import {
  LayoutDashboard,
  ShieldAlert,
  Trophy,
  ClipboardCheck,
  Users,
  GraduationCap,
  Database,
  UploadCloud,
  Printer,
  Settings,
  PieChart
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('ringkasan');
  const { exportJSON, importJSON } = useDatabase();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importJSON(file);
        alert('Data berhasil dipulihkan!');
      } catch (err) {
        alert('Gagal memulihkan data. Format tidak valid.');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header - Hidden in Print */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-40 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="font-black tracking-tight text-lg leading-tight">SIDA XI-5</h1>
              <p className="text-[10px] text-indigo-200 uppercase tracking-widest">SMAN 6 Garut • TA 2026/2027</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={exportJSON} className="bg-indigo-800 hover:bg-indigo-900 text-xs px-3 py-2 rounded-lg flex items-center gap-2 transition border border-indigo-600">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>
            <label className="bg-indigo-800 hover:bg-indigo-900 text-xs px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition border border-indigo-600">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Restore</span>
              <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
            </label>
            <button onClick={handlePrint} className="bg-yellow-400 hover:bg-yellow-500 text-indigo-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition shadow">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Laporan</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg transition border border-indigo-600 hover:bg-indigo-900 ${activeTab === 'settings' ? 'bg-indigo-900' : 'bg-indigo-800'}`}>
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full print:p-0 print:m-0">
        {/* Navigation Tabs - Hidden in Print */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-x-auto print:hidden">
          <nav className="flex space-x-1 p-2 min-w-max">
            <TabButton active={activeTab === 'ringkasan'} onClick={() => setActiveTab('ringkasan')} icon={<LayoutDashboard size={16} />} label="Ringkasan Kelas" />
            <TabButton active={activeTab === 'pelanggaran'} onClick={() => setActiveTab('pelanggaran')} icon={<ShieldAlert size={16} className={activeTab === 'pelanggaran' ? 'text-indigo-600' : 'text-rose-500'} />} label="Rekap Pelanggaran" />
            <TabButton active={activeTab === 'prestasi'} onClick={() => setActiveTab('prestasi')} icon={<Trophy size={16} className={activeTab === 'prestasi' ? 'text-indigo-600' : 'text-amber-500'} />} label="Rekap Prestasi" />
            <TabButton active={activeTab === 'laporan'} onClick={() => setActiveTab('laporan')} icon={<PieChart size={16} className={activeTab === 'laporan' ? 'text-indigo-600' : 'text-fuchsia-500'} />} label="Laporan Karakter" />
            <TabButton active={activeTab === 'absensi'} onClick={() => setActiveTab('absensi')} icon={<ClipboardCheck size={16} className={activeTab === 'absensi' ? 'text-indigo-600' : 'text-blue-500'} />} label="Rekap Absensi" />
            <TabButton active={activeTab === 'datasiswa'} onClick={() => setActiveTab('datasiswa')} icon={<Users size={16} />} label="Master Data Siswa" />
          </nav>
        </div>

        {/* Content Area */}
        <div className="print:block">
          <div className={activeTab === 'ringkasan' ? 'block' : 'hidden print:block'}>
            <Dashboard />
          </div>
          <div className={activeTab === 'pelanggaran' ? 'block' : 'hidden print:block'}>
            <PelanggaranView />
          </div>
          <div className={activeTab === 'prestasi' ? 'block' : 'hidden print:block'}>
            <PrestasiView />
          </div>
          <div className={activeTab === 'laporan' ? 'block' : 'hidden print:block'}>
            <LaporanView />
          </div>
          <div className={activeTab === 'absensi' ? 'block' : 'hidden print:block'}>
            <AbsensiView />
          </div>
          <div className={activeTab === 'datasiswa' ? 'block' : 'hidden print:block'}>
            <SiswaView />
          </div>
          <div className={activeTab === 'settings' ? 'block' : 'hidden print:hidden'}>
            <SettingsView />
          </div>
        </div>
      </main>

      <footer className="bg-white text-slate-500 text-center text-xs py-4 border-t print:hidden mt-auto">
        <p>© 2026 SIDA XI-5 • SMA Negeri 6 Garut</p>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${active
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-slate-600 hover:bg-slate-50'
        }`}
    >
      {icon} {label}
    </button>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}
