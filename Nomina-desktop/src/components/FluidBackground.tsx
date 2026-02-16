type FluidBackgroundProps = {
  variant?: "light" | "dark";
};

export function FluidBackground({ variant = "light" }: FluidBackgroundProps) {
  const isDark = variant === "dark";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Orbes */}
      <div
        className={
          "absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl " +
          (isDark ? "bg-[#7b3ff2]/25" : "bg-[#7b3ff2]/12")
        }
      />
      <div
        className={
          "absolute top-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl " +
          (isDark ? "bg-[#e8b4f0]/20" : "bg-[#e8b4f0]/14")
        }
      />
      <div
        className={
          "absolute bottom-[-10rem] left-1/3 h-[30rem] w-[30rem] rounded-full blur-3xl " +
          (isDark ? "bg-[#a67be8]/18" : "bg-[#a67be8]/12")
        }
      />

      {/* Voile / gradient de base */}
      {isDark ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f33] via-transparent to-[#1a0f33]" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f6fc] via-white to-[#f8f6fc]" />
      )}
    </div>
  );
}
