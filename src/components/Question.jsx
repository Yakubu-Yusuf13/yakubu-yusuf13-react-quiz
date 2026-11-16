import ProgressBar from './ProgressBar.jsx';
import Timer from './Timer.jsx';
import styles from './Question.module.css';

export default function Question({
  question,
  questionNumber,
  totalQuestions,
  seconds,
  answer,
  onAnswer,
  onNext,
  isLastQuestion,
}) {
  return (
    <section className={styles.card} aria-labelledby="question-title">
      <header className={styles.header}>
        <span className={styles.logo}>quiz club <span aria-hidden="true">✳</span></span>
        <Timer seconds={seconds} />
      </header>

      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div className={styles.questionContent}>
        <span className={styles.category}>{question.category}</span>
        <p className={styles.questionNumber}>QUESTION {String(questionNumber).padStart(2, '0')}</p>
        <h1 id="question-title">{question.text}</h1>
        <p className={styles.hint}>Choose the answer that feels right</p>

        <div className={styles.answers}>
          {question.answers.map((option, index) => {
            const isCorrect = index === question.correctAnswerIndex;
            const isSelected = index === answer;
            const answerClass = answer === null
              ? ''
              : isCorrect
                ? styles.answerCorrect
                : isSelected
                  ? styles.answerIncorrect
                  : '';

            return (
              <button
                className={`${styles.answer} ${answerClass}`}
                key={option}
                type="button"
                onClick={() => onAnswer(index)}
                disabled={answer !== null}
                aria-pressed={isSelected}
              >
                <span className={styles.letter}>{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </button>
            );
          })}
        </div>
        {answer !== null && (
          <button className={styles.nextButton} type="button" onClick={onNext}>
            {isLastQuestion ? 'See results' : 'Next question'} <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>

      <footer className={styles.footer}>
        <span><span aria-hidden="true">✦</span> Trust your first thought!</span>
        <span>Sample round</span>
      </footer>
    </section>
  );
}
