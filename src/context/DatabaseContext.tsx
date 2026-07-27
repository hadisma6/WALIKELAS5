import React, { createContext, useContext, useState, useEffect } from 'react';
import { Siswa, Pelanggaran, Prestasi, Absensi } from '../types';

interface DatabaseContextType {
  siswa: Siswa[];
  pelanggaran: Pelanggaran[];
  prestasi: Prestasi[];
  absensi: Absensi[];
  apiUrl: string;
  setApiUrl: (url: string) => void;
  isLoadingCloud: boolean;
  syncData: () => Promise<void>;
  addPelanggaran: (data: Omit<Pelanggaran, 'id'>) => void;
  updatePelanggaran: (id: number, data: Omit<Pelanggaran, 'id'>) => void;
  deletePelanggaran: (id: number) => void;
  addPrestasi: (data: Omit<Prestasi, 'id'>) => void;
  updatePrestasi: (id: number, data: Omit<Prestasi, 'id'>) => void;
  deletePrestasi: (id: number) => void;
  addAbsensiMassal: (data: Absensi[]) => void;
  deleteAbsensi: (id: string) => void;
  updateAbsensi: (id: string, data: Omit<Absensi, 'id'>) => void;
  addSiswa: (data: Omit<Siswa, 'no'>) => void;
  updateSiswa: (no: number, data: Omit<Siswa, 'no'>) => void;
  addMultipleSiswa: (data: Omit<Siswa, 'no'>[]) => void;
  clearSiswa: () => void;
  deleteSiswa: (nis: string) => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [siswa, setSiswa] = useState<Siswa[]>(() => {
    const data = localStorage.getItem('sida_siswa');
    return data ? JSON.parse(data) : [];
  });
  
  const [pelanggaran, setPelanggaran] = useState<Pelanggaran[]>(() => {
    const data = localStorage.getItem('sida_pelanggaran');
    return data ? JSON.parse(data) : [];
  });

  const [prestasi, setPrestasi] = useState<Prestasi[]>(() => {
    const data = localStorage.getItem('sida_prestasi');
    return data ? JSON.parse(data) : [];
  });

  const [absensi, setAbsensi] = useState<Absensi[]>(() => {
    const data = localStorage.getItem('sida_absensi');
    return data ? JSON.parse(data) : [];
  });

