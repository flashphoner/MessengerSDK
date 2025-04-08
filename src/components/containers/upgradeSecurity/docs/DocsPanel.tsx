import React, { FC } from "react";
import MarkDownRenderer from "@/components/ui/markDown/MarkdownViewer";
import DocHeader from '@/components/ui/docHeader/DocHeader';
import markdownContent from "./UpgradeSecurity.md";

type DocsPanelProps = {
  /** Flag indicating whether the panel is open or collapsed */
  docsOpen: boolean;
  /** Callback for clicking the header/button to toggle the panel */
  onClickCollapseDocHeader?: () => void;
};

const DocsPanel: FC<DocsPanelProps> = (props) => {
  const { onClickCollapseDocHeader, docsOpen } = props;

  return (
    <div
      className="
        flex flex-col
        flex-shrink-0       /* Prevent this column from shrinking */
        border-l border-customColors-borderGrey
      "
      /* Dynamic width: 450px when open, 52px when collapsed */
      style={{
        width: docsOpen ? "450px" : "52px",
        transition: "width 0.3s", // Smooth transition for width change
      }}
    >
      {/* Doc header with the collapse button */}
      <DocHeader
        docsOpen={docsOpen}
        onClickCollapse={onClickCollapseDocHeader}
      />

      {/* Render the content only when the panel is open */}
      {docsOpen && (
        <div
          className="custom-scrollbar overflow-y-auto bg-white"
          style={{ flex: 1 }} // Ensure the content container takes available space
        >
          <MarkDownRenderer content={markdownContent} />
        </div>
      )}
    </div>
  );
};

export default DocsPanel;
