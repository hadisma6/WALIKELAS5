import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { FileText, Download, Filter } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

export function LaporanView() {
    const { siswa, pelanggaran, prestasi } = useDatabase();

    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterNama, setFilterNama] = useState('');

    const getKarakterInfo = (poin: number) => {
        if (poin >= 180) return { title: 'DUTA KARAKTER', color: 'bg-amber-100 text-amber-700' };
        if (poin >= 160) return { title: 'TELADAN', color: 'bg-emerald-100 text-emerald-700' };
        if (poin >= 140) return { title: 'INSPIRATIF', color: 'bg-purple-100 text-purple-700' };
        if (poin >= 120) return { title: 'AKTIF', color: 'bg-blue-100 text-blue-700' };
        if (poin >= 100) return { title: 'BAIK', color: 'bg-cyan-100 text-cyan-700' };
        if (poin >= 80) return { title: 'PERLU PEMBINAAN', color: 'bg-orange-100 text-orange-700' };
        return { title: 'PENDAMPINGAN KHUSUS', color: 'bg-rose-100 text-rose-700' };
    };

    const calculateReport = () => {
        let targetSiswa = siswa;
        if (filterNama) {
            targetSiswa = siswa.filter(s => s.nama === filterNama);
        }

        return targetSiswa.map(s => {
            // Filter activities based on date constraints
            const pelSiswa = pelanggaran.filter(p => {
                if (p.nama !== s.nama) return false;
                if (filterStartDate && p.tgl < filterStartDate) return false;
                if (filterEndDate && p.tgl > filterEndDate) return false;
                return true;
            });

            const presSiswa = prestasi.filter(p => {
                if (p.nama !== s.nama) return false;
                if (filterStartDate && p.tgl < filterStartDate) return false;
                if (filterEndDate && p.tgl > filterEndDate) return false;
                return true;
            });

            const totalMinus = pelSiswa.reduce((sum, p) => sum + (p.poin || 0), 0);
            const totalPlus = presSiswa.reduce((sum, p) => sum + (p.poin || 0), 0);
            const totalPoin = 100 + totalPlus - totalMinus;

            return {
                ...s,
                totalMinus,
                totalPlus,
                totalPoin,
                jumlahPelanggaran: pelSiswa.length,
                jumlahPrestasi: presSiswa.length,
                karakter: getKarakterInfo(totalPoin)
            };
        }).sort((a, b) => b.totalPoin - a.totalPoin); // Sort by highest points
    };

    const reportData = calculateReport();

    const handleExportPDF = () => {
        const columns = ['NIS', 'Nama Siswa', 'Poin Awal', 'Poin Prestasi (+)', 'Poin Pelanggaran (-)', 'Total Poin', 'Level Karakter'];
        const data = reportData.map(r => [r.nis, r.nama, 100, r.totalPlus, r.totalMinus, r.totalPoin, r.karakter.title]);
        exportToPDF('Laporan Level Karakter Siswa', columns, data, 'LaporanKararkter');
    };

    const handleExportExcel = () => {
        const data = reportData.map(r => ({
            'NIS': r.nis,
            'Nama Siswa': r.nama,
            'Poin Awal': 100,
            'Prestasi (+)': r.totalPlus,
            'Pelanggaran (-)': r.totalMinus,
            'Total Poin': r.totalPoin,
            'Level Karakter': r.karakter.title
        }));
        exportToExcel(data, 'LaporanLevelKarakter');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 print:shadow-none print:border-none print:p-0 mt-8 print:mt-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Laporan & Rekapitulasi Level Karakter</h3>
                    <p className="text-xs text-slate-500 mt-1">Poin awal 100, ditambah prestasi, dikurangi pelanggaran.</p>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3 items-end print:hidden bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-1 w-full text-indigo-800 font-bold text-xs uppercase tracking-wider">
                    <Filter className="w-4 h-4" /> Filter Laporan
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Siswa</label>
                    <select value={filterNama} onChange={e => setFilterNama(e.target.value)} className="w-full border-slate-300 p-2.5 rounded-lg text-sm bg-white border">
                        <option value="">Semua Siswa (Seluruh Kelas)</option>
                        {siswa.map(s => <option key={s.nis} value={s.nama}>{s.nama}</option>)}
                    </select>
                </div>
                <div className="w-36">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dari Tanggal</label>
                    <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full border-slate-300 p-2.5 rounded-lg text-sm bg-white border" />
                </div>
                <div className="w-36">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sampai Tanggal</label>
                    <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-full border-slate-300 p-2.5 rounded-lg text-sm bg-white border" />
                </div>
                <div className="flex gap-2 h-[42px]">
                    <button onClick={handleExportPDF} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition h-full">
                        <FileText className="w-4 h-4" /> Export PDF
                    </button>
                    <button onClick={handleExportExcel} className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition h-full">
                        <Download className="w-4 h-4" /> Export Excel
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-800 text-white text-xs font-bold border-b">
                        <tr>
                            <th className="p-4 w-10 text-center">Rnk</th>
                            <th className="p-4">Nama Siswa</th>
                            <th className="p-4 text-center">Start</th>
                            <th className="p-4 text-center text-emerald-400">Poin (+)</th>
                            <th className="p-4 text-center text-rose-400">Poin (-)</th>
                            <th className="p-4 text-center text-amber-400 text-sm">TOTAL</th>
                            <th className="p-4">Level Karakter</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 print:divide-slate-300 text-sm">
                        {reportData.map((r, i) => (
                            <tr key={r.nis} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-center font-black text-slate-400">{i + 1}</td>
                                <td className="p-4 font-bold text-slate-800">{r.nama}</td>
                                <td className="p-4 text-center text-slate-400 font-mono">100</td>
                                <td className="p-4 text-center">
                                    <span className="text-emerald-600 font-bold">+{r.totalPlus}</span>
                                    <div className="text-[10px] text-slate-400 font-mono mt-1">{r.jumlahPrestasi} item</div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="text-rose-600 font-bold">-{r.totalMinus}</span>
                                    <div className="text-[10px] text-slate-400 font-mono mt-1">{r.jumlahPelanggaran} item</div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="font-black text-lg text-slate-800">{r.totalPoin}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${r.karakter.color}`}>
                                        {r.karakter.title}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {reportData.length === 0 && (
                            <tr><td colSpan={7} className="p-8 text-center text-slate-400">Belum ada data siswa.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
