#!/bin/bash
cat << 'INNER_EOF' > fix_pelanggaran_add.txt
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            addPelanggaran({
              nama: fd.get('nama') as string,
              tgl: fd.get('tgl') as string,
              jenis: fd.get('jenis') as string,
              poin: parseInt(fd.get('poin') as string) || 5,
              keterangan: fd.get('keterangan') as string,
            });
            setShowForm(false);
            Swal.fire({title: 'Tersimpan!', text: 'Data pelanggaran berhasil disimpan.', icon: 'success', confirmButtonColor: '#4f46e5', timer: 2000, showConfirmButton: false});
          }}
INNER_EOF

cat << 'INNER_EOF' > fix_prestasi_add.txt
          onSubmit={(e) => {
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
          }}
INNER_EOF

cat << 'INNER_EOF' > fix_siswa_add.txt
          onSubmit={(e) => {
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
          }}
INNER_EOF

awk '
  BEGIN { count = 0 }
  /onSubmit=\{\(e\) => \{/ { 
    if (count == 0) {
      system("cat fix_pelanggaran_add.txt")
      skip=1
      count=1
      next
    } else if (count == 1) {
      system("cat fix_prestasi_add.txt")
      skip=1
      count=2
      next
    } else if (count == 2) {
      system("cat fix_siswa_add.txt")
      skip=1
      count=3
      next
    }
  }
  skip && /^\s*\}\}/ { skip=0; next }
  skip { next }
  !skip { print }
' temp1.tsx > temp2.tsx
mv temp2.tsx src/components/DataViews.tsx

