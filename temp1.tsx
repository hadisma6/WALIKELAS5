import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Trash2, Plus, Upload, Trash, Save, RefreshCw, Edit2, X, Check, FileText, Download, Info } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

export function SettingsView() {
  const { apiUrl, setApiUrl, syncData, isLoadingCloud } = useDatabase();
  const [localUrl, setLocalUrl] = useState(apiUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiUrl(localUrl);
    Swal.fire({title: 'Sukses!', text: 'URL berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000});
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mt-8 max-w-2xl mx-auto">
      <div className="mb-6 border-b pb-4">
        <h3 className="font-bold text-slate-800 text-lg">Pengaturan Database (Cloud Sync)</h3>
        <p className="text-xs text-slate-500 mt-1">Simpan data aplikasi terpusat ke Google Sheets melalui Google Apps Script.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
  
      <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Google Apps Script Web App URL</label>
          <input 
            type="url" 
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full border p-3 rounded-lg text-sm bg-slate-50 focus:bg-white transition"
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition"
          >
            <Save className="w-4 h-4" /> Simpan URL
          </button>
          
          <button 
            type="button"
            onClick={syncData}
            disabled={isLoadingCloud || !apiUrl}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingCloud ? 'animate-spin' : ''}`} /> 
            {isLoadingCloud ? 'Menyinkronkan...' : 'Sinkronkan Data Sekarang'}
          </button>
        </div>
      </form>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 text-sm mb-2">Instruksi Penggunaan Google Sheets:</h4>
        <ol className="list-decimal pl-5 text-xs text-blue-800 space-y-1">
          <li>Buka file <code>code.gs</code> yang telah dibuat di repository/workspace Anda.</li>
          <li>Buat file Spreadsheet baru di Google Drive, masuk ke menu <strong>Extensions &gt; Apps Script</strong>.</li>
          <li>Paste isi <code>code.gs</code> ke dalam editor script.</li>
          <li>Klik <strong>Deploy &gt; New Deployment</strong>.</li>
          <li>Pilih type <strong>Web App</strong>. Set "Execute as: Me" dan "Who has access: Anyone".</li>
          <li>Copy <strong>Web App URL</strong> yang dihasilkan dan paste ke input form di atas.</li>
        </ol>
      </div>
    </div>
  );
}

// ... other components will be appended in next steps ...
export function PelanggaranView() {
  const { pelanggaran, deletePelanggaran, updatePelanggaran, siswa, addPelanggaran } = useDatabase();
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ tgl: '', nama: '', jenis: '', poin: 5, keterangan: '' });

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setEditForm({ tgl: p.tgl, nama: p.nama, jenis: p.jenis, poin: p.poin, keterangan: p.keterangan || '' });
  };

  const saveEdit = () => {
    if (editingId !== null) {
      updatePelanggaran(editingId, { ...editForm });
      setEditingId(null);
    }
  };

  const [filterNama, setFilterNama] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const filteredData = pelanggaran.filter(p => {
    if (filterNama && p.nama !== filterNama) return false;
    if (filterStartDate && p.tgl < filterStartDate) return false;
    if (filterEndDate && p.tgl > filterEndDate) return false;
    return true;
  }).sort((a, b) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime());

  const handleExportPDF = () => {
    const columns = ['Tanggal', 'Nama Siswa', 'Pelanggaran', 'Poin', 'Keterangan'];
    const data = filteredData.map(p => [p.tgl, p.nama, p.jenis, p.poin, p.keterangan || '-']);
    exportToPDF('Laporan Pelanggaran', columns, data, 'Pelanggaran');
  };

  const handleExportExcel = () => {
    const data = filteredData.map(p => ({
      Tanggal: p.tgl, 'Nama Siswa': p.nama, Pelanggaran: p.jenis, Poin: p.poin, Keterangan: p.keterangan || '-'
    }));
    exportToExcel(data, 'Pelanggaran');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 print:shadow-none print:border-none print:p-0 mt-8 print:mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Catatan Pelanggaran Siswa</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition print:hidden"
        >
          <Plus className="w-4 h-4" /> Tambah Data
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 items-end print:hidden bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Siswa</label>
          <select value={filterNama} onChange={e => setFilterNama(e.target.value)} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
            <option value="">Semua Siswa</option>
            {siswa.map(s => <option key={s.nama} value={s.nama}>{s.nama}</option>)}
          </select>
        </div>
        <div className="w-32">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dari Tanggal</label>
          <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
        </div>
        <div className="w-32">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sampai Tanggal</label>
          <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportPDF} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={handleExportExcel} className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 print:hidden">
          <div className="mb-4">
            <button type="button" onClick={() => setShowGuide(!showGuide)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              <Info className="w-4 h-4" /> {showGuide ? 'Sembunyikan Panduan Poin' : 'Lihat Panduan Poin Pelanggaran'}
            </button>
            {showGuide && (
              <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-slate-700">
          
      <div><span className="font-bold text-rose-600">-5</span> : Terlambat, buang sampah, pakaian tdk rapi</div>
          
      <div><span className="font-bold text-rose-600">-8</span> : Buka medsos tanpa izin, tdk piket</div>
          
      <div><span className="font-bold text-rose-600">-10</span> : Alpa/Pulang awal, main game, tdk kerjakan tugas</div>
          
      <div><span className="font-bold text-rose-600">-15</span> : Foto/video tdk izin, rusak kelas, ejek teman</div>
          
      <div><span className="font-bold text-rose-600">-20</span> : Coret meja/dinding, menyontek, info palsu</div>
          
      <div><span className="font-bold text-rose-600">-25</span> : Kirim konten tdk pantas</div>
          
      <div><span className="font-bold text-rose-600">-30</span> : Perundungan (bullying)</div>
          
      <div><span className="font-bold text-rose-600">-40</span> : Berkelahi</div>
          
      <div><span className="font-bold text-rose-600">-3</span> : Rambut/sepatu/makeup tdk sesuai aturan</div>
              </div>
            )}
          </div>
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            addPelanggaran({
              nama: fd.get('nama') as string,
              tgl: fd.get('tgl') as string,
              jenis: fd.get('jenis') as string,
              poin: parseInt(fd.get('poin') as string) || 5,
              keterangan: fd.get('keterangan') as string,
            });
            setShowForm(false);
            Swal.fire({title: 'Tersimpan!', text: 'Data pelanggaran berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false});
          }}
