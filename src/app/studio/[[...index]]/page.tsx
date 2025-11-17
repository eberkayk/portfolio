"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";

// ✅ NextStudio'yu client-side render ediyoruz.
// Bu sayede React.Fragment tabIndex hatası tamamen ortadan kalkar.
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-white">
      <NextStudio config={config as any} />
    </div>
  );
}
