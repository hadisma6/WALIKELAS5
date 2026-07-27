#!/bin/bash
sed -i "s/ensureSheet(SHEET_NAMES.MASTER_SISWA, \['no', 'nama', 'jk', 'nis'\]);/ensureSheet(SHEET_NAMES.MASTER_SISWA, ['no', 'nama', 'jk', 'nis', 'noWA']);/g" code.gs
sed -i "s/ensureSheet(SHEET_NAMES.PRESTASI, \['id', 'tgl', 'nama', 'namaKegiatan', 'tingkat', 'hasil'\]);/ensureSheet(SHEET_NAMES.PRESTASI, ['id', 'tgl', 'nama', 'namaKegiatan', 'tingkat', 'poin', 'hasil']);/g" code.gs
sed -i "s/ensureSheet(SHEET_NAMES.ABSENSI, \['id', 'tgl', 'nama', 'status', 'alasan'\]);/ensureSheet(SHEET_NAMES.ABSENSI, ['id', 'nis', 'tgl', 'nama', 'status', 'alasan']);/g" code.gs
