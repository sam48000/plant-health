import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#16a34a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 72 L50 38" stroke="white" strokeWidth="7" strokeLinecap="round" />
          <path d="M50 38 C50 38 34 22 20 28 C20 28 18 46 50 52 Z" fill="white" />
          <path d="M50 38 C50 38 66 22 80 28 C80 28 82 46 50 52 Z" fill="white" opacity="0.75" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
