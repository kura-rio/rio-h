export type MoonPhase = {
  /** 0 = 新月, 0.5 = 満月 */
  phase: number;
  illumination: number;
  label: string;
  labelEn: string;
  ageDays: number;
};

const SYNODIC_MONTH = 29.530588853;
/** 既知の新月 (UTC): 2000-01-06 18:14 */
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

export function getMoonPhase(date: Date): MoonPhase {
  const age =
    ((date.getTime() - KNOWN_NEW_MOON_MS) / 86_400_000) % SYNODIC_MONTH;
  const ageDays = age < 0 ? age + SYNODIC_MONTH : age;
  const phase = ageDays / SYNODIC_MONTH;
  const illumination = Math.round(
    (1 - Math.cos(phase * 2 * Math.PI)) * 50,
  );

  let label: string;
  let labelEn: string;

  if (phase < 0.03 || phase >= 0.97) {
    label = "新月";
    labelEn = "New";
  } else if (phase < 0.22) {
    label = "三日月";
    labelEn = "Waxing crescent";
  } else if (phase < 0.28) {
    label = "上弦";
    labelEn = "First quarter";
  } else if (phase < 0.47) {
    label = "ほぼ満月";
    labelEn = "Waxing gibbous";
  } else if (phase < 0.53) {
    label = "満月";
    labelEn = "Full";
  } else if (phase < 0.72) {
    label = "欠け始め";
    labelEn = "Waning gibbous";
  } else if (phase < 0.78) {
    label = "下弦";
    labelEn = "Last quarter";
  } else {
    label = "細い月";
    labelEn = "Waning crescent";
  }

  return {
    phase,
    illumination,
    label,
    labelEn,
    ageDays: Math.round(ageDays * 10) / 10,
  };
}
