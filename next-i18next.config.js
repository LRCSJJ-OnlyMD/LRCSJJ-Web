/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'ar'],
  },
  fallbackLng: {
    default: ['fr']
  },
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
