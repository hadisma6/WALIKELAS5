#!/bin/bash

# Replace filterBulan with date range states
sed -i "s/const \[filterBulan, setFilterBulan\] = useState(new Date().toISOString().substring(0, 7));/const \[filterBulan, setFilterBulan\] = useState(new Date().toISOString().substring(0, 7));\n  const \[startDate, setStartDate\] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; });\n  const \[endDate, setEndDate\] = useState(new Date().toISOString().split('T')[0]);/g" src/components/DataViews.tsx

# Replace handleExportPDF
sed -i "s/\`Laporan Rekap Absensi - \${filterBulan}\`/\`Laporan Rekap Absensi - \${startDate} sd \${endDate}\`/g" src/components/DataViews.tsx
sed -i "s/\`Rekap_Absensi_\${filterBulan}\`/\`Rekap_Absensi_\${startDate}_\${endDate}\`/g" src/components/DataViews.tsx

# Replace calculate rekapData logic
cat << 'INNER_EOF' > calculate_rekap.txt
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
INNER_EOF

awk '
  /const rekapData = siswa.map\(s => {/ { found=1; system("cat calculate_rekap.txt"); in_rekap=1; next }
  in_rekap && /^  }\);/ { in_rekap=0; next }
  !in_rekap { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx

# Replace UI for Laporan
cat << 'INNER_EOF' > laporan_ui.txt
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
INNER_EOF

awk '
  /^      {activeTab === '"'laporan'"' && \(/ {
    found=1
    print "      {activeTab === '"'laporan'"' && ("
    next
  }
  found && /^      <div>/ {
    system("cat laporan_ui.txt")
    in_laporan=1
    found=0
    next
  }
  in_laporan && /^      \)}/ {
    in_laporan=0
    next
  }
  !in_laporan && !found { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx

