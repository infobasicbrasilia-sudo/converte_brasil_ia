// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  // Caso precise de headers para multi-thread, descomente as linhas abaixo:
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
  //         { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;