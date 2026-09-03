import { pickDailyStickies } from "@/lib/lab/stickies";
import styles from "./lab-stickies.module.css";

const TONE_CLASS = {
  lime: styles.noteLime,
  magenta: styles.noteMagenta,
  orange: styles.noteOrange,
} as const;

type LabStickiesProps = {
  todayKey: string;
};

export function LabStickies({ todayKey }: LabStickiesProps) {
  const stickies = pickDailyStickies(todayKey);

  return (
    <ul className={styles.strip} aria-label="今日のラボ付箋">
      {stickies.map((sticky) => (
        <li
          key={sticky.id}
          className={`${styles.note} ${TONE_CLASS[sticky.tone]}`}
          style={{ transform: `rotate(${sticky.rotate}deg)` }}
        >
          <p className={styles.title}>{sticky.title}</p>
          <p className={styles.body}>{sticky.body}</p>
        </li>
      ))}
    </ul>
  );
}
