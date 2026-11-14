import styles from "./BrowserChrome.module.css";

export function BrowserChrome({
  url,
  live = false,
}: {
  url: string;
  live?: boolean;
}) {
  return (
    <div className={styles.chrome}>
      <span className={styles.dots} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className={styles.url}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="2" />
        </svg>
        {url}
      </span>
      <span className={styles.status}>
        {live ? (
          <>
            <i className={styles.liveDot} />
            Live preview
          </>
        ) : (
          "Current site"
        )}
      </span>
    </div>
  );
}
