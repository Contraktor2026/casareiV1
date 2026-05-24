type OnboardingProgressProps = {
  current: number;
  total: number;
};

export function OnboardingProgress({ current, total }: OnboardingProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={index <= current ? "h-2 flex-1 rounded-full bg-casarei-primary" : "h-2 flex-1 rounded-full bg-white/60"}
        />
      ))}
    </div>
  );
}
