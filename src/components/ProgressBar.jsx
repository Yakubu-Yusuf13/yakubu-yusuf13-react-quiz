import styles from './ProgressBar.module.css';

export default function ProgressBar({ current, total }) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <span className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.label}>{current} <span>/ {total}</span></span>
    </div>
  );
}
