/** Wordmark placeholder: replace with the product's own logo. Colors come from tokens. */
export function Logo() {
  return (
    <span className="font-display text-foreground flex items-center gap-2 text-lg font-semibold">
      <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-md">
        <span>
          n<span className="text-highlight">.</span>
        </span>
      </span>
      Nukta
    </span>
  );
}
