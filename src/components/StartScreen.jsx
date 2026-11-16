import styles from './StartScreen.module.css';

export default function StartScreen({
  categories,
  difficulties,
  questionCounts,
  onStart,
}) {
  return (
    <section className={styles.card} aria-labelledby="start-title">
      <div className={styles.intro}>
        <span className={styles.eyebrow}>YOUR DAILY DOSE OF ✨</span>
        <h1 id="start-title">
          A little quiz.
          <br />
          <span>A lot of fun.</span>
        </h1>
        <p>Pick your vibe and let those curious corners of your brain out to play.</p>
        <div className={styles.doodle} aria-hidden="true">✳</div>
      </div>

      <form className={styles.form} onSubmit={(event) => {
        event.preventDefault();
        onStart();
      }}>
        <label className={styles.fieldLabel} htmlFor="category">01 <span>Choose your topic</span></label>
        <div className={styles.selectWrap}>
          <span className={styles.fieldIcon} aria-hidden="true">🌈</span>
          <select
            id="category"
            name="category"
            defaultValue={categories.find((category) => category.value === 'science')?.value ?? categories[0].value}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.emoji} {category.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden="true">⌄</span>
        </div>

        <fieldset className={styles.difficultyField}>
          <legend className={styles.fieldLabel}>02 <span>Set the difficulty</span></legend>
          <div className={styles.difficultyOptions}>
            {difficulties.map((difficulty, index) => (
              <label className={styles.difficultyOption} key={difficulty.value}>
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty.value}
                  defaultChecked={index === 0}
                />
                <span className={styles.radioCard}>
                  <span className={styles.radioDot} />
                  <span>
                    <strong>{difficulty.label}</strong>
                    <small>{difficulty.detail}</small>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.countField}>
          <legend className={styles.fieldLabel}>03 <span>How long have you got?</span></legend>
          <div className={styles.countOptions}>
            {questionCounts.map((count, index) => (
              <label className={styles.countOption} key={count}>
                <input
                  type="radio"
                  name="question-count"
                  value={count}
                  defaultChecked={index === 0}
                />
                <span>{count}<small> questions</small></span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className={styles.startButton} type="submit">
          Let&apos;s play <span aria-hidden="true">↗</span>
        </button>
        <p className={styles.note}><span aria-hidden="true">⏱</span> Preview setup — every round uses five sample questions.</p>
      </form>
    </section>
  );
}
