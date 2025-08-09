/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",         // статический экспорт
  images: { unoptimized: true }, // уже используем внешние картинки
  // trailingSlash: true,    // опционально, если будешь добавлять страницы типа /about/
};
export default nextConfig;
