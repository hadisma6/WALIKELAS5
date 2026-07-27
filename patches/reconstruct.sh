#!/bin/bash
cat << 'INNER_EOF' > rest_pelanggaran.txt
>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Siswa</label>
                <select name="nama" required className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
                  <option value="">Pilih Siswa...</option>
                  {siswa.map(s => <option key={s.nama} value={s.nama}>{s.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                <input type="date" name="tgl" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Pelanggaran</label>
                <input type="text" name="jenis" required placeholder="Contoh: Terlambat" className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Poin Pelanggaran (Angka)</label>
                <input type="number" name="poin" required defaultValue={5} min={1} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
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
                      <input type="date" value={editForm.tgl} onChange={e => setEditForm({...editForm, tgl: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className="w-full border p-1.5 rounded text-xs bg-white">
                        <option value="">Pilih...</option>
                        {siswa.map(s => <option key={s.nama} value={s.nama}>{s.nama}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.jenis} onChange={e => setEditForm({...editForm, jenis: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3 text-center">
                      <input type="number" value={editForm.poin} onChange={e => setEditForm({...editForm, poin: parseInt(e.target.value) || 0})} className="w-16 border p-1.5 rounded text-xs text-center mx-auto" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.keterangan} onChange={e => setEditForm({...editForm, keterangan: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
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
            )})}
            {filteredData.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">Belum ada data pelanggaran / tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
INNER_EOF

cat << 'INNER_EOF' > rest_prestasi.txt

export function PrestasiView() {
  const { prestasi, deletePrestasi, updatePrestasi, siswa, addPrestasi } = useDatabase();
  const [showForm, setShowForm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ tgl: '', nama: '', tingkat: 'Sekolah', namaKegiatan: '', hasil: '', poin: 10 });

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
            addPrestasi({
              nama: fd.get('nama') as string,
              tgl: fd.get('tgl') as string,
              tingkat: fd.get('tingkat') as string,
              namaKegiatan: fd.get('namaKegiatan') as string,
              hasil: fd.get('hasil') as string,
              poin: parseInt(fd.get('poin') as string) || 10,
            });
            setShowForm(false);
            Swal.fire({title: 'Tersimpan!', text: 'Data prestasi berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false});
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Siswa</label>
                <select name="nama" required className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
                  <option value="">Pilih Siswa...</option>
                  {siswa.map(s => <option key={s.nama} value={s.nama}>{s.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                <input type="date" name="tgl" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kegiatan</label>
                <input type="text" name="namaKegiatan" required placeholder="Olimpiade Sains..." className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat</label>
                <select name="tingkat" className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border">
                  <option value="Sekolah">Sekolah</option>
                  <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Poin Tambahan (Angka)</label>
                <input type="number" name="poin" required defaultValue={10} min={1} className="w-full border-slate-300 p-2 rounded-lg text-sm bg-white border" />
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
                      <input type="date" value={editForm.tgl} onChange={e => setEditForm({...editForm, tgl: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className="w-full border p-1.5 rounded text-xs bg-white">
                        <option value="">Pilih...</option>
                        {siswa.map(s => <option key={s.nama} value={s.nama}>{s.nama}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.namaKegiatan} onChange={e => setEditForm({...editForm, namaKegiatan: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.tingkat} onChange={e => setEditForm({...editForm, tingkat: e.target.value})} className="w-full border p-1.5 rounded text-xs mb-1 bg-white">
                        <option value="Sekolah">Sekolah</option>
                        <option value="Kabupaten/Kota">Kab/Kota</option>
                        <option value="Provinsi">Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Intl</option>
                      </select>
                      <input type="number" value={editForm.poin} onChange={e => setEditForm({...editForm, poin: parseInt(e.target.value) || 0})} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.hasil} onChange={e => setEditForm({...editForm, hasil: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
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
            )})}
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
          Swal.fire({title: 'Berhasil!', text: `${newSiswa.length} data siswa berhasil ditambahkan.`, icon: 'success', confirmButtonColor: '#4f46e5'});
        } else {
          Swal.fire({title: 'Gagal!', text: 'Format CSV tidak valid atau data kosong. Gunakan format: No_Induk, Nama_Siswa, L/P, No_WA', icon: 'error', confirmButtonColor: '#4f46e5'});
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
            Swal.fire({title: 'Tersimpan!', text: 'Data siswa berhasil ditambahkan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false});
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
                      <input type="text" value={editForm.nis} onChange={e => setEditForm({...editForm, nis: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
                    </td>
                    <td className="p-3">
                      <select value={editForm.jk} onChange={e => setEditForm({...editForm, jk: e.target.value})} className="w-full border p-1.5 rounded text-xs bg-white text-center">
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="tel" value={editForm.noWA} onChange={e => setEditForm({...editForm, noWA: e.target.value})} className="w-full border p-1.5 rounded text-xs" />
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
            )})}
            {siswa.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">Belum ada data siswa.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
INNER_EOF

cat src/components/DataViews.tsx > full_dataviews.tsx
cat rest_pelanggaran.txt >> full_dataviews.tsx
cat rest_prestasi.txt >> full_dataviews.tsx
cat absensi_view.txt >> full_dataviews.tsx

mv full_dataviews.tsx src/components/DataViews.tsx

