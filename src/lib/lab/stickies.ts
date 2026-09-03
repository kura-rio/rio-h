export type LabSticky = {
  id: string;
  title: string;
  body: string;
  tone: "lime" | "magenta" | "orange";
  rotate: number;
};

const STICKY_POOL: Omit<LabSticky, "id" | "rotate">[] = [
  {
    title: "Observation",
    body: "窓の外の光が少し青い。画面のコントラストを落とす日。",
    tone: "lime",
  },
  {
    title: "Memo",
    body: "短い段落を3つ書いてから休憩。ラボは急がない。",
    tone: "magenta",
  },
  {
    title: "Signal",
    body: "ノイズ多め。タブは2つまでに抑えると良い。",
    tone: "orange",
  },
  {
    title: "Field note",
    body: "キーボードの感触がいつもより乾いている気がする。",
    tone: "lime",
  },
  {
    title: "Hypothesis",
    body: "今日は「余白」が主役。見出しは短く。",
    tone: "magenta",
  },
  {
    title: "Sample",
    body: "色の温度が高め。オレンジのタグがよく映る。",
    tone: "orange",
  },
  {
    title: "Log",
    body: "集中の波が短い。ポモドーロを短めに回す。",
    tone: "lime",
  },
  {
    title: "Cue",
    body: "音楽はローファイより無音の方が合う予報。",
    tone: "magenta",
  },
  {
    title: "Reminder",
    body: "公開前にモバイル幅で一度スクロール確認。",
    tone: "orange",
  },
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

/** 日付シードで付箋を3枚選ぶ（同日は同じ内容） */
export function pickDailyStickies(todayKey: string, count = 3): LabSticky[] {
  const rand = mulberry32(hashSeed(`${todayKey}:stickies`));
  const pool = [...STICKY_POOL];
  const picked: LabSticky[] = [];

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const index = Math.floor(rand() * pool.length);
    const [item] = pool.splice(index, 1);
    picked.push({
      ...item,
      id: `sticky-${todayKey}-${i}`,
      rotate: Math.round((rand() - 0.5) * 8 * 10) / 10,
    });
  }

  return picked;
}
