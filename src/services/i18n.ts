import { type WritableComputedRef, nextTick } from "vue";
import { type I18n, createI18n } from "vue-i18n";
import axios from "./axios";

export const SUPPORT_LOCALES = ["en", "fr"];

export const i18n = createI18n({
  legacy: false,
  fallbackLocale: "en",
});

export function setI18nLanguage(i18n: I18n, locale: string): void {
  const htmlElement = document.querySelector("html") as HTMLHtmlElement;
  if (!htmlElement) {
    throw new Error("HTML element not found");
  }

  (i18n.global.locale as WritableComputedRef<string, string>).value = locale;
  axios.defaults.headers.common["Accept-Language"] = locale;

  htmlElement.setAttribute("lang", locale);
}

export async function loadLocaleMessages(
  i18n: I18n,
  locale: string,
): Promise<void> {
  if (!SUPPORT_LOCALES.includes(locale)) {
    throw new Error(`Locale ${locale} is not supported`);
  }

  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await import(`@/locales/${locale}.json`);
    i18n.global.setLocaleMessage(locale, messages.default ?? messages);
  }
  return nextTick();
}
