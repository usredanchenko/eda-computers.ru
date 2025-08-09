import { BuildState, AnyPart, Category, CPU, MB, RAM, GPU, PSU, COOLER, CASE } from "@/types/parts";
export function totalTdp(build: BuildState) { const cpu = build.CPU?.tdp ?? 0; const gpu = build.GPU?.tdp ?? 0; return cpu + gpu + 40; }
export function psuRequiredWattage(build: BuildState) { const tdp = totalTdp(build); return Math.ceil(tdp * 1.3); }
export type IncompatReason = { partId: string; reason: string };
export function isPartCompatible(part: AnyPart, build: BuildState) {
  const reasons: IncompatReason[] = []; const b = build; const add = (partId: string, reason: string) => reasons.push({ partId, reason });
  switch (part.category) {
    case "MB": { const p = part as MB; if (b.CPU && b.CPU.socket !== p.socket) add(p.id, `Сокет ${p.socket} ≠ ${b.CPU.socket}`); if (b.RAM && b.RAM.type !== p.ramType) add(p.id, `RAM ${b.RAM.type} ≠ ${p.ramType}`); break; }
    case "CPU": { const p = part as CPU; if (b.MB && b.MB.socket !== p.socket) add(p.id, `Плата ${b.MB.socket}`); if (b.COOLER && !b.COOLER.sockets.includes(p.socket)) add(p.id, `Кулер без сокета ${p.socket}`); break; }
    case "RAM": { const p = part as RAM; if (b.MB && b.MB.ramType !== p.type) add(p.id, `Матплата требует ${b.MB.ramType}`); break; }
    case "GPU": { const p = part as GPU; if (b.MB && p.pcieGen > b.MB.pcieGen) add(p.id, `GPU ${p.pcieGen}.0 > MB ${b.MB.pcieGen}.0`);
      if (b.CASE && p.lengthMm > b.CASE.gpuMaxLengthMm) add(p.id, `GPU длиннее лимита корпуса`);
      const req = psuRequiredWattage({ ...b, GPU: p }); if (b.PSU && b.PSU.watts < req) add(p.id, `БП ${b.PSU.watts}Вт < ${req}Вт`); break; }
    case "COOLER": { const p = part as COOLER; if (b.CPU && !p.sockets.includes(b.CPU.socket)) add(p.id, `Нет сокета ${b.CPU?.socket}`);
      if (b.CASE && p.heightMm > b.CASE.cpuCoolerMaxHeightMm) add(p.id, `Кулер выше лимита`);
      if (b.CPU && p.tdpSupport < b.CPU.tdp) add(p.id, `TDP CPU>${p.tdpSupport}`); break; }
    case "CASE": { const p = part as CASE; if (b.GPU && b.GPU.lengthMm > p.gpuMaxLengthMm) add(p.id, `GPU длиннее лимита`);
      if (b.COOLER && b.COOLER.heightMm > p.cpuCoolerMaxHeightMm) add(p.id, `Кулер выше лимита`); break; }
    case "PSU": { const p = part as PSU; const req = psuRequiredWattage(b); if (p.watts < req) add(p.id, `Мощности БП ${p.watts}Вт < ${req}Вт`); break; }
    default: break;
  }
  return { ok: reasons.length === 0, reasons };
}
export function filterCompatible(parts: AnyPart[], build: BuildState, category: Category) {
  return parts.filter((p) => { const res = isPartCompatible(p, build); if (category === "GPU") { const hard = res.reasons.filter(r => !r.reason.toLowerCase().includes("pcie")); return hard.length === 0; } return res.ok; });
}