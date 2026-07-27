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
    Swal.fire({ title: 'Sukses!', text: 'URL berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000 });
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

export const PELANGGARAN_PRESETS = {
  "KEHADIRAN": [
    { label: 'Terlambat tanpa alasan', poin: 5 },
    { label: 'Tidak hadir tanpa keterangan', poin: 10 },
    { label: 'Pulang sebelum waktunya tanpa izin', poin: 10 }
  ],
  "GADGET / HP": [
    { label: 'Bermain game saat pelajaran', poin: 10 },
    { label: 'Buka medsos tanpa izin', poin: 8 },
    { label: 'Ambil foto/video tanpa izin', poin: 15 },
    { label: 'Gunakan AI utk salin tugas tanpa paham', poin: 10 }
  ],
  "LINGKUNGAN & KERAPIHAN": [
    { label: 'Buang sampah sembarangan', poin: 5 },
    { label: 'Merusak fasilitas', poin: 15 },
    { label: 'Mencoret meja/dinding', poin: 20 },
    { label: 'Pakaian tidak rapi/sesuai aturan', poin: 5 },
    { label: 'Rambut tidak rapi/melebihi aturan', poin: 3 },
    { label: 'Sepatu kotor/tidak sesuai aturan', poin: 3 },
    { label: 'Makeup berlebihan (Perempuan)', poin: 3 }
  ],
  "PEMBELAJARAN & TANGGUNG JAWAB": [
    { label: 'Tidak mengerjakan tugas', poin: 10 },
    { label: 'Menyontek', poin: 20 },
    { label: 'Mengganggu proses belajar', poin: 10 },
    { label: 'Tidak menjalankan tugas piket', poin: 8 },
    { label: 'Tidak mengumpulkan tugas', poin: 10 },
    { label: 'Tidak menepati janji/komitmen', poin: 15 },
    { label: 'Mengabaikan tugas yg diberikan', poin: 15 },
    { label: 'Tidak menyelesaikan tugas proyek', poin: 15 }
  ],
  "SIKAP, KARAKTER & KOMUNIKASI": [
    { label: 'Berkata kasar', poin: 10 },
    { label: 'Mengejek teman', poin: 15 },
    { label: 'Menyebarkan informasi palsu', poin: 20 },
    { label: 'Spam di grup kelas', poin: 10 },
    { label: 'Mengirim konten tidak pantas', poin: 25 },
    { label: 'Melanggar privasi orang lain', poin: 20 },
    { label: 'Perundungan (Bullying)', poin: 30 },
    { label: 'Berkelahi', poin: 40 }
  ],
  "LAINNYA": [
    { label: 'Lainnya (Input Manual)', poin: 0 }
  ]
};

export const PRESTASI_PRESETS = {
  "SIKAP & PEMBELAJARAN (DAILY)": [
    { label: 'Hadir tepat waktu', poin: 2 },
    { label: 'Gunakan HP utk pembelajaran / referensi', poin: 3 },
    { label: 'Membawa perlengkapan lengkap', poin: 2 },
    { label: 'Aktif bertanya / Menjawab guru', poin: 5 },
    { label: 'Merapikan meja / buang sampah pd tempatnya', poin: 3 },
    { label: 'Mengucapkan salam / bersikap sopan', poin: 3 },
    { label: 'Sampaikan info penting dgn sopan', poin: 3 }
  ],
  "TINDAKAN TERPUJI & TANGGUNG JAWAB": [
    { label: 'Membersihkan kelas tanpa diminta', poin: 5 },
    { label: 'Membantu teman memahami materi', poin: 5 },
    { label: 'Membantu / Menjaga / Menghargai teman', poin: 5 },
    { label: 'Menjalankan piket dengan baik', poin: 5 },
    { label: 'Kumpulkan tugas tepat waktu', poin: 5 },
    { label: 'Presentasi dengan baik', poin: 10 },
    { label: 'Hadir lengkap 1 minggu', poin: 10 },
    { label: 'Menjadi pengurus kelas/organisasi', poin: 5 }
  ],
  "JUARA & PRESTASI BERSKALA": [
    { label: 'Juara tingkat sekolah', poin: 20 },
    { label: 'Juara tingkat kabupaten', poin: 30 },
    { label: 'Juara tingkat provinsi', poin: 40 },
    { label: 'Juara tingkat nasional', poin: 50 },
    { label: 'Juara tingkat internasional', poin: 70 },
    { label: 'Ikut kegiatan sekolah aktif', poin: 10 }
  ],
  "BONUS KHUSUS TERPILIH": [
    { label: '1 bulan tanpa terlambat / pelanggaran', poin: 25 },
    { label: 'Kehadiran 100% 1 bulan', poin: 30 },
    { label: 'Menjadi teladan kelas', poin: 25 },
    { label: 'Membantu guru/teman konsisten', poin: 15 },
    { label: 'Menjadi inspirasi bagi teman', poin: 20 }
  ],
  "LAINNYA": [
    { label: 'Lainnya (Input Manual Kebiasaan Baik)', poin: 0 }
  ]
};

export function PelanggaranView() {
  const { pelanggaran, deletePelanggaran, updatePelanggaran, siswa, addPelanggaran } = useDatabase();
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ tgl: '', nama: '', jenis: '', poin: 5, keterangan: '' });

  const [addPreset, setAddPreset] = useState(PELANGGARAN_PRESETS["KEHADIRAN"][0].label);
  const [addManualJenis, setAddManualJenis] = useState('');
  const [addPoin, setAddPoin] = useState(PELANGGARAN_PRESETS["KEHADIRAN"][0].poin);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAddPreset(val);

    let foundPreset = null;
    for (const group of Object.keys(PELANGGARAN_PRESETS)) {
      const preset = PELANGGARAN_PRESETS[group as keyof typeof PELANGGARAN_PRESETS].find(p => p.label === val);
      if (preset) foundPreset = preset;
    }

    if (foundPreset && val !== 'Lainnya (Input Manual)') {
      setAddPoin(foundPreset.poin);
    }
  };

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
            {siswa.map(s => <option key={s.nis} value={s.nama}>{s.nama}</option>)}
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
                {Object.entries(PELANGGARAN_PRESETS).map(([group, items]) => (
                  <div key={group}>
                    <div className="font-bold text-rose-600 mb-1">{group}</div>
                    {items.map((item, i) => (
                      <div key={i}>-{item.poin} : {item.label}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            let finalJenis = addPreset;
            if (addPreset === 'Lainnya (Input Manual)') {
              finalJenis = addManualJenis || 'Pelanggaran Lainnya';
            }

            addPelanggaran({
              nama: fd.get('nama') as string,
              tgl: fd.get('tgl') as string,
              jenis: finalJenis,
              poin: parseInt(fd.get('poin') as string) || addPoin,
              keterangan: fd.get('keterangan') as string,
            });
            setShowForm(false);
            setAddManualJenis('');
            setAddPreset(PELANGGARAN_PRESETS["KEHADIRAN"][0].label);
            setAddPoin(PELANGGARAN_PRESETS["KEHADIRAN"][0].poin);
            Swal.fire({ title: 'Tersimpan!', text: 'Data pelanggaran berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false });
          }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Siswa</label>
                <select name="nama" required className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
                  <option value="">Pilih Siswa...</option>
                  {siswa.map(s => <option key={s.nis} value={s.nama}>{s.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                <input type="date" name="tgl" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Pelanggaran</label>
                <select
                  value={addPreset}
                  onChange={handlePresetChange}
                  className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border mb-2 font-medium"
                >
                  {Object.entries(PELANGGARAN_PRESETS).map(([group, opts]) => (
                    <optgroup key={group} label={group} className="font-bold text-rose-600 bg-rose-50">
                      {opts.map((p, i) => (
                        <option key={i} value={p.label} className="font-normal text-slate-700 bg-white">
                          {p.label} {p.poin > 0 ? `(-${p.poin} Poin)` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {addPreset === 'Lainnya (Input Manual)' && (
                  <input
                    type="text"
                    value={addManualJenis}
                    onChange={e => setAddManualJenis(e.target.value)}
                    required
                    placeholder="Tuliskan pelanggaran secara manual..."
                    className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Poin Pelanggaran (Angka)</label>
                <input type="number" name="poin" required value={addPoin} onChange={e => setAddPoin(parseInt(e.target.value) || 0)} min={1} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Catatan Tambahan (Opsional)</label>
                <input type="text" name="keterangan" placeholder="Keterangan..." className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Batal</button>
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700">Simpan Pelanggaran</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-100 text-slate-700 text-xs font-bold border-b">
            <tr>
              <th className="p-3 w-10 text-center">No</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Nama Siswa</th>
              <th className="p-3">Pelanggaran</th>
              <th className="p-3 text-center">Poin</th>
              <th className="p-3">Keterangan</th>
              <th className="p-3 text-right print:hidden">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 print:divide-slate-300 text-xs">
            {filteredData.map((p, i) => {
              if (editingId === p.id) {
                return (
                  <tr key={`${p.id}-${i}`} className="bg-indigo-50/50">
                    <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                    <td className="p-3">
                      <input type="date" value={editForm.tgl} onChange={e => setEditForm({ ...editForm, tgl: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.nama} onChange={e => setEditForm({ ...editForm, nama: e.target.value })} className="w-full border p-1.5 rounded text-xs bg-white">
                        <option value="">Pilih...</option>
                        {siswa.map(s => <option key={s.nis} value={s.nama}>{s.nama}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.jenis} onChange={e => setEditForm({ ...editForm, jenis: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="number" value={editForm.poin} onChange={e => setEditForm({ ...editForm, poin: parseInt(e.target.value) || 0 })} className="w-16 border p-1.5 rounded text-xs text-center mx-auto" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.keterangan} onChange={e => setEditForm({ ...editForm, keterangan: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-100 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-700 p-1 bg-slate-200 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              }
              return (
                <tr key={`${p.id}-${i}`} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                  <td className="p-3 whitespace-nowrap text-slate-500">{new Date(p.tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="p-3 font-bold text-slate-800">{p.nama}</td>
                  <td className="p-3 font-medium text-rose-700">{p.jenis}</td>
                  <td className="p-3 text-center">
                    <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-md font-bold text-[10px]">-{p.poin}</span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-[200px] truncate" title={p.keterangan}>{p.keterangan || '-'}</td>
                  <td className="p-3 text-right print:hidden">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(p)} className="text-indigo-500 hover:text-indigo-700 p-1 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deletePelanggaran(p.id)} className="text-rose-500 hover:text-rose-700 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredData.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">Belum ada data pelanggaran / tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PrestasiView() {
  const { prestasi, deletePrestasi, updatePrestasi, siswa, addPrestasi } = useDatabase();
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ tgl: '', nama: '', tingkat: 'Sekolah', namaKegiatan: '', hasil: '', poin: 10 });

  const [addPreset, setAddPreset] = useState(PRESTASI_PRESETS["SIKAP & PEMBELAJARAN (DAILY)"][0].label);
  const [addManualJenis, setAddManualJenis] = useState('');
  const [addPoin, setAddPoin] = useState(PRESTASI_PRESETS["SIKAP & PEMBELAJARAN (DAILY)"][0].poin);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAddPreset(val);

    let foundPreset = null;
    for (const group of Object.keys(PRESTASI_PRESETS)) {
      const preset = PRESTASI_PRESETS[group as keyof typeof PRESTASI_PRESETS].find(p => p.label === val);
      if (preset) foundPreset = preset;
    }

    if (foundPreset && val !== 'Lainnya (Input Manual Kebiasaan Baik)') {
      setAddPoin(foundPreset.poin);
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setEditForm({ tgl: p.tgl, nama: p.nama, tingkat: p.tingkat, namaKegiatan: p.namaKegiatan, hasil: p.hasil, poin: p.poin || 10 });
  };

  const saveEdit = () => {
    if (editingId !== null) {
      updatePrestasi(editingId, { ...editForm });
      setEditingId(null);
    }
  };

  const [filterNama, setFilterNama] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const filteredData = prestasi.filter(p => {
    if (filterNama && p.nama !== filterNama) return false;
    if (filterStartDate && p.tgl < filterStartDate) return false;
    if (filterEndDate && p.tgl > filterEndDate) return false;
    return true;
  }).sort((a, b) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime());

  const handleExportPDF = () => {
    const columns = ['Tanggal', 'Nama Siswa', 'Kegiatan', 'Tingkat', 'Poin', 'Hasil'];
    const data = filteredData.map(p => [p.tgl, p.nama, p.namaKegiatan, p.tingkat, p.poin || 10, p.hasil]);
    exportToPDF('Laporan Prestasi', columns, data, 'Prestasi');
  };

  const handleExportExcel = () => {
    const data = filteredData.map(p => ({
      Tanggal: p.tgl, 'Nama Siswa': p.nama, Kegiatan: p.namaKegiatan, Tingkat: p.tingkat, Poin: p.poin || 10, Hasil: p.hasil
    }));
    exportToExcel(data, 'Prestasi');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 print:shadow-none print:border-none print:p-0 mt-8 print:mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Catatan Prestasi Siswa</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition print:hidden"
        >
          <Plus className="w-4 h-4" /> Tambah Data
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 items-end print:hidden bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Siswa</label>
          <select value={filterNama} onChange={e => setFilterNama(e.target.value)} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
            <option value="">Semua Siswa</option>
            {siswa.map(s => <option key={s.nis} value={s.nama}>{s.nama}</option>)}
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
              <Info className="w-4 h-4" /> {showGuide ? 'Sembunyikan Panduan Poin' : 'Lihat Panduan Poin Prestasi'}
            </button>
            {showGuide && (
              <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-slate-700">
                <div><span className="font-bold text-emerald-600">+100</span> : Juara 1 Internasional</div>
                <div><span className="font-bold text-emerald-600">+75</span> : Juara 1 Nasional</div>
                <div><span className="font-bold text-emerald-600">+50</span> : Juara 1 Provinsi</div>
                <div><span className="font-bold text-emerald-600">+30</span> : Juara 1 Kabupaten</div>
                <div><span className="font-bold text-emerald-600">+20</span> : Juara 1 Sekolah</div>
                <div><span className="font-bold text-emerald-600">+10</span> : Pengurus Kelas / Ekskul</div>
                <div><span className="font-bold text-emerald-600">+15</span> : Keaktifan sangat baik</div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            let finalKegiatan = addPreset;
            if (addPreset === 'Lainnya (Input Manual Kebiasaan Baik)') {
              finalKegiatan = addManualJenis || 'Prestasi/Kebiasaan Tambahan';
            }

            addPrestasi({
              nama: fd.get('nama') as string,
              tgl: fd.get('tgl') as string,
              tingkat: fd.get('tingkat') as string,
              namaKegiatan: finalKegiatan,
              hasil: fd.get('hasil') as string,
              poin: parseInt(fd.get('poin') as string) || addPoin,
            });
            setShowForm(false);
            setAddPreset(PRESTASI_PRESETS["SIKAP & PEMBELAJARAN (DAILY)"][0].label);
            setAddManualJenis('');
            Swal.fire({ title: 'Tersimpan!', text: 'Data prestasi & kebiasaan baik berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false });
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Siswa</label>
                <select name="nama" required className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
                  <option value="">Pilih Siswa...</option>
                  {siswa.map(s => <option key={s.nis} value={s.nama}>{s.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                <input type="date" name="tgl" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Kegiatan / Prestasi / Kebiasaan Baik</label>
                <select
                  value={addPreset}
                  onChange={handlePresetChange}
                  className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border mb-2 font-medium"
                >
                  {Object.entries(PRESTASI_PRESETS).map(([group, opts]) => (
                    <optgroup key={group} label={group} className="font-bold text-emerald-600 bg-emerald-50">
                      {opts.map((p, i) => (
                        <option key={i} value={p.label} className="font-normal text-slate-700 bg-white">
                          {p.label} {p.poin > 0 ? `(+${p.poin} Poin)` : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {addPreset === 'Lainnya (Input Manual Kebiasaan Baik)' && (
                  <input
                    type="text"
                    value={addManualJenis}
                    onChange={e => setAddManualJenis(e.target.value)}
                    required
                    placeholder="Tuliskan kegiatan/prestasi manual secara spesifik..."
                    className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkatan (Opsional)</label>
                <select name="tingkat" className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
                  <option value="Harian / Kelas">Harian / Kelas</option>
                  <option value="Sekolah">Sekolah</option>
                  <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Poin Tambahan (Angka)</label>
                <input type="number" name="poin" required value={addPoin} onChange={e => setAddPoin(parseInt(e.target.value) || 0)} min={1} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hasil / Juara (Opsional)</label>
                <input type="text" name="hasil" placeholder="Juara 1..." className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Batal</button>
              <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700">Simpan Prestasi</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-100 text-slate-700 text-xs font-bold border-b">
            <tr>
              <th className="p-3 w-10 text-center">No</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Nama Siswa</th>
              <th className="p-3">Kegiatan</th>
              <th className="p-3">Tingkat & Poin</th>
              <th className="p-3">Hasil</th>
              <th className="p-3 text-right print:hidden">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 print:divide-slate-300 text-xs">
            {filteredData.map((p, i) => {
              if (editingId === p.id) {
                return (
                  <tr key={`${p.id}-${i}`} className="bg-indigo-50/50">
                    <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                    <td className="p-3">
                      <input type="date" value={editForm.tgl} onChange={e => setEditForm({ ...editForm, tgl: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.nama} onChange={e => setEditForm({ ...editForm, nama: e.target.value })} className="w-full border p-1.5 rounded text-xs bg-white">
                        <option value="">Pilih...</option>
                        {siswa.map(s => <option key={s.nis} value={s.nama}>{s.nama}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.namaKegiatan} onChange={e => setEditForm({ ...editForm, namaKegiatan: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.tingkat} onChange={e => setEditForm({ ...editForm, tingkat: e.target.value })} className="w-full border p-1.5 rounded text-xs mb-1 bg-white">
                        <option value="Sekolah">Sekolah</option>
                        <option value="Kabupaten/Kota">Kab/Kota</option>
                        <option value="Provinsi">Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Intl</option>
                      </select>
                      <input type="number" value={editForm.poin} onChange={e => setEditForm({ ...editForm, poin: parseInt(e.target.value) || 0 })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.hasil} onChange={e => setEditForm({ ...editForm, hasil: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-100 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-700 p-1 bg-slate-200 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              }
              return (
                <tr key={`${p.id}-${i}`} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                  <td className="p-3 whitespace-nowrap text-slate-500">{new Date(p.tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="p-3 font-bold text-slate-800">{p.nama}</td>
                  <td className="p-3 font-medium text-slate-800">{p.namaKegiatan}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{p.tingkat}</span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">+{p.poin || 10}</span>
                  </td>
                  <td className="p-3 font-bold text-indigo-700">{p.hasil || '-'}</td>
                  <td className="p-3 text-right print:hidden">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(p)} className="text-indigo-500 hover:text-indigo-700 p-1 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deletePrestasi(p.id)} className="text-rose-500 hover:text-rose-700 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredData.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">Belum ada data prestasi / tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SiswaView() {
  const { siswa, deleteSiswa, updateSiswa, pelanggaran, prestasi, clearSiswa, addMultipleSiswa, addSiswa } = useDatabase();
  const [showAddForm, setShowAddForm] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [editingNo, setEditingNo] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nama: '', jk: 'L', nis: '', noWA: '' });

  const handleEdit = (s: any, idx: number) => {
    setEditingNo(idx);
    setEditForm({ nama: s.nama, jk: s.jk || 'L', nis: s.nis, noWA: s.noWA || '' });
  };

  const saveEdit = (oldNis: string) => {
    if (editingNo !== null) {
      updateSiswa(oldNis, { ...editForm, jk: editForm.jk as 'L' | 'P' });
      setEditingNo(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        const rows = text.split('\n');
        const newSiswa: Array<{ nis: string, nama: string, jk: 'L' | 'P', noWA: string }> = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].trim();
          if (row) {
            const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            if (cols.length >= 2) {
              const nis = cols[0];
              const nama = cols[1];
              const jk = (cols[2] && cols[2].toUpperCase() === 'P') ? 'P' : 'L';
              const noWA = cols[3] || '';

              if (nis && nama && !siswa.find(s => s.nis === nis) && !newSiswa.find(s => s.nis === nis)) {
                newSiswa.push({ nis, nama, jk, noWA });
              }
            }
          }
        }

        if (newSiswa.length > 0) {
          addMultipleSiswa(newSiswa);
          Swal.fire({ title: 'Berhasil!', text: `${newSiswa.length} data siswa berhasil ditambahkan.`, icon: 'success', confirmButtonColor: '#4f46e5' });
        } else {
          Swal.fire({ title: 'Gagal!', text: 'Format CSV tidak valid atau data kosong. Gunakan format: No_Induk, Nama_Siswa, L/P, No_WA', icon: 'error', confirmButtonColor: '#4f46e5' });
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 print:shadow-none print:border-none print:p-0 mt-8 print:mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Master Data Siswa</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{siswa.length} Terdaftar</span>
        </div>
        <div className="flex gap-2 print:hidden">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition border border-blue-200"
          >
            <Plus className="w-4 h-4" /> Tambah Siswa
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition border border-emerald-200"
            title="Upload CSV (No Induk, Nama, L/P, No WA)"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          {siswa.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Yakin ingin menghapus semua data siswa?')) {
                  clearSiswa();
                }
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition border border-rose-200"
            >
              <Trash className="w-4 h-4" /> Kosongkan
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          addSiswa({
            nis: fd.get('nis') as string,
            nama: fd.get('nama') as string,
            jk: fd.get('jk') as 'L' | 'P',
            noWA: fd.get('noWA') as string,
          });
          setShowAddForm(false);
          Swal.fire({ title: 'Tersimpan!', text: 'Data siswa berhasil ditambahkan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false });
        }} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 print:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">No Induk (NIS)</label>
            <input type="text" name="nis" required placeholder="Ex: 12345" className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Siswa</label>
            <input type="text" name="nama" required placeholder="Nama Lengkap..." className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">L/P</label>
            <select name="jk" className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">No WhatsApp</label>
            <input type="tel" name="noWA" placeholder="Ex: 628..." className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
          </div>
          <div className="md:col-span-5 flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Batal</button>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700">Simpan Siswa</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-100 text-slate-700 text-xs font-bold border-b">
            <tr>
              <th className="p-3 w-10 text-center">No</th>
              <th className="p-3 w-32">NIS</th>
              <th className="p-3">Nama Lengkap</th>
              <th className="p-3 w-16 text-center">L/P</th>
              <th className="p-3">No WhatsApp</th>
              <th className="p-3 text-right print:hidden">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {siswa.map((s, i) => {
              if (editingNo === i) {
                return (
                  <tr key={i} className="bg-indigo-50/50">
                    <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                    <td className="p-3">
                      <input type="text" value={editForm.nis} onChange={e => setEditForm({ ...editForm, nis: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.nama} onChange={e => setEditForm({ ...editForm, nama: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.jk} onChange={e => setEditForm({ ...editForm, jk: e.target.value })} className="w-full border p-1.5 rounded text-xs bg-white text-center">
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="tel" value={editForm.noWA} onChange={e => setEditForm({ ...editForm, noWA: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => saveEdit(s.nis)} className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-100 rounded"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingNo(null)} className="text-slate-500 hover:text-slate-700 p-1 bg-slate-200 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                  <td className="p-3 font-mono text-slate-500">{s.nis}</td>
                  <td className="p-3 font-bold text-slate-800">{s.nama}</td>
                  <td className="p-3 text-center font-bold text-slate-500">{s.jk || '-'}</td>
                  <td className="p-3 text-slate-600 font-mono">{s.noWA || '-'}</td>
                  <td className="p-3 text-right print:hidden">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(s, i)} className="text-indigo-500 hover:text-indigo-700 p-1 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteSiswa(s.nis)} className="text-rose-500 hover:text-rose-700 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {siswa.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">Belum ada data siswa.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function AbsensiView() {
  const { absensi, deleteAbsensi, updateAbsensi, addAbsensiMassal, siswa } = useDatabase();
  const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);
  const [absensiState, setAbsensiState] = useState<Record<string, { status: 'H' | 'S' | 'I' | 'A' | 'T', alasan: string }>>({});
  const [activeTab, setActiveTab] = useState<'input' | 'laporan' | 'riwayat'>('input');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: 'H', keterangan: '' });

  // Initialize state when date or siswa changes
  React.useEffect(() => {
    const initialState: Record<string, { status: 'H' | 'S' | 'I' | 'A' | 'T', alasan: string }> = {};
    siswa.forEach(s => {
      // Check if already absensi for this date
      const dateStr = tgl.replace(/-/g, '');
      const existing = absensi.find(a => a.id === `${dateStr}-${s.nis}`);

      if (existing) {
        initialState[s.nis] = { status: existing.status, alasan: existing.keterangan || '' };
      } else {
        initialState[s.nis] = { status: 'H', alasan: '' };
      }
    });
    setAbsensiState(initialState);
  }, [siswa, tgl, absensi]);

  const handleStatusChange = (nis: string, status: 'H' | 'S' | 'I' | 'A' | 'T') => {
    setAbsensiState(prev => ({
      ...prev,
      [nis]: { ...prev[nis], status }
    }));
  };

  const handleAlasanChange = (nis: string, alasan: string) => {
    setAbsensiState(prev => ({
      ...prev,
      [nis]: { ...prev[nis], alasan }
    }));
  };

  const handleSaveMassal = () => {
    const dataToSave = siswa.map(s => ({
      id: `${tgl.replace(/-/g, '')}-${s.nis}`,
      nis: s.nis,
      tgl,
      nama: s.nama,
      status: absensiState[s.nis]?.status || 'H',
      keterangan: absensiState[s.nis]?.alasan || ''
    }));

    addAbsensiMassal(dataToSave);
    Swal.fire({ title: 'Tersimpan!', text: 'Absensi Harian berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false });

  };

  const [filterBulan, setFilterBulan] = useState(new Date().toISOString().substring(0, 7));
  const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Hitung rekap absensi berdasarkan data absensi log mentah (calculate via COUNTIFS logic analog)
  const rekapData = React.useMemo(() => {
    return siswa.map(s => {
      const siswaAbsensi = absensi.filter(a => a.nis === s.nis && a.tgl >= startDate && a.tgl <= endDate);
      const H = siswaAbsensi.filter(a => a.status === 'H').length;
      const S = siswaAbsensi.filter(a => a.status === 'S').length;
      const I = siswaAbsensi.filter(a => a.status === 'I').length;
      const A = siswaAbsensi.filter(a => a.status === 'A').length;
      const T = siswaAbsensi.filter(a => a.status === 'T').length;
      const total = H + S + I + A + T;
      const persentase = total > 0 ? Math.round(((H + S + I + T) / total) * 100) : 0;
      return {
        nis: s.nis,
        nama: s.nama,
        H, S, I, A, T,
        persentase
      };
    });
  }, [siswa, absensi, startDate, endDate]);

  const handleExportPDF = () => {
    const columns = ['NIS', 'Nama Siswa', 'H', 'S', 'I', 'A', 'T', '%'];
    const data = rekapData.map(r => [r.nis, r.nama, r.H, r.S, r.I, r.A, r.T, r.persentase + '%']);
    exportToPDF(`Laporan Rekap Absensi - ${startDate} sd ${endDate}`, columns, data, `Rekap_Absensi_${startDate}_${endDate}`);
  };

  const handleExportExcel = () => {
    const data = rekapData.map(r => ({
      NIS: r.nis, 'Nama Siswa': r.nama, Hadir: r.H, Sakit: r.S, Izin: r.I, Alpa: r.A, Terlambat: r.T, Persentase: r.persentase + '%'
    }));
    exportToExcel(data, `Rekap_Absensi_${startDate}_${endDate}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mt-8 max-w-5xl mx-auto print:shadow-none print:border-none print:p-0">

      <div className="flex border-b border-slate-200 mb-6 print:hidden overflow-x-auto">
        <button
          onClick={() => setActiveTab('input')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'input' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Input Absensi Harian
        </button>
        <button
          onClick={() => setActiveTab('laporan')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'laporan' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Laporan / Rekap Bulanan
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'riwayat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Riwayat Detail
        </button>
      </div>

      {activeTab === 'input' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Input Absensi Harian (Massal)</h3>
              <p className="text-xs text-slate-500 mt-1">Sistem default Hadir (H). Ubah status untuk siswa yang tidak hadir.</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-slate-600">Tanggal:</label>
              <input
                type="date"
                value={tgl}
                onChange={(e) => setTgl(e.target.value)}
                className="border-slate-300 p-2 rounded-lg text-sm bg-slate-50 border focus:bg-white transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto border rounded-xl mb-6">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700 text-xs font-bold border-b">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3 w-32">NIS</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center min-w-[200px]">Status Kehadiran</th>
                  <th className="p-3 w-48">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {siswa.map((s, i) => {
                  const current = absensiState[s.nis] || { status: 'H', alasan: '' };
                  return (
                    <tr key={i} className={`hover:bg-slate-50 ${current.status !== 'H' ? 'bg-orange-50/30' : ''}`}>
                      <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                      <td className="p-3 font-mono text-slate-500">{s.nis}</td>
                      <td className="p-3 font-bold text-slate-800">{s.nama}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-1 sm:gap-3">
                          {(['H', 'S', 'I', 'A', 'T'] as const).map(stat => (
                            <label key={stat} className="cursor-pointer flex items-center gap-1">
                              <input
                                type="radio"
                                name={`status-${i}`}
                                value={stat}
                                checked={current.status === stat}
                                onChange={() => handleStatusChange(s.nis, stat)}
                                className={`w-3.5 h-3.5 ${stat === 'H' ? 'accent-emerald-500' : stat === 'S' ? 'accent-blue-500' : stat === 'I' ? 'accent-amber-500' : stat === 'A' ? 'accent-rose-500' : 'accent-purple-500'}`}
                              />
                              <span className={`font-bold ${current.status === stat ? 'text-slate-800' : 'text-slate-400'}`}>{stat}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Catatan..."
                          value={current.alasan}
                          onChange={(e) => handleAlasanChange(s.nis, e.target.value)}
                          className="w-full border border-slate-200 p-1.5 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })}
                {siswa.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-400">Belum ada master data siswa. Silahkan ke menu Master Data.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 print:hidden">
            <button
              onClick={handleSaveMassal}
              disabled={siswa.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition"
            >
              <Save className="w-5 h-5" /> Simpan Absensi Massal
            </button>
          </div>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Riwayat Detail Kehadiran</h3>
              <p className="text-xs text-slate-500 mt-1">Edit atau hapus data absensi harian siswa.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="month"
                value={filterBulan}
                onChange={(e) => setFilterBulan(e.target.value)}
                className="border-slate-300 p-2 rounded-lg text-sm bg-slate-50 border focus:bg-white transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700 text-xs font-bold border-b">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 w-32">NIS</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {absensi.filter(a => a.tgl.startsWith(filterBulan)).sort((a, b) => new Date(b.tgl).getTime() - new Date(a.tgl).getTime()).map((a, i) => {
                  if (editingId === a.id) {
                    return (
                      <tr key={`${a.id}-${i}`} className="bg-indigo-50/50">
                        <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                        <td className="p-3">{a.tgl}</td>
                        <td className="p-3 font-mono text-slate-500">{a.nis}</td>
                        <td className="p-3 font-bold text-slate-800">{a.nama}</td>
                        <td className="p-3">
                          <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as any })} className="w-full border p-1.5 rounded text-xs">
                            <option value="H">Hadir</option>
                            <option value="S">Sakit</option>
                            <option value="I">Izin</option>
                            <option value="A">Alpa</option>
                            <option value="T">Terlambat</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input type="text" value={editForm.keterangan} onChange={e => setEditForm({ ...editForm, keterangan: e.target.value })} className="w-full border p-1.5 rounded text-xs" />
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { updateAbsensi(a.id, { tgl: a.tgl, nis: a.nis, nama: a.nama, status: editForm.status as any, keterangan: editForm.keterangan }); setEditingId(null); }} className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-100 rounded"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-700 p-1 bg-slate-200 rounded"><X className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                  return (
                    <tr key={`${a.id}-${i}`} className="hover:bg-slate-50">
                      <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                      <td className="p-3">{new Date(a.tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="p-3 font-mono text-slate-500">{a.nis}</td>
                      <td className="p-3 font-bold text-slate-800">{a.nama}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${a.status === 'H' ? 'bg-emerald-100 text-emerald-700' : a.status === 'S' ? 'bg-blue-100 text-blue-700' : a.status === 'I' ? 'bg-amber-100 text-amber-700' : a.status === 'A' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'}`}>{a.status}</span>
                      </td>
                      <td className="p-3">{a.keterangan || '-'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditingId(a.id); setEditForm({ status: a.status, keterangan: a.keterangan }); }} className="text-indigo-500 hover:text-indigo-700 p-1 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => deleteAbsensi(a.id)} className="text-rose-500 hover:text-rose-700 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {absensi.filter(a => a.tgl.startsWith(filterBulan)).length === 0 && (
                  <tr><td colSpan={7} className="p-6 text-center text-slate-400">Belum ada riwayat absensi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'laporan' && (
        <div>
          <div className="flex flex-col mb-6 gap-4 border-b pb-4">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">📊 MENU REKAPITULASI RENTANG TANGGAL</h3>
              <p className="text-xs text-indigo-700 mb-3">Pilih Rentang Waktu Analisis Data:</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border shadow-sm">
                  <span className="text-xs font-bold text-slate-500">Dari:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-sm outline-none bg-transparent font-bold text-slate-700"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border shadow-sm">
                  <span className="text-xs font-bold text-slate-500">Sampai:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-sm outline-none bg-transparent font-bold text-slate-700"
                  />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={handleExportPDF} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition print:hidden">
                    <FileText className="w-4 h-4" /> Cetak PDF
                  </button>
                  <button onClick={handleExportExcel} className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition print:hidden">
                    <Download className="w-4 h-4" /> Cetak Excel
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center my-4">
              <h2 className="font-black text-slate-800 text-lg uppercase tracking-wide">LAPORAN REKAPITULASI KEHADIRAN SISWA</h2>
              <p className="text-sm text-slate-500 font-medium">Periode: {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} s.d. {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700 text-xs font-bold border-b">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3 w-32">NIS</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center text-emerald-600">H</th>
                  <th className="p-3 text-center text-blue-600">S</th>
                  <th className="p-3 text-center text-amber-600">I</th>
                  <th className="p-3 text-center text-rose-600">A</th>
                  <th className="p-3 text-center text-purple-600">T</th>
                  <th className="p-3 text-center font-black">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {rekapData.map((r, i) => (
                  <React.Fragment key={i}>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                      <td className="p-3 font-mono text-slate-500">{r.nis}</td>
                      <td className="p-3 font-bold text-slate-800">{r.nama}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">{r.H}</td>
                      <td className="p-3 text-center font-bold text-blue-600">{r.S}</td>
                      <td className="p-3 text-center font-bold text-amber-600">{r.I}</td>
                      <td className="p-3 text-center font-bold text-rose-600">{r.A}</td>
                      <td className="p-3 text-center font-bold text-purple-600">{r.T}</td>
                      <td className={`p-3 text-center font-black ${r.persentase < 80 ? 'text-rose-600' : 'text-emerald-600'}`}>{r.persentase}%</td>
                    </tr>
                    {r.A >= 2 && (
                      <tr className="bg-rose-50/50">
                        <td colSpan={2}></td>
                        <td colSpan={7} className="p-2 text-[10px] text-rose-600 font-bold uppercase tracking-wide">
                          🚨 Terdeteksi Alpa &gt;= 2 Hari dalam periode ini
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {siswa.length === 0 && (
                  <tr><td colSpan={9} className="p-6 text-center text-slate-400">Belum ada master data siswa. Silahkan ke menu Master Data.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
