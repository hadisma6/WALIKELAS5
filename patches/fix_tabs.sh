#!/bin/bash
awk '
  /^      <div>/ {
    count++
    if (count == 1) {
      print "      {activeTab === '"'input'"' && ("
    } else if (count == 2) {
      print "      {activeTab === '"'riwayat'"' && ("
    } else if (count == 3) {
      print "      {activeTab === '"'laporan'"' && ("
    }
  }
  { print }
' src/components/DataViews.tsx > temp.tsx
mv temp.tsx src/components/DataViews.tsx
