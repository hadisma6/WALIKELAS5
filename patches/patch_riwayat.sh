#!/bin/bash
awk '
  /^      {activeTab === '"'laporan'"' && \(/ {
    system("cat riwayat.txt")
    print
    next
  }
  { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx
