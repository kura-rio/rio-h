import {
  buildDailyMood,
  moodAxisTip,
  moodRadarPoints,
} from "@/lib/lab/mood";
import styles from "./mood-chart.module.css";

type MoodChartProps = {
  todayKey: string;
  temperature: number | null;
};

export function MoodChart({ todayKey, temperature }: MoodChartProps) {
  const mood = buildDailyMood(todayKey, temperature);
  const values = mood.axes.map((axis) => axis.value);
  const polygon = moodRadarPoints(values);
  const axisCount = mood.axes.length;

  return (
    <div className={styles.chart}>
      <div className={styles.meta}>
        <span className={styles.sample}>{mood.sampleId}</span>
        <span
          className={styles.dominant}
          style={{ ["--dominant-color" as string]: mood.dominant.color }}
        >
          <span className={styles.dominantDot} aria-hidden="true" />
          Peak · {mood.dominant.label}
        </span>
      </div>

      <div className={styles.layout}>
        <div className={styles.radarWrap} aria-hidden="true">
          <svg className={styles.radar} viewBox="0 0 100 100" role="img">
            <title>本日の感情レーダー</title>
            {[0.35, 0.65, 1].map((scale) => (
              <polygon
                key={scale}
                className={styles.gridRing}
                points={moodRadarPoints(
                  Array.from({ length: axisCount }, () => 100 * scale),
                )}
              />
            ))}
            {mood.axes.map((axis, index) => {
              const tip = moodAxisTip(index, axisCount);
              return (
                <line
                  key={axis.id}
                  className={styles.axisLine}
                  x1={50}
                  y1={50}
                  x2={tip.x}
                  y2={tip.y}
                />
              );
            })}
            <polygon className={styles.area} points={polygon} />
            {mood.axes.map((axis, index) => {
              const tip = moodAxisTip(
                index,
                axisCount,
                (axis.value / 100) * 36,
              );
              return (
                <circle
                  key={`pt-${axis.id}`}
                  className={styles.point}
                  cx={tip.x}
                  cy={tip.y}
                  r={2.2}
                  fill={axis.color}
                />
              );
            })}
          </svg>
        </div>

        <ul className={styles.bars}>
          {mood.axes.map((axis) => (
            <li key={axis.id} className={styles.barRow}>
              <span className={styles.barLabel}>{axis.label}</span>
              <span className={styles.barTrack}>
                <span
                  className={styles.barFill}
                  style={{
                    width: `${axis.value}%`,
                    ["--bar-color" as string]: axis.color,
                  }}
                />
              </span>
              <span className={styles.barValue}>{axis.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.note}>{mood.note}</p>
    </div>
  );
}
