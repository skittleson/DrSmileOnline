import en from './en.json';
import es from './es.json';

export type Locale = 'en' | 'es';

export function getTranslations(locale: Locale): Record<string, string> {
  const dict = locale === 'es' ? es : en;
  const flat: Record<string, string> = {};
  for (const [section, values] of Object.entries(dict)) {
    for (const [key, value] of Object.entries(values as Record<string, string>)) {
      flat[`${section}.${key}`] = value;
    }
  }
  return flat;
}
