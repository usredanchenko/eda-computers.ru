"use client";
import { AnyPart, Category, BuildState } from "@/types/parts";
import PartCard from "./PartCard";
import { filterCompatible, isPartCompatible } from "@/lib/compatibility";
import { useState, useMemo } from "react";
import FpsPanel from "@/components/ui/FpsPanel";
export default function CategoryStep({ category, catalog, build, onPick }:{ category: Category; catalog: AnyPart[]; build: BuildState; onPick: (p: AnyPart) => void; }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const base = filterCompatible(catalog, build, category);
    const q = query.trim().toLowerCase();
    return q ? base.filter(p => `${p.brand} ${p.name}`.toLowerCase().includes(q)) : base;
  }, [catalog, build, category, query]);
  const withHints = filtered.map((p) => {
    const res = isPartCompatible(p, build);
    return { p, disabled: !res.ok && !res.reasons.some(r => r.reason.toLowerCase().includes("pcie")), hint: res.ok ? undefined : res.reasons.map(r => r.reason).join("; ") };
  });
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <input placeholder="Поиск по бренду/модели" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <FpsPanel />
      {withHints.length === 0 && (<div className="text-white/70 mt-3">Нет доступных вариантов — поменяйте выбор на предыдущих шагах.</div>)}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {withHints.map(({ p, disabled, hint }) => (<PartCard key={p.id} part={p} disabled={disabled} hint={hint} onPick={() => onPick(p)} build={build} category={category} />))}
      </div>
    </div>
  );
}