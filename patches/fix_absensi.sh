#!/bin/bash
cat << 'INNER_EOF' > absensi_view.txt
export function AbsensiView() {
  const { absensi, deleteAbsensi, updateAbsensi, addAbsensiMassal, siswa } = useDatabase();
  const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);
  const [absensiState, setAbsensiState] = useState<Record<string, {status: 'H'|'S'|'I'|'A'|'T', alasan: string}>>({});
  const [activeTab, setActiveTab] = useState<'input' | 'laporan' | 'riwayat'>('input');
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: 'H', keterangan: '' });
  
  // Initialize state when date or siswa changes
  React.useEffect(() => {
    const initialState: Record<string, {status: 'H'|'S'|'I'|'A'|'T', alasan: string}> = {};
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

  const handleStatusChange = (nis: string, status: 'H'|'S'|'I'|'A'|'T') => {
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
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
        {showSuccess && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 rounded-lg text-sm flex justify-between items-center animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 font-bold">
              <Check className="w-5 h-5 text-emerald-500" /> Absensi Harian berhasil disimpan.
            </div>
            <button onClick={() => setShowSuccess(false)}><X className="w-4 h-4 text-emerald-600 opacity-70 hover:opacity-100"/></button>
          </div>
        )}
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
                    <tr key={a.id} className="bg-indigo-50/50">
                      <td className="p-3 text-center font-mono text-slate-500">{i + 1}</td>
                      <td className="p-3">{a.tgl}</td>
                      <td className="p-3 font-mono text-slate-500">{a.nis}</td>
                      <td className="p-3 font-bold text-slate-800">{a.nama}</td>
                      <td className="p-3">
                        <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as any})} className="w-full border p-1.5 rounded text-xs">
                          <option value="H">Hadir</option>
                          <option value="S">Sakit</option>
                          <option value="I">Izin</option>
                          <option value="A">Alpa</option>
                          <option value="T">Terlambat</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input type="text" value={editForm.keterangan} onChange={e => setEditForm({...editForm, keterangan: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
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
                <tr key={a.id} className="hover:bg-slate-50">
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
              )})}
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
INNER_EOF

awk '
  /export function AbsensiView\(\) {/ { found=1; system("cat absensi_view.txt"); in_func=1; next }
  in_func && /^export function SiswaView\(\) {/ { in_func=0; print; next }
  !in_func { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx

