import ScoreBoard from './ScoreBoard.jsx';
import styles from './ResultScreen.module.css';

export default function ResultScreen({ score, total, highscore, onRestart }) {
  return (
    <section className={styles.card} aria-labelledby="result-title">
      <div className={styles.confetti} aria-hidden="true">✳</div>
      <div className={styles.badge} aria-hidden="true">🎉</div>
      <p className={styles.eyebrow}>ROUND COMPLETE</p>
      <h1 id="result-title">Look at that<br /><span>bright brain.</span></h1>
      <p className={styles.message}>You showed up, got curious, and gave it a go. That&apos;s a win in our book.</p>
      <ScoreBoard score={score} total={total} />
      <button className={styles.restart} type="button" onClick={onRestart}>
        Play another round <span aria-hidden="true">↗</span>
      </button>
      <p className={styles.footnote}>Best score: {highscore} / {total}</p>
    </section>
  );
}
