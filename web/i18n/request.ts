import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  locale ??= await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'en' | 'tr')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default,
  };
});
