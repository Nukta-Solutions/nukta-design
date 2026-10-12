/** Default locale for Nukta date formatting: day-month-year, e.g. "12 Oct 2026". */
export const DEFAULT_LOCALE = "en-GB";

/** Saturday, the first day of the week in Bangladesh. */
export const DEFAULT_WEEK_STARTS_ON = 6;

const cache = new Map<string, Intl.DateTimeFormat>();

/** Cached Intl.DateTimeFormat; formatters are expensive to create. */
export function dateFormat(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${JSON.stringify(options)}`;
  let format = cache.get(key);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, options);
    cache.set(key, format);
  }
  return format;
}
