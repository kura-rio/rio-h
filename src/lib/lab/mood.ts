export type MoodAxis = {
  id: string;
  label: string;
  labelEn: string;
  value: number;
  color: string;
};

export type DailyMood = {
  axes: MoodAxis[];
  dominant: MoodAxis;
  note: string;
  sampleId: string;
};

const AXES_META: Omit<MoodAxis, "value">[] = [
  { id: "curiosity", label: "好奇心", labelEn: "Curiosity", color: "var(--site-blue)" },
  { id: "focus", label: "集中", labelEn: "Focus", color: "var(--site-green)" },
  { id: "spark", label: "ワクワク", labelEn: "Spark", color: "var(--site-lime)" },
  { id: "calm", label: "落ち着き", labelEn: "Calm", color: "var(--site-magenta)" },
  { id: "play", label: "遊び心", labelEn: "Play", color: "var(--site-orange)" },
];

const NOTES = [
  "ラボの空気は軽やか。短い実験がはかどりそう。",
  "静かな電流が走っている日。一行ずつ丁寧に。",
  "刺激多めの波形。新しいタブを開きすぎないように。",
  "安定したサイン波。読み物に向いている。",
  "遊び心が優勢。余白を残して進めると良い。",
  "好奇心ピーク。メモを取りながら進もう。",
];

function hashSeed(input: string): number {
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function buildDailyMood(
  todayKey: string,
  temperature: number | null,
): DailyMood {
  const rand = mulberry32(hashSeed(`${todayKey}:mood:${temperature ?? "na"}`));
  const tempBias = temperature === null ? 0 : (temperature - 20) / 30;

  const axes: MoodAxis[] = AXES_META.map((meta, index) => {
    const base = 42 + rand() * 48;
    const wave = Math.sin((hashSeed(todayKey) / 1e9) + index * 1.3) * 10;
    const bias =
      index === 0
        ? tempBias * 8
        : index === 3
          ? -tempBias * 10
          : index === 2
            ? tempBias * 6
            : 0;

    return {
      ...meta,
      value: Math.round(clamp(base + wave + bias, 28, 98)),
    };
  });

  const dominant = axes.reduce((best, axis) =>
    axis.value > best.value ? axis : best,
  );

  const note = NOTES[hashSeed(todayKey) % NOTES.length];
  const sampleId = `MOOD-${todayKey.replace(/-/g, "").slice(2)}`;

  return { axes, dominant, note, sampleId };
}

/** SVG polygon points for a radar chart (viewBox 0 0 100 100, center 50,50, radius 36) */
export function moodRadarPoints(values: number[], radius = 36): string {
  const center = 50;
  const count = values.length;

  return values
    .map((value, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
      const r = (clamp(value, 0, 100) / 100) * radius;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function moodAxisTip(index: number, total: number, radius = 42): {
  x: number;
  y: number;
} {
  const center = 50;
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}
