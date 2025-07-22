import React, {FC, useEffect} from "react";
import markdownContent from "./Friends.md";
import ResizableDocsPanel from "@/components/ui/ResizableDocsPanel";
import {toggleDocsOpen} from "@/stores/layoutStore";

type DocsPanelProps = {
  /** Flag indicating whether the panel is open or collapsed */
  docsOpen: boolean;
  /** Callback for clicking the header/button to toggle the panel */
  onClickCollapseDocHeader?: () => void;
};

const DocsPanel: FC<DocsPanelProps> = (props) => {
  const { docsOpen } = props;
  return (
    <ResizableDocsPanel
      docsOpen={docsOpen}
      onToggle={toggleDocsOpen}
      content={markdownContent}
    />
  );
};

export default DocsPanel;
