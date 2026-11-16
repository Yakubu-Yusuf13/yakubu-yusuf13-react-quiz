export default function ErrorMessage({ message, onRetry }) {
  return (
    <section className="status-card" role="alert">
      <p>{message}</p>
      <button className="status-retry" type="button" onClick={onRetry}>
        Try again <span aria-hidden="true">↗</span>
      </button>
    </section>
  );
}
