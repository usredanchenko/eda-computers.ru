"use client";
import { estimateAll } from "@/lib/fps";
import { useConfigurator } from "@/store/configurator";
import { useFpsSettings, Resolution, Quality } from "@/store/fps";
export default function FpsPanel() {
  const build = useConfigurator((s) => s.build);
  const { res, quality, setRes, setQuality } = useFpsSettings();
  const fps = estimateAll(build);
  return (
    <div className="neon-panel rounded-2xl p-3">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="text-xs text-white/60">FPS (прибл.)</div>
        <div className="flex items-center gap-2">
          <select value={res} onChange={(e) => setRes(e.target.value as Resolution)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs">
            <option>1080p</option><option>1440p</option><option>4K</option>
          </select>
          <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs">
            <option>Medium</option><option>High</option><option>Ultra</option>
          </select>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {fps.map(({ game, value }) => (
          <div key={game} className="rounded-xl border border-white/10 p-2 bg-white/5 text-center">
            <div className="text-[11px] text-white/60">{game}</div>
            <div className="font-orbitron text-neon-cyan text-lg">{value ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}