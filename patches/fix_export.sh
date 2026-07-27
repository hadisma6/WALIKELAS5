#!/bin/bash
cat << 'INNER_EOF' > fix_pelanggaran.txt
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
INNER_EOF

awk '
  /^  const handleExportPDF = \(\) => {/ {
    count++
    if (count == 1) {
      system("cat fix_pelanggaran.txt")
      in_export=1
      next
    }
  }
  in_export && /^  const handleExportExcel = \(\) => {/ { next }
  in_export && /^  };/ { if (found == 2) { in_export=0; } else { found=2; } next }
  !in_export { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx

cat << 'INNER_EOF' > fix_prestasi.txt
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
INNER_EOF

awk '
  /^  const handleExportPDF = \(\) => {/ {
    count++
    if (count == 2) {
      system("cat fix_prestasi.txt")
      in_export=1
      next
    }
  }
  in_export && /^  const handleExportExcel = \(\) => {/ { next }
  in_export && /^  };/ { if (found == 2) { in_export=0; } else { found=2; } next }
  !in_export { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx
