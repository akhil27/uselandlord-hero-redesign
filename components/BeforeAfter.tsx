"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./BeforeAfter.module.css";

type BeforeAfterProps = {
  beforeSrc: string;
  beforeAlt: string;
  afterSrc: string;
  width?: number;
  height?: number;
  title?: string;
};

export function BeforeAfter({
  beforeSrc,
  beforeAlt,
  afterSrc,
  width = 1440,
  height = 851,
  title = "Before and after comparison of the Landlord homepage hero",
}: BeforeAfterProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState(52);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 961px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const update = () => {
      const next = element.clientWidth / width;
      if (next > 0) setScale(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div className={styles.shell}>
      <div
        ref={frameRef}
        className={styles.frame}
        role="group"
        aria-label={title}
        style={{ "--position": `${position}%`, "--ratio": `${width} / ${height}` } as CSSProperties}
      >
        <div className={styles.captionBefore}>
          {isDesktop ? (
            <button
              type="button"
              className={styles.jump}
              onClick={() => setPosition(100)}
              title="View the current design"
            >
              <i className={`${styles.dot} ${styles.dotBefore}`} />
              Current design
              <em className={styles.tagBefore}>Before</em>
            </button>
          ) : (
            <span className={styles.label}>
              <i className={`${styles.dot} ${styles.dotBefore}`} />
              Current design
              <em className={styles.tagBefore}>Before</em>
            </span>
          )}
          <span className={styles.meta}>uselandlord.com · 1440 × 851</span>
        </div>

        <div className={styles.screenBefore}>
          <img
            src={beforeSrc}
            alt={beforeAlt}
            width={width}
            height={height}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className={styles.captionAfter}>
          {isDesktop ? (
            <button
              type="button"
              className={styles.jump}
              onClick={() => setPosition(0)}
              title="View the proposed design"
            >
              <i className={`${styles.dot} ${styles.dotAfter}`} />
              Proposed design
              <em className={styles.tagAfter}>After</em>
            </button>
          ) : (
            <span className={styles.label}>
              <i className={`${styles.dot} ${styles.dotAfter}`} />
              Proposed design
              <em className={styles.tagAfter}>After</em>
            </span>
          )}
          <span className={styles.meta}>Live preview · 1440 × 851</span>
        </div>

        <div className={styles.screenAfter} aria-hidden="true">
          <iframe
            className={styles.iframe}
            src={afterSrc}
            title="Proposed hero preview"
            tabIndex={-1}
            scrolling="no"
            style={{ width, height, transform: `scale(${scale})` }}
          />
        </div>

        <span className={styles.badge} aria-hidden="true">
          Live
        </span>

        <input
          className={styles.slider}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Comparison position"
          aria-valuetext={`${position}% of the current design visible`}
          aria-describedby="comparison-hint"
        />

        <div className={styles.handle} aria-hidden="true">
          <span className={styles.handleGrip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <p className={styles.foot} id="comparison-hint">
        <span>Same 1440 × 851 viewport for both designs.</span>
        <span className={styles.keyboardHint}>
          Drag the handle, use the arrow keys, or click a label.
        </span>
      </p>
    </div>
  );
}
