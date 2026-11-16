import styles from './Timer.module.css';

export default function Timer({ seconds }) {
  return (
    <div className={styles.timer} aria-label={`${seconds} seconds remaining`}>
      <span aria-hidden="true">◷</span>
      <strong>00:{String(seconds).padStart(2, '0')}</strong>
    </div>
  );
}
