import styles from './ScoreBoard.module.css';

export default function ScoreBoard({ score, total }) {
  return (
    <div className={styles.scoreBoard} aria-label={`You scored ${score} out of ${total}`}>
      <div className={styles.score}>{score}<span>/{total}</span></div>
      <div className={styles.copy}>
        <strong>Your score</strong>
        <span>Curiosity looks good on you.</span>
      </div>
      <div className={styles.stars} aria-hidden="true">✦</div>
    </div>
  );
}
