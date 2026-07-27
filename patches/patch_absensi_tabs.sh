#!/bin/bash
cat << 'INNER_EOF' > new_tabs.txt
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
INNER_EOF

awk '
  /<div className="flex border-b border-slate-200 mb-6 print:hidden">/ { found=1; system("cat new_tabs.txt"); in_tabs=1; next }
  in_tabs && /<\/div>/ { in_tabs=0; next }
  !in_tabs { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx

