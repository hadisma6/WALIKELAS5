#!/bin/bash
sed -i 's/export function SiswaView() {/export function SiswaView() {\n  const [showAddForm, setShowAddForm] = useState(false);/' src/components/DataViews.tsx
