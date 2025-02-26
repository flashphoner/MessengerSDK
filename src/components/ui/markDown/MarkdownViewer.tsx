// External deps
import React, {FC} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Internal deps
import { EXTENDED_PATH, SDK_DOC_URL } from '@/utils/constants';

export type MarkdownViewerProps = {
  content?: string;
};

const MarkdownViewer: FC<MarkdownViewerProps> = ({ content }) => {
  return (
    <div className="markDownContainer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, ...props }) => (
            <a
              className="font-bold hover:underline mx-2"
              {...props}
              href={
                href
                  ? `${SDK_DOC_URL}${EXTENDED_PATH}${href}`
                  : undefined
              }
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
