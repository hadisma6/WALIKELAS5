export interface Siswa {
  no: number;
  nis: string;
  nama: string;
  jk: 'L' | 'P';
  noWA?: string;
}

export interface Pelanggaran {
  id: number;
  tgl: string;
  nama: string;
  jenis: string;
  poin: number;
  keterangan: string;
}

export interface Prestasi {
  id: number;
  tgl: string;
  nama: string;
  namaKegiatan: string;
  tingkat: string;
  hasil: string;
  poin?: number;
}

export interface Absensi {
  id: string; // YYYYMMDD-No_Induk
  tgl: string;
  nis: string;
  nama: string;
  status: 'H' | 'S' | 'I' | 'A' | 'T';
  keterangan: string;
}
