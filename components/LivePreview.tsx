"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserChrome } from "./BrowserChrome";
import styles from "./LivePreview.module.css";

type LivePreviewProps = {
  src: string;
  width: number;
  height: number;
  url?: string;
  label?: string;
  className?: string;
};

export function LivePreview({
  src,
  width,
  height,
  url = "uselandlord.com",
  label = "Proposed hero preview",
  className = "",
}: LivePreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const element = viewportRef.current;
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
    <div className={`${styles.frame} ${className}`}>
      <BrowserChrome url={url} live />
      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <iframe
          className={styles.iframe}
          src={src}
          title={label}
          style={{
            width,
            height,
            transform: `scale(${scale})`,
          }}
          loading="eager"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
