#!/bin/bash

# Change useState for activeTab
sed -i "s/useState<'input' | 'laporan'>('input');/useState<'input' | 'laporan' | 'riwayat'>('input');\n  const [showSuccess, setShowSuccess] = useState(false);\n  const [editingId, setEditingId] = useState<string | null>(null);\n  const [editForm, setEditForm] = useState({ status: 'H', keterangan: '' });/g" src/components/DataViews.tsx

# Replace handleSaveMassal
cat << 'INNER_EOF' > handle_save_massal.txt
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
INNER_EOF

awk '
  /const handleSaveMassal = \(\) => {/ { found=1; system("cat handle_save_massal.txt"); in_func=1; next }
  in_func && /^  };/ { in_func=0; next }
  !in_func { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx

