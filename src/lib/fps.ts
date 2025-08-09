import { BuildState } from "@/types/parts";
import { useFpsSettings } from "@/store/fps";
export type Game = "Fortnite" | "Warzone" | "GTA5";
export const GAMES: Game[] = ["Fortnite", "Warzone", "GTA5"];
const GPU_BASE: Record<string, Record<Game, number>> = {
  "GeForce RTX 4060":        { Fortnite: 160, Warzone: 110, GTA5: 180 },
  "GeForce RTX 4060 Ti":     { Fortnite: 190, Warzone: 135, GTA5: 220 },
  "GeForce RTX 4070":        { Fortnite: 220, Warzone: 160, GTA5: 260 },
  "GeForce RTX 4070 Super":  { Fortnite: 235, Warzone: 170, GTA5: 280 },
  "GeForce RTX 4070 Ti":     { Fortnite: 250, Warzone: 180, GTA5: 300 },
  "GeForce RTX 4080":        { Fortnite: 300, Warzone: 220, GTA5: 380 },
  "GeForce RTX 4080 Super":  { Fortnite: 310, Warzone: 225, GTA5: 390 },
  "GeForce RTX 4090":        { Fortnite: 360, Warzone: 260, GTA5: 450 },
  "Radeon RX 7700 XT":       { Fortnite: 210, Warzone: 150, GTA5: 250 },
  "Radeon RX 7800 XT":       { Fortnite: 230, Warzone: 165, GTA5: 280 },
  "Radeon RX 7900 XT":       { Fortnite: 280, Warzone: 200, GTA5: 360 },
  "Radeon RX 7900 XTX":      { Fortnite: 320, Warzone: 230, GTA5: 420 },
};
const CPU_FACTOR: Record<string, number> = {
  "Ryzen 7 7800X3D": 1.15, "Ryzen 9 7950X": 1.08, "Ryzen 9 7900": 1.03, "Ryzen 7 7700": 1.02, "Ryzen 5 7600": 0.98,
  "Core i9-13900K": 1.08, "Core i9-12900K": 1.04, "Core i7-13700K": 1.05, "Core i7-12700K": 1.02, "Core i5-13600K": 1.03, "Core i5-13400F": 0.98, "Core i5-12400F": 0.95,
};
const RES_MULT = { "1080p": 1.00, "1440p": 0.75, "4K": 0.52 } as const;
const Q_MULT = { "Medium": 1.10, "High": 1.00, "Ultra": 0.88 } as const;
function findGpuKey(gpuName?: string | null) {
  if (!gpuName) return null; const keys = Object.keys(GPU_BASE);
  const key = keys.find(k => gpuName.includes(k)); return key ?? null;
}
function cpuCoef(cpuName?: string | null) {
  if (!cpuName) return 1.0; const keys = Object.keys(CPU_FACTOR); const key = keys.find(k => cpuName.includes(k));
  return key ? CPU_FACTOR[key] : 1.0;
}
function ramMultiplier(game: Game, ramGb?: number) {
  const size = ramGb ?? 32;
  if (game === "Warzone") { if (size < 16) return 0.80; if (size < 32) return 0.90; return 1.0; }
  if (game === "Fortnite") { if (size < 16) return 0.90; return 1.0; }
  return 1.0;
}
export function estimateFps(build: BuildState, game: Game, res?: keyof typeof RES_MULT, quality?: keyof typeof Q_MULT) {
  const gpuKey = findGpuKey(build.GPU?.name); if (!gpuKey) return null;
  const base = GPU_BASE[gpuKey][game]; const cpu = cpuCoef(build.CPU?.name); const ram = ramMultiplier(game, build.RAM?.sizeGB);
  const r = RES_MULT[res ?? useFpsSettings.getState().res]; const q = Q_MULT[quality ?? useFpsSettings.getState().quality];
  return Math.max(1, Math.round(base * cpu * ram * r * q));
}
export function estimateAll(build: BuildState) {
  const { res, quality } = useFpsSettings.getState();
  return GAMES.map((g) => ({ game: g, value: estimateFps(build, g, res, quality) }));
}