import Link from "next/link";
import { buildHomePageSections, formatEssayDate } from "@/lib/essays/home-sections";
import { getLabAmbient } from "@/lib/lab/ambient";
import { listPublishedEssays } from "@/lib/essays/read";
import styles from "./home.module.css";
import { LabStickies } from "./lab-stickies";
import { MoodChart } from "./mood-chart";
import { WindowFrame, windowStyles } from "./site-window";

export default async function Home() {
  const [essays, ambient] = await Promise.all([
    listPublishedEssays(),
    getLabAmbient(),
  ]);
  const sections = buildHomePageSections(essays);
  const multiExperiences = sections.experiences.length > 1;

  return (
    <div className={styles.page}>
      <p className={styles.sectionLead}>
        Save now. Find anytime.
        <span className={styles.sectionLeadSub}>体験型ウェブエッセイのラボ</span>
      </p>

      <section aria-labelledby="home-mood-title">
        <WindowFrame
          title="Mood Lab"
          subtitle="本日の感情"
          titleId="home-mood-title"
          headingLevel={2}
        >
          <MoodChart
            todayKey={ambient.todayKey}
            temperature={ambient.temperature}
          />
        </WindowFrame>
      </section>

      <LabStickies todayKey={ambient.todayKey} />

      {sections.featured ? (
        <section aria-labelledby="home-featured-title">
          <WindowFrame
            title="Featured"
            subtitle={sections.featured.title}
            titleId="home-featured-title"
            headingLevel={2}
          >
            <Link
              href={`/essays/${sections.featured.slug}`}
              className={styles.featuredLink}
            >
              <div className={styles.featuredPreview}>
                <span className={windowStyles.tag}>
                  {sections.featured.experienceId}
                </span>
              </div>
              <div className={styles.featuredCaption}>
                <p className={styles.featuredEyebrow}>Featured</p>
                <h3 className={styles.featuredTitle}>{sections.featured.title}</h3>
                {sections.featured.excerpt ? (
                  <p className={styles.featuredExcerptInline}>
                    {sections.featured.excerpt}
                  </p>
                ) : null}
              </div>
              {formatEssayDate(sections.featured.publishedAt) ? (
                <p className={styles.featuredMeta}>
                  {formatEssayDate(sections.featured.publishedAt)}
                </p>
              ) : null}
            </Link>
          </WindowFrame>
        </section>
      ) : null}

      {sections.newEssays.length > 0 ? (
        <section aria-labelledby="home-new-essays-title">
          <WindowFrame
            title="New Essays"
            subtitle="新着"
            titleId="home-new-essays-title"
            headingLevel={2}
          >
            <ul className={styles.newEssaysGrid}>
              {sections.newEssays.map((essay) => (
                <li key={essay.slug}>
                  <Link
                    href={`/essays/${essay.slug}`}
                    className={windowStyles.folderCard}
                  >
                    <span className={windowStyles.tag}>Essay</span>
                    <span className={windowStyles.folderIcon} aria-hidden="true">
                      ✎
                    </span>
                    <span className={windowStyles.folderBody}>
                      <span className={windowStyles.folderTitle}>{essay.title}</span>
                      {formatEssayDate(essay.publishedAt) ? (
                        <span className={windowStyles.folderMeta}>
                          {formatEssayDate(essay.publishedAt)}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/essays" className={windowStyles.ctaPill}>
              すべてのエッセイ
            </Link>
          </WindowFrame>
        </section>
      ) : null}

      {sections.experiences.length > 0 ? (
        <section
          className={multiExperiences ? styles.experiencesMulti : styles.experiencesSingle}
          aria-labelledby="home-experiences-title"
        >
          <WindowFrame
            title="Experiences"
            subtitle="体験"
            titleId="home-experiences-title"
            headingLevel={2}
          >
            {multiExperiences ? (
              <ul className={styles.experiencesScroll}>
                {sections.experiences.map(({ experienceId, name, essay }) => (
                  <li key={experienceId} className={styles.experienceSlideItem}>
                    <Link
                      href={`/essays/${essay.slug}`}
                      className={styles.experienceSlide}
                    >
                      <span className={styles.experienceSlideVisual}>
                        <span className={windowStyles.tag}>{name}</span>
                      </span>
                      <span className={styles.experienceSlideTitle}>{essay.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Link
                href={`/essays/${sections.experiences[0].essay.slug}`}
                className={styles.experienceFeature}
              >
                <span className={styles.experienceFeatureVisual}>
                  <span className={windowStyles.tag}>
                    {sections.experiences[0].name}
                  </span>
                </span>
                <span className={styles.experienceFeatureTitle}>
                  {sections.experiences[0].essay.title}
                </span>
                {sections.experiences[0].essay.excerpt ? (
                  <p className={styles.experienceFeatureExcerpt}>
                    {sections.experiences[0].essay.excerpt}
                  </p>
                ) : null}
              </Link>
            )}
          </WindowFrame>
        </section>
      ) : null}

      {sections.labNotes.length > 0 ? (
        <section aria-labelledby="home-lab-notes-title">
          <WindowFrame
            title="Lab Notes"
            subtitle="ラボ便り"
            titleId="home-lab-notes-title"
            headingLevel={2}
          >
            <ul className={styles.labNotesList}>
              {sections.labNotes.map((essay) => (
                <li key={essay.slug} className={styles.labNotesItem}>
                  <Link
                    href={`/essays/${essay.slug}`}
                    className={styles.labNotesRow}
                  >
                    {formatEssayDate(essay.publishedAt) ? (
                      <span className={styles.labNotesDate}>
                        {formatEssayDate(essay.publishedAt)}
                      </span>
                    ) : null}
                    <span className={styles.labNotesTitle}>{essay.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </WindowFrame>
        </section>
      ) : null}

      <section className={styles.about} aria-labelledby="home-about-title">
        <WindowFrame
          title="About RIO LAB"
          subtitle="について"
          titleId="home-about-title"
          headingLevel={2}
        >
          <p className={styles.aboutBody}>
            {essays.length === 0
              ? "まだ公開されたエッセイはありません。体験型ウェブエッセイとクリエイティブコーディングのラボです。"
              : "体験型ウェブエッセイとクリエイティブコーディングのための個人ラボ。各記事は独自の Experience として開きます。"}
          </p>
          <Link href="/about" className={windowStyles.ctaPill}>
            詳しく
          </Link>
        </WindowFrame>
      </section>
    </div>
  );
}
