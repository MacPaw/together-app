/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withTM = require('next-transpile-modules')(['@macpaw/macpaw-ui']);

module.exports = withTM(nextConfig);
