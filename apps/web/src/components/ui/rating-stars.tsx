export function RatingStars({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`${value} / 5`}>
      <span className="text-accent">★</span>
      <span className="font-semibold">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted-foreground">({count})</span>}
    </span>
  );
}
