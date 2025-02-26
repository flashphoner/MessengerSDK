import React, { ReactNode, FC } from "react";
import AccordionItem from "@/components/ui/accordion/AccordionItem";

type AccordionContentProps = {
  title: string;
  children: ReactNode;
};

const AccordionContent: FC<AccordionContentProps> = ({ title, children }) => {
  return <AccordionItem title={title}>{children}</AccordionItem>;
};

export default AccordionContent;
