#!/bin/bash
cat << 'INNER_EOF' > success_banner.txt
      {activeTab === 'input' && (
      <div>
        {showSuccess && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 rounded-lg text-sm flex justify-between items-center animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 font-bold">
              <Check className="w-5 h-5 text-emerald-500" /> Absensi Harian berhasil disimpan.
            </div>
            <button onClick={() => setShowSuccess(false)}><X className="w-4 h-4 text-emerald-600 opacity-70 hover:opacity-100"/></button>
          </div>
        )}
INNER_EOF

awk '
  /^      {activeTab === '"'input'"' && \(/ {
    found=1
    print
    next
  }
  found && /^      <div>/ {
    system("cat success_banner.txt")
    found=0
    next
  }
  { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx
