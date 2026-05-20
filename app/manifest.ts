import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plant Health",
    short_name: "PlantHealth",
    description: "Analysez la santé de vos plantes avec l'IA",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f0fdf4",
    theme_color: "#16a34a",
    icons: [
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
