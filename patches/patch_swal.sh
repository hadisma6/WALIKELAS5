#!/bin/bash
sed -i "1i import Swal from 'sweetalert2';" src/components/DataViews.tsx

# In SettingsView
sed -i "s/alert('URL berhasil disimpan.');/Swal.fire({title: 'Sukses!', text: 'URL berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000});/g" src/components/DataViews.tsx

# In handleSaveMassal
sed -i "s/setShowSuccess(true);/Swal.fire({title: 'Tersimpan!', text: 'Absensi Harian berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false});/g" src/components/DataViews.tsx
sed -i "s/setTimeout(() => setShowSuccess(false), 3000);//g" src/components/DataViews.tsx

# In SiswaView Import Excel
sed -i "s/alert(\`\${newSiswa.length} data siswa berhasil ditambahkan.\`);/Swal.fire({title: 'Berhasil!', text: \`\${newSiswa.length} data siswa berhasil ditambahkan.\`, icon: 'success', confirmButtonColor: '#4f46e5'});/g" src/components/DataViews.tsx
sed -i "s/alert('Format CSV tidak valid atau data kosong. Gunakan format: No_Induk, Nama_Siswa, L\/P, No_WA');/Swal.fire({title: 'Gagal!', text: 'Format CSV tidak valid atau data kosong. Gunakan format: No_Induk, Nama_Siswa, L\/P, No_WA', icon: 'error', confirmButtonColor: '#4f46e5'});/g" src/components/DataViews.tsx

