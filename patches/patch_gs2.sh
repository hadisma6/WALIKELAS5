#!/bin/bash
cat << 'INNER_EOF' > ensure_sheet.txt
function ensureSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else {
    let existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
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
  return sheet;
}
INNER_EOF

awk '
  /function ensureSheet/ { found=1; system("cat ensure_sheet.txt"); in_func=1; next }
  in_func && /^}/ { in_func=0; next }
  !in_func { print }
' code.gs > temp.gs
mv temp.gs code.gs
