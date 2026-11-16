export default function Loading({ message }) {
  return (
    <section className="status-card" role="status" aria-live="polite">
      <span className="status-spinner" aria-hidden="true" />
      <p>{message}</p>
    </section>
  );
}
