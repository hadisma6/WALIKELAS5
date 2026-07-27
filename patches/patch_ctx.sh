#!/bin/bash
sed -i 's/setPrestasi(data.prestasi ? data.prestasi.map((p:any) => ({...p, id: Number(p.id)})) : \[\]);/setPrestasi(data.prestasi ? data.prestasi.map((p:any) => ({...p, id: Number(p.id), poin: Number(p.poin)})) : []);/g' src/context/DatabaseContext.tsx
sed -i "s/saveAbsensiMassalToCloud(data\[0\].tgl, data);/saveDataToCloud('ABSENSI', newData, true);/g" src/context/DatabaseContext.tsx
