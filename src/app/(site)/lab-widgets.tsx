import { getLabAmbient } from "@/lib/lab/ambient";
import styles from "./lab-widgets.module.css";

export async function LabWidgets() {
  const ambient = await getLabAmbient();

  return (
    <aside className={styles.tray} aria-label="ラボ環境情報">
      <div className={`${styles.widget} ${styles.widgetDate}`}>
        <span className={styles.widgetLabel}>Today</span>
        <span className={styles.widgetValue}>
          {ambient.todayLabel}
          <span aria-hidden="true"> ({ambient.weekdayLabel})</span>
        </span>
      </div>

      <div className={`${styles.widget} ${styles.widgetTemp}`}>
        <span className={styles.widgetLabel}>Temp · Fukuoka</span>
        <span className={styles.widgetValue}>{ambient.temperatureLabel}</span>
        <span className={styles.widgetSub}>外気温</span>
      </div>

      <div className={`${styles.widget} ${styles.widgetWeather}`}>
        <span className={styles.widgetLabel}>Weather · Fukuoka</span>
        <span className={styles.widgetValue}>{ambient.weather.label}</span>
        <span className={styles.widgetSub}>{ambient.weather.labelEn}</span>
      </div>

      <div className={`${styles.widget} ${styles.widgetMoon}`}>
        <span className={styles.widgetLabel}>Moon Today</span>
        <span className={styles.widgetValue}>{ambient.moon.label}</span>
        <span className={styles.widgetSub}>
          {ambient.moon.illumination}% · day {ambient.moon.ageDays}
        </span>
      </div>

      <div className={`${styles.widget} ${styles.widgetHoliday}`}>
        <span className={styles.widgetLabel}>Next Holiday</span>
        {ambient.nextHoliday ? (
          <>
            <span className={styles.widgetValue}>{ambient.nextHoliday.name}</span>
            <span className={styles.widgetSub}>
              {ambient.nextHoliday.date.replace(/-/g, ".")} · {ambient.holidayCountdown}
            </span>
          </>
        ) : (
          <span className={styles.widgetValue}>—</span>
        )}
      </div>
    </aside>
  );
}
