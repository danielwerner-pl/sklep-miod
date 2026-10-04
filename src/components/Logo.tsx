export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 3 27 9.5v13L16 29 5 22.5v-13L16 3Z" strokeLinejoin="round" />
      <path d="M16 10.5 21 13.5v5.5L16 22l-5-3v-5.5l5-3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
