/** Unobtrusive dev credit — tiny, muted, links to the developer. */
export function DevCredit() {
  return (
    <p className="py-8 text-center text-[10px] tracking-wide text-foreground/30">
      Developed by{" "}
      <a
        href="https://t.me/cloud_xii"
        target="_blank"
        rel="noreferrer"
        className="underline decoration-foreground/20 underline-offset-2 transition-colors hover:text-foreground/60 focus-ring"
      >
        cloud_xii
      </a>
    </p>
  );
}
