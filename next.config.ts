import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imágenes del catálogo servidas desde Supabase Storage.
    // Reemplazar <project-ref> por el ref real del proyecto cuando exista.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
