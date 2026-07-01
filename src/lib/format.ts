export function money(n: number, compact = true): string {
  if (compact && Math.abs(n) >= 1000) {
    const k = n / 1000;
    if (Math.abs(k) >= 1000) return `$${(k / 1000).toFixed(1)}M`;
    return `$${Math.round(k)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function num(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function pct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function ratePct(numerator: number, denominator: number, digits = 1): string {
  if (!denominator) return "0%";
  return `${((numerator / denominator) * 100).toFixed(digits)}%`;
}

export function shortDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