  const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem('sida_api_url') || '');
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(false);

  useEffect(() => localStorage.setItem('sida_siswa', JSON.stringify(siswa)), [siswa]);
  useEffect(() => localStorage.setItem('sida_pelanggaran', JSON.stringify(pelanggaran)), [pelanggaran]);
  useEffect(() => localStorage.setItem('sida_prestasi', JSON.stringify(prestasi)), [prestasi]);
  useEffect(() => localStorage.setItem('sida_absensi', JSON.stringify(absensi)), [absensi]);
  useEffect(() => localStorage.setItem('sida_api_url', apiUrl), [apiUrl]);

  const saveDataToCloud = async (sheetName: string, rows: any[], isOverwrite = false) => {
    if (!apiUrl) return;
    try {
      await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'saveData', data: { sheetName, rows, isOverwrite } })
      });
    } catch(e) {
      console.error('Error saving to cloud', e);
    }
  }

  const syncData = async () => {
    if (!apiUrl) {
      alert("URL Google Apps Script belum disetting!");
      return;
    }
    setIsLoadingCloud(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'init' })
      });
      const { status, data, message } = await res.json();
      if (status) {
        setSiswa(data.siswa ? data.siswa.map((s:any) => ({...s, no: Number(s.no)})) : []);
        setPelanggaran(data.pelanggaran ? data.pelanggaran.map((p:any) => ({...p, id: Number(p.id), poin: Number(p.poin)})) : []);
        setPrestasi(data.prestasi ? data.prestasi.map((p:any) => ({...p, id: Number(p.id), poin: Number(p.poin)})) : []);
        setAbsensi(data.absensi || []);
        alert("Sinkronisasi berhasil! Data terupdate.");
      } else {
        alert("Gagal sinkronisasi: " + message);
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setIsLoadingCloud(false);
    }
  }

  const addPelanggaran = (data: Omit<Pelanggaran, 'id'>) => {
    setPelanggaran(prev => {
      const newData = [{ ...data, id: Date.now() }, ...prev];
      saveDataToCloud('PELANGGARAN', newData, true);
      return newData;
    });
  };

  const updatePelanggaran = (id: number, data: Omit<Pelanggaran, 'id'>) => {
    setPelanggaran(prev => {
      const newData = prev.map(p => p.id === id ? { ...p, ...data } : p);
      saveDataToCloud('PELANGGARAN', newData, true);
      return newData;
    });
  };

  const deletePelanggaran = (id: number) => {
    setPelanggaran(prev => {
      const newData = prev.filter(p => p.id !== id);
      saveDataToCloud('PELANGGARAN', newData, true);
      return newData;
    });
  };

  const addPrestasi = (data: Omit<Prestasi, 'id'>) => {
    setPrestasi(prev => {
      const newData = [{ ...data, id: Date.now() }, ...prev];
      saveDataToCloud('PRESTASI', newData, true);
      return newData;
    });
  };

  const updatePrestasi = (id: number, data: Omit<Prestasi, 'id'>) => {
    setPrestasi(prev => {
      const newData = prev.map(p => p.id === id ? { ...p, ...data } : p);
      saveDataToCloud('PRESTASI', newData, true);
      return newData;
    });
  };

  const deletePrestasi = (id: number) => {
    setPrestasi(prev => {
      const newData = prev.filter(p => p.id !== id);
      saveDataToCloud('PRESTASI', newData, true);
      return newData;
    });
  };

  const addAbsensiMassal = (data: Absensi[]) => {
    setAbsensi(prev => {
      // Filter out overlapping IDs to overwrite same day same user if inputted twice
      const existingIds = new Set(data.map(d => d.id));
      const filteredPrev = prev.filter(a => !existingIds.has(a.id));
      const newData = [...data, ...filteredPrev];
      
      if (data.length > 0) {
        saveDataToCloud('ABSENSI', newData, true);
      }
      return newData;
    });
  };

  const updateAbsensi = (id: string, data: Omit<Absensi, "id">) => {
    setAbsensi(prev => {
      const newData = prev.map(a => a.id === id ? { ...a, ...data } : a);
      saveDataToCloud("ABSENSI", newData, true);
      return newData;
    });
  };

  const deleteAbsensi = (id: string) => {
    setAbsensi(prev => {
      const newData = prev.filter(a => a.id !== id);
      saveDataToCloud('ABSENSI', newData, true); // Keep using default sync if deleted
      return newData;
    });
  };

  const addSiswa = (data: Omit<Siswa, 'no'>) => {
    setSiswa(prev => {
      const newData = [...prev, { ...data, no: prev.length + 1 }];
      saveDataToCloud('MASTER_SISWA', newData, true);
      return newData;
    });
  };

  const updateSiswa = (no: number, data: Omit<Siswa, 'no'>) => {
    setSiswa(prev => {
      const newData = prev.map(s => s.no === no ? { ...s, ...data } : s);
      saveDataToCloud('MASTER_SISWA', newData, true);
      return newData;
    });
  };
  
  const addMultipleSiswa = (data: Omit<Siswa, 'no'>[]) => {
    setSiswa(prev => {
      const combined = [...prev, ...data];
      const newData = combined.map((s, i) => ({ ...s, no: i + 1 }));
      saveDataToCloud('MASTER_SISWA', newData, true);
      return newData;
    });
  };

  const clearSiswa = () => {
    if(window.confirm('Apakah Anda yakin ingin menghapus semua data siswa?')) {
      setSiswa([]);
      saveDataToCloud('MASTER_SISWA', [], true);
    }
  };

  const deleteSiswa = (nis: string) => {
    setSiswa(prev => {
      const newData = prev.filter(s => s.nis !== nis).map((s, i) => ({ ...s, no: i + 1 }));
      saveDataToCloud('MASTER_SISWA', newData, true);
      return newData;
    });
  };

  const exportJSON = () => {
    const data = { siswa, pelanggaran, prestasi, absensi };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIDA_XI5_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.siswa) {
            setSiswa(data.siswa);
            saveDataToCloud('MASTER_SISWA', data.siswa, true);
          }
          if (data.pelanggaran) {
            setPelanggaran(data.pelanggaran);
            saveDataToCloud('PELANGGARAN', data.pelanggaran, true);
          }
          if (data.prestasi) {
            setPrestasi(data.prestasi);
            saveDataToCloud('PRESTASI', data.prestasi, true);
          }
          if (data.absensi) {
            setAbsensi(data.absensi);
            saveDataToCloud('ABSENSI', data.absensi, true);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <DatabaseContext.Provider value={{
      siswa, pelanggaran, prestasi, absensi,
      apiUrl, setApiUrl, isLoadingCloud, syncData,
      addPelanggaran, updatePelanggaran, deletePelanggaran,
      addPrestasi, updatePrestasi, deletePrestasi,
      addAbsensiMassal, deleteAbsensi, updateAbsensi,
      addSiswa, updateSiswa, addMultipleSiswa, clearSiswa, deleteSiswa,
      exportJSON, importJSON
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
}
