import styles from './StartScreen.module.css';

export default function StartScreen({
  categories,
  difficulties,
  lastSettings,
  onStart,
}) {
  const defaultCategoryId = categories.find(
    (category) => String(category.id) === String(lastSettings.categoryId),
  )?.id
    ?? categories.find((category) => category.name === 'Science: Nature')?.id
    ?? categories[0]?.id;
  const defaultDifficulty = difficulties.find(
    (difficulty) => difficulty.value === lastSettings.difficulty,
  )?.value ?? difficulties[0]?.value;

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
        const formData = new FormData(event.currentTarget);
        onStart({
          categoryId: formData.get('category'),
          difficulty: formData.get('difficulty'),
        });
      }}>
        <label className={styles.fieldLabel} htmlFor="category">01 <span>Choose your topic</span></label>
        <div className={styles.selectWrap}>
          <span className={styles.fieldIcon} aria-hidden="true">🌈</span>
          <select
            id="category"
            name="category"
            defaultValue={defaultCategoryId}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden="true">⌄</span>
        </div>

        <fieldset className={styles.difficultyField}>
          <legend className={styles.fieldLabel}>02 <span>Set the difficulty</span></legend>
          <div className={styles.difficultyOptions}>
            {difficulties.map((difficulty) => (
              <label className={styles.difficultyOption} key={difficulty.value}>
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty.value}
                  defaultChecked={difficulty.value === defaultDifficulty}
                  required
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

        <button className={styles.startButton} type="submit">
          Let&apos;s play <span aria-hidden="true">↗</span>
        </button>
        <p className={styles.note}><span aria-hidden="true">⏱</span> 10 questions, 15 seconds each. You&apos;ve got this!</p>
      </form>
    </section>
  );
}
