const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isCapacitorBuild ? {
    output: 'export',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  } : {}),
};

// Skip next-intl server plugin for Capacitor builds (uses client-side IntlProvider instead)
module.exports = isCapacitorBuild ? nextConfig : withNextIntl(nextConfig);
