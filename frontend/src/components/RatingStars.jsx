// Renders stars for a rating value (supports half-star display) and an optional
// interactive mode used on the "leave a review" form.
export default function RatingStars({ value = 0, count, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {stars.map((n) => {
        const filled = interactive ? n <= value : n <= Math.round(value);
        return (
          <span
            key={n}
            onClick={() => interactive && onChange && onChange(n)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              color: filled ? '#c2973f' : '#d8d2c0',
              fontSize: interactive ? 26 : 16,
              lineHeight: 1,
            }}
          >
            ★
          </span>
        );
      })}
      {!interactive && (
        <span style={{ fontSize: 13, color: '#5b647a', marginLeft: 4 }}>
          {value ? value.toFixed(1) : 'No ratings yet'}
          {count ? ` (${count})` : ''}
        </span>
      )}
    </span>
  );
}
