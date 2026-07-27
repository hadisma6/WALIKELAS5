#!/bin/bash
cat << 'INNER_EOF' > export_funcs.txt
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
INNER_EOF

awk '
  /const handleExportPDF = \(\) => {/ { found=1; system("cat export_funcs.txt"); in_export=1; next }
  in_export && /^  const handleExportExcel = \(\) => {/ { next }
  in_export && /^  };/ { if (found == 2) { in_export=0; } else { found=2; } next }
  !in_export { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx

