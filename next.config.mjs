/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_HOME: process.env.HOME,
    NEXT_PUBLIC_XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME,
    NEXT_PUBLIC_APPDATA: process.env.APPDATA,
    NEXT_PUBLIC_OS: process.platform
    }
};

export default nextConfig;
