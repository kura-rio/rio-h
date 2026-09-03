import type { ReactNode } from "react";
import styles from "./site-window.module.css";

function WindowControls() {
  return (
    <span className={styles.windowControls} aria-hidden="true">
      <span className={styles.windowBtn} />
      <span className={styles.windowBtn} />
      <span className={styles.windowBtn} />
    </span>
  );
}

export function WindowFrame({
  title,
  subtitle,
  titleId,
  headingLevel = 1,
  children,
}: {
  title: string;
  subtitle?: string;
  titleId?: string;
  headingLevel?: 1 | 2;
  children: ReactNode;
}) {
  const TitleTag = headingLevel === 2 ? "h2" : "h1";

  return (
    <div className={styles.window}>
      <div className={styles.windowTitlebar}>
        <TitleTag id={titleId} className={styles.windowTitle}>
          {title}
          {subtitle ? (
            <span className={styles.windowSubtitle}> — {subtitle}</span>
          ) : null}
        </TitleTag>
        <WindowControls />
      </div>
      <div className={styles.windowBody}>{children}</div>
    </div>
  );
}

export { styles as windowStyles };
