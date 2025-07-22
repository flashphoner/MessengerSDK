// SkeletonSnippet.tsx
import React from "react";

const SNIPPET_LINE_HEIGHT = 18;

export const SkeletonSnippet: React.FC<{ lines?: number }> = ({ lines = 6 }) => {
  const getWidth = (i: number) => `${90 - Math.abs(((i * 13) % 35) - 15)}%`;
  return (
    <div
      className="rounded-lg bg-[#223b45] p-4 mb-4 shadow-md animate-pulse"
      style={{ minHeight: SNIPPET_LINE_HEIGHT * lines }}
    >
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          style={{
            height: SNIPPET_LINE_HEIGHT - 2,
            width: getWidth(i),
            background: "linear-gradient(90deg, #223b45 25%, #314b54 50%, #223b45 75%)",
            borderRadius: 4,
            marginBottom: 3,
            animation: "shimmer 2.2s infinite",
            opacity: 0.97 - i * 0.03,
          }}
        />
      ))}
      <style>
        {`
        @keyframes shimmer {
          0% { background-position: -100px 0 }
          100% { background-position: 140px 0 }
        }
        `}
      </style>
    </div>
  );
};
