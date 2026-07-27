const SHEET_NAMES = {
  MASTER_SISWA: 'MASTER_SISWA',
  PELANGGARAN: 'PELANGGARAN',
  PRESTASI: 'PRESTASI',
  ABSENSI: 'ABSENSI'
};

function doGet(e) {
  return HtmlService.createHtmlOutput('SIDA XI-5 API is Running.');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const req = JSON.parse(e.postData.contents);
    const action = req.action;
    let result = null;

    if (action === 'init') {
      result = initData();
    } else if (action === 'saveData') {
      result = saveMultipleRows(req.data.sheetName, req.data.rows, req.data.isOverwrite);
    } else {
      throw new Error('Invalid Action');
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: true,
      message: 'Success',
      data: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: false,
      message: err.message,
      data: null
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function ensureSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else {
    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      sheet.appendRow(headers);
    } else {
      let existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      let added = false;
      headers.forEach(h => {
        if (!existingHeaders.includes(h)) {
          existingHeaders.push(h);
          added = true;
        }
      });
      if (added) {
        sheet.getRange(1, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      }
    }
  }
  return sheet;
}

function initData() {
  ensureSheet(SHEET_NAMES.MASTER_SISWA, ['no', 'nama', 'jk', 'nis', 'noWA']);
  ensureSheet(SHEET_NAMES.PELANGGARAN, ['id', 'tgl', 'nama', 'jenis', 'poin', 'keterangan']);
  ensureSheet(SHEET_NAMES.PRESTASI, ['id', 'tgl', 'nama', 'namaKegiatan', 'tingkat', 'poin', 'hasil']);
  ensureSheet(SHEET_NAMES.ABSENSI, ['id', 'nis', 'tgl', 'nama', 'status', 'keterangan']);

  return {
    siswa: getData(SHEET_NAMES.MASTER_SISWA),
    pelanggaran: getData(SHEET_NAMES.PELANGGARAN),
    prestasi: getData(SHEET_NAMES.PRESTASI),
    absensi: getData(SHEET_NAMES.ABSENSI)
  };
}

function getData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getDisplayValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function saveMultipleRows(sheetName, rowsData, isOverwrite = false) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet ' + sheetName + ' not found');
  const headers = sheet.getDataRange().getValues()[0];
  
  if (isOverwrite) {
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.max(sheet.getLastColumn(), headers.length)).clearContent();
    }
    
    if (rowsData && rowsData.length > 0) {
      const array2D = rowsData.map(rowObj => {
        return headers.map(h => {
          let val = rowObj[h];
          if (val === undefined) return '';
          if (typeof val === 'string' && /^[=+\-@]/ .test(val)) {
            return "'" + val; // Prevent formula injection
          }
          return val;
        });
      });
      if (1 + array2D.length > sheet.getMaxRows()) {
        sheet.insertRowsAfter(sheet.getMaxRows(), (1 + array2D.length) - sheet.getMaxRows());
      }
      sheet.getRange(2, 1, array2D.length, headers.length).setValues(array2D);
    }
  } else {
    if (rowsData && rowsData.length > 0) {
      const array2D = rowsData.map(rowObj => {
        return headers.map(h => {
          let val = rowObj[h];
          if (val === undefined) return '';
          if (typeof val === 'string' && /^[=+\-@]/ .test(val)) {
            return "'" + val; 
          }
          return val;
        });
      });
      const startRow = sheet.getLastRow() + 1;
      if ((startRow - 1) + array2D.length > sheet.getMaxRows()) {
        sheet.insertRowsAfter(sheet.getMaxRows(), ((startRow - 1) + array2D.length) - sheet.getMaxRows());
      }
      sheet.getRange(startRow, 1, array2D.length, headers.length).setValues(array2D);
    }
  }
  return true;
}
