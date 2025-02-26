// External deps
import React, {FC} from "react";

// Internal deps
import MarkDownRenderer from "@/components/ui/markDown/MarkdownViewer";
import DocHeader from '@/components/ui/docHeader/DocHeader';

// Local deps
import markdownContent from "./GroupChat.md";


const DocsPanel: FC = () => {
  return (
    <div className="calc-main-height bg-gray-50 flex flex-col">
      {/* Header */}
      <DocHeader />

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto px-4 py-6 bg-white shadow-inner">
        <div
          className="prose max-w-full prose-indigo prose-headings:font-bold prose-headings:leading-tight prose-headings:mb-6 prose-p:leading-relaxed prose-p:mb-6 prose-li:mb-4 prose-li:marker:text-indigo-600 prose-ul:list-disc prose-ul:list-outside">
          <MarkDownRenderer content={markdownContent} />
        </div>
      </div>
    </div>
  );
};

export default DocsPanel;
