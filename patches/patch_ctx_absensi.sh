#!/bin/bash
awk '
  /const deleteAbsensi/ {
    print "  const updateAbsensi = (id: string, data: Omit<Absensi, \"id\">) => {"
    print "    setAbsensi(prev => {"
    print "      const newData = prev.map(a => a.id === id ? { ...a, ...data } : a);"
    print "      saveDataToCloud(\"ABSENSI\", newData, true);"
    print "      return newData;"
    print "    });"
    print "  };"
    print ""
    print $0
    next
  }
  /addAbsensiMassal, deleteAbsensi,/ {
    sub(/deleteAbsensi,/, "deleteAbsensi, updateAbsensi,")
    print
    next
  }
  { print }
' src/context/DatabaseContext.tsx > temp.tsx
mv temp.tsx src/context/DatabaseContext.tsx
