import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0a0b0c",
          color: "#f4f2ec",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#3fd0b8",
            letterSpacing: 4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          AI Automation · AI Agents
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1, display: "flex" }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 32, color: "#b9bcc0", display: "flex" }}>
            {siteConfig.role}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
