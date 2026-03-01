"use client";

import { Input } from "@/components/ui/input";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Input placeholder="Поиск по названию..." value={value} onChange={(e) => onChange(e.target.value)} />;
}
