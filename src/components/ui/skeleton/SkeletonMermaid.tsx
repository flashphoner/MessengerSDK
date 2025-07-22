// SkeletonMermaid.tsx
import React from "react";

export const SkeletonMermaid: React.FC<{ height?: number }> = ({ height = 450 }) => (
  <div
    className="flex items-center justify-center rounded-lg bg-[#223b45] mb-4 animate-pulse shadow"
    style={{
      minHeight: height,
      width: '100%',
      background: 'linear-gradient(90deg,#eee 25%,#e0e0e0 50%,#eee 75%)',
      borderRadius: 8,
      margin: 12,
      animation: 'shimmer 1.5s infinite linear',
    }}
  >
    <svg width="54" height="54" fill="#314b54" viewBox="0 0 54 54">
      <rect width="54" height="10" rx="3" />
      <rect y="16" width="42" height="8" rx="2" />
      <rect y="30" width="32" height="8" rx="2" />
      <rect y="44" width="16" height="7" rx="2" />
    </svg>
    <span className="text-[#314b54] text-base font-semibold ml-3">Preparing diagram...</span>
  </div>
);
