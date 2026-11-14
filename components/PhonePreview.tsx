"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PhonePreview.module.css";

type PhonePreviewProps = {
  src: string;
  width?: number;
  height?: number;
  label?: string;
};

export function PhonePreview({
  src,
  width = 390,
  height = 844,
  label = "Proposed hero on mobile",
}: PhonePreviewProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.9);

  useEffect(() => {
    const element = screenRef.current;
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
    <div className={styles.phone}>
      <div className={styles.screen} ref={screenRef} style={{ aspectRatio: `${width} / ${height}` }}>
        <iframe
          className={styles.iframe}
          src={src}
          title={label}
          style={{ width, height, transform: `scale(${scale})` }}
          tabIndex={-1}
        />
        <span className={styles.island} aria-hidden="true">
          <i />
        </span>
      </div>
    </div>
  );
}
