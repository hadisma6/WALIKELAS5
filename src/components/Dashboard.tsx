import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Users, AlertTriangle, Award, Calendar, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const { siswa, pelanggaran, prestasi, absensi } = useDatabase();
  const countL = siswa.filter(s => s.jk === 'L').length;
  const countP = siswa.filter(s => s.jk === 'P').length;
  
  const totalPoin = pelanggaran.reduce((acc, curr) => acc + curr.poin, 0);

  const poinKarakter = siswa.map(s => {
    const minus = pelanggaran.filter(p => p.nama === s.nama).reduce((acc, curr) => acc + curr.poin, 0);
    const plus = prestasi.filter(p => p.nama === s.nama).reduce((acc, curr) => {
        if ((curr as any).poin) return acc + parseInt((curr as any).poin as unknown as string);
        let pt = 10;
        if (curr.tingkat === 'Sekolah') pt = 20;
        else if (curr.tingkat === 'Kabupaten') pt = 30;
        else if (curr.tingkat === 'Provinsi') pt = 40;
        else if (curr.tingkat === 'Nasional') pt = 50;
        else if (curr.tingkat === 'Internasional') pt = 70;
        return acc + pt;
    }, 0);
    const total = 100 - minus + plus;
    
    let badge = '';
    let icon = '';
    let colorClass = '';
    if (total >= 180) { badge = 'Duta Karakter'; icon = '👑'; colorClass = 'bg-purple-100 text-purple-800'; }
    else if (total >= 160) { badge = 'Teladan'; icon = '🌟'; colorClass = 'bg-blue-100 text-blue-800'; }
    else if (total >= 140) { badge = 'Inspiratif'; icon = '🏅'; colorClass = 'bg-cyan-100 text-cyan-800'; }
    else if (total >= 120) { badge = 'Aktif'; icon = '⚙️'; colorClass = 'bg-emerald-100 text-emerald-800'; }
    else if (total >= 100) { badge = 'Baik'; icon = '👤'; colorClass = 'bg-slate-100 text-slate-800'; }
    else if (total >= 80) { badge = 'Perlu Pembinaan'; icon = '⚠️'; colorClass = 'bg-orange-100 text-orange-800'; }
    else { badge = 'Pendampingan Khusus'; icon = '🚫'; colorClass = 'bg-rose-100 text-rose-800'; }

    return { nama: s.nama, total, badge, icon, colorClass, minus, plus };
  });

  const butuhPerhatian = [...poinKarakter].filter(s => s.total < 100).sort((a, b) => a.total - b.total);
  const topKarakter = [...poinKarakter].sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <StatCard 
          title="Total Siswa" 
          value={siswa.length} 
          subtitle={`${countL} L / ${countP} P`}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard 
          title="Pelanggaran" 
          value={pelanggaran.length} 
          subtitle={`${totalPoin} Total Poin`}
          icon={<AlertTriangle className="w-6 h-6 text-rose-600" />}
          bg="bg-rose-50"
        />
        <StatCard 
          title="Prestasi" 
          value={prestasi.length} 
          subtitle="Apresiasi Siswa"
          icon={<Award className="w-6 h-6 text-emerald-600" />}
          bg="bg-emerald-50"
        />
        <StatCard 
          title="Absensi" 
          value={absensi.length} 
          subtitle="Sakit/Izin/Alpa"
          icon={<Calendar className="w-6 h-6 text-amber-600" />}
          bg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-6">
        {/* Siswa Perlu Perhatian */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 print:shadow-none print:border-none print:p-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <AlertCircle className="text-rose-500 w-5 h-5" />
              Siswa Butuh Pendampingan
            </h3>
            <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full font-bold print:hidden">&lt; 100 Poin</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold print:bg-transparent border-b">
                <tr>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center">Poin</th>
                  <th className="p-3">Level Karakter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {butuhPerhatian.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-emerald-600 text-xs font-bold">🎉 Semua siswa dalam kondisi Baik (≥ 100 poin).</td>
                  </tr>
                ) : (
                  butuhPerhatian.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{s.nama}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{s.total}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.colorClass} print:bg-transparent print:text-black print:px-0 flex items-center gap-1 w-max`}>
                          {s.icon} {s.badge}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Karakter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 print:shadow-none print:border-none print:p-0 print:mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <Award className="text-amber-500 w-5 h-5" />
              Top Level Karakter
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-bold print:hidden">Leaderboard</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold print:bg-transparent border-b">
                <tr>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center">Poin</th>
                  <th className="p-3">Level Karakter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topKarakter.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-slate-400 text-xs italic">Belum ada data.</td>
                  </tr>
                ) : (
                  topKarakter.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-800">{s.nama}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{s.total}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.colorClass} print:bg-transparent print:text-black print:px-0 flex items-center gap-1 w-max`}>
                          {s.icon} {s.badge}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, bg }: { title: string, value: number, subtitle: string, icon: React.ReactNode, bg: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
        <p className="text-[10px] font-medium text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        {icon}
      </div>
    </div>
  );
}
