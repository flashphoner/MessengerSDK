// Accordion.tsx
import React, { memo, FC } from "react";

type AccordionProps = {
  items: { title: string; content: string }[];
}

const Accordion: FC<AccordionProps> = memo(() => {
  return (
    <div className="max-w-md w-full bg-white p-4 rounded-md shadow-sm"></div>
  );
});

Accordion.displayName = "Accordion";
export default Accordion;
