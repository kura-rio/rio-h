import Link from "next/link";
import { buildHomePageSections, formatEssayDate } from "@/lib/essays/home-sections";
import { listPublishedEssays } from "@/lib/essays/read";
import styles from "./home.module.css";

function SectionHeader({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <header className={styles.sectionHeader}>
      <p className={styles.sectionLabel}>{label}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </header>
  );
}

export default async function Home() {
  const essays = await listPublishedEssays();
  const sections = buildHomePageSections(essays);
  const multiExperiences = sections.experiences.length > 1;

  return (
    <div className={styles.page}>
      {sections.featured ? (
        <section className={styles.featured} aria-labelledby="home-featured-title">
          <Link
            href={`/essays/${sections.featured.slug}`}
            className={styles.featuredLink}
          >
            <div className={styles.featuredVisual} aria-hidden="true">
              <span className={styles.featuredLayerBack} />
              <span className={styles.featuredLayerMid} />
              <span className={styles.featuredLayerFront} />
            </div>
            <div className={styles.featuredBody}>
              <SectionHeader label="Featured" title="注目" />
              <h3 id="home-featured-title" className={styles.featuredTitle}>{sections.featured.title}</h3>
              {sections.featured.excerpt ? (
                <p className={styles.featuredExcerpt}>
                  {sections.featured.excerpt}
                </p>
              ) : null}
              <p className={styles.featuredMeta}>
                {sections.featured.experienceId}
              </p>
            </div>
          </Link>
        </section>
      ) : null}

      {sections.newEssays.length > 0 ? (
        <section className={styles.newEssays} aria-labelledby="home-new-essays-title">
          <div id="home-new-essays-title">
            <SectionHeader label="New Essays" title="新着" />
          </div>
          <ul className={styles.newEssaysList}>
            {sections.newEssays.map((essay) => (
              <li key={essay.slug} className={styles.newEssaysItem}>
                <Link
                  href={`/essays/${essay.slug}`}
                  className={styles.newEssaysRow}
                >
                  {formatEssayDate(essay.publishedAt) ? (
                    <span className={styles.newEssaysDate}>
                      {formatEssayDate(essay.publishedAt)}
                    </span>
                  ) : null}
                  <span className={styles.newEssaysRowTitle}>{essay.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/essays" className={styles.sectionMore}>
            すべてのエッセイ →
          </Link>
        </section>
      ) : null}

      {sections.experiences.length > 0 ? (
        <section
          className={
            multiExperiences ? styles.experiencesMulti : styles.experiencesSingle
          }
          aria-labelledby="home-experiences-title"
        >
          <div id="home-experiences-title">
            <SectionHeader label="Experiences" title="体験" />
          </div>
          {multiExperiences ? (
            <ul className={styles.experiencesScroll}>
              {sections.experiences.map(({ experienceId, name, essay }) => (
                <li key={experienceId} className={styles.experienceTileItem}>
                  <Link
                    href={`/essays/${essay.slug}`}
                    className={styles.experienceTile}
                  >
                    <span className={styles.experienceTileMark} aria-hidden="true" />
                    <span className={styles.experienceTileName}>{name}</span>
                    <span className={styles.experienceTileEssay}>{essay.title}</span>
                    {essay.excerpt ? (
                      <span className={styles.experienceTileExcerpt}>
                        {essay.excerpt}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Link
              href={`/essays/${sections.experiences[0].essay.slug}`}
              className={styles.experienceHero}
            >
              <span className={styles.experienceHeroMark} aria-hidden="true" />
              <span className={styles.experienceHeroName}>
                {sections.experiences[0].name}
              </span>
              <span className={styles.experienceHeroEssay}>
                {sections.experiences[0].essay.title}
              </span>
              {sections.experiences[0].essay.excerpt ? (
                <p className={styles.experienceHeroExcerpt}>
                  {sections.experiences[0].essay.excerpt}
                </p>
              ) : null}
            </Link>
          )}
        </section>
      ) : null}

      {sections.pickUp ? (
        <section className={styles.pickUp} aria-labelledby="home-pick-up-title">
          <Link
            href={`/essays/${sections.pickUp.slug}`}
            className={styles.pickUpLink}
          >
            <div className={styles.pickUpPanel}>
              <SectionHeader label="Pick Up" title="ピックアップ" />
              <h3 id="home-pick-up-title" className={styles.pickUpTitle}>{sections.pickUp.title}</h3>
              {sections.pickUp.excerpt ? (
                <p className={styles.pickUpExcerpt}>{sections.pickUp.excerpt}</p>
              ) : null}
              <span className={styles.pickUpCta}>読む →</span>
            </div>
          </Link>
        </section>
      ) : null}

      {sections.labNotes.length > 0 ? (
        <section className={styles.labNotes} aria-labelledby="home-lab-notes-title">
          <div id="home-lab-notes-title">
            <SectionHeader label="Lab Notes" title="ラボ便り" />
          </div>
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
                  <span className={styles.labNotesMeta}>{essay.experienceId}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.about} aria-labelledby="home-about-title">
        <div id="home-about-title">
          <SectionHeader label="About" title="RIO LAB について" />
        </div>
        {essays.length === 0 ? (
          <p className={styles.aboutBody}>
            まだ公開されたエッセイはありません。体験型ウェブエッセイとクリエイティブコーディングのラボです。
          </p>
        ) : (
          <p className={styles.aboutBody}>
            体験型ウェブエッセイとクリエイティブコーディングのための個人ラボ。各記事は独自の
            Experience として開きます。
          </p>
        )}
        <Link href="/about" className={styles.sectionMore}>
          詳しく →
        </Link>
      </section>
    </div>
  );
}
