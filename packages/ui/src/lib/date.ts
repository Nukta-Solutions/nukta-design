/** Small local-time date helpers (no time-zone conversion). */

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function startOfMonth(date: Date, offsetMonths = 0): Date {
  return new Date(date.getFullYear(), date.getMonth() + offsetMonths, 1);
}

export function endOfMonth(date: Date, offsetMonths = 0): Date {
  return new Date(date.getFullYear(), date.getMonth() + offsetMonths + 1, 0);
}

export function isSameDay(a: Date | undefined, b: Date | undefined): boolean {
  if (!a || !b) return a === b;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
