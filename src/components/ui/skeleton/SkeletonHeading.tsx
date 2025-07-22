// SkeletonHeading.tsx
import React from "react";

export const SkeletonHeading: React.FC<{ level?: number; width?: string }> = ({
                                                                                level = 2,
                                                                                width = "55%",
                                                                              }) => {
  const heights = { 1: 32, 2: 26, 3: 20, 4: 18, 5: 15, 6: 13 };
  return (
    <div
      className="mb-2 rounded bg-[#2d4652] animate-pulse"
      style={{
        width,
        height: heights[level as keyof typeof heights] || 16,
        borderRadius: 6,
        marginBottom: "1rem",
      }}
    />
  );
};
