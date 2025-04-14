import React, { FC, ReactNode, HTMLAttributes, useEffect, useState, useDeferredValue, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "@/components/ui/buttons/CopyButton";
import { EXTENDED_PATH, SDK_DOC_URL } from "@/utils/constants";
import CodeLinkIcon from "@/assets/icons/codeLink.svg";
import Icon from '@/components/ui/icon/Icon';

export type MarkdownViewerProps = {
  content?: string;
};

// Caches
const linesCache: Record<string, string[]> = {};
const promisesCache: Record<string, Promise<string[]> | undefined> = {};

async function fetchGitHubFile(url: string): Promise<string[]> {
  const cachedLines = linesCache[url];
  if (cachedLines) {
    return cachedLines;
  }

  const existingPromise = promisesCache[url];
  if (existingPromise) {
    return existingPromise;
  }

  const newPromise = (async () => {
    try {
      const rawUrl = url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
      const resp = await fetch(rawUrl);
      if (!resp.ok) {
        throw new Error(`Failed to fetch file: ${url}`);
      }
      const text = await resp.text();
      const lines = text.split(/\r?\n/);
      linesCache[url] = lines;
      return lines;
    } catch (err) {
      console.error("Error fetching file:", err);
      delete promisesCache[url];
      return [];
    } finally {
      delete promisesCache[url];
    }
  })();

  promisesCache[url] = newPromise;
  return newPromise;
}

const MarkdownViewer: FC<MarkdownViewerProps> = ({ content }) => {
  const [resolvedContent, setResolvedContent] = useState(content);
  const deferredContent = useDeferredValue(resolvedContent);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const snippetQueue = useRef<
    {
      key: string;
      url: string;
      start: number;
      end: number;
      loaded: boolean;
    }[]
  >([]);

  const snippetMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!content) return;

    const regex = /\[(.*?)\]\((https:\/\/github\.com\/[^#]+)#L(\d+)-L(\d+)\)/g;
    const matches = [...content.matchAll(regex)];

    if (matches.length === 0) {
      setResolvedContent(content);
      return;
    }

    let updated = content;

    snippetQueue.current = [];
    snippetMapRef.current = {}; // clear

    matches.forEach(([full, label, url, start, end]) => {
      const snippetKey = `${url}#L${start}-L${end}`;
      snippetQueue.current.push({
        key: snippetKey,
        url,
        start: Number(start),
        end: Number(end),
        loaded: false,
      });

      snippetMapRef.current[snippetKey] = `${url}#L${start}-L${end}`;

      updated = updated.replace(
        full,
        `\n\n\`\`\`ts\n// snippet-key: ${snippetKey}\n// loading...\n\`\`\`\n\n`
      );
    });

    setResolvedContent(updated);

    observerRef.current = new IntersectionObserver((entries, observer) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const key = entry.target.getAttribute("data-snippet-key");
          if (!key) return;

          const snippetInfo = snippetQueue.current.find(
            (s) => s.key === key && !s.loaded
          );
          if (!snippetInfo) return;

          snippetInfo.loaded = true;
          observer.unobserve(entry.target);

          if (!linesCache[snippetInfo.url]) {
            await fetchGitHubFile(snippetInfo.url);
          }

          const lines = linesCache[snippetInfo.url] || [];
          const snippetCode = lines
            .slice(snippetInfo.start - 1, snippetInfo.end)
            .join("\n");

          setResolvedContent((prev) =>
            prev
              ? prev.replace(
                `// snippet-key: ${snippetInfo.key}\n// loading...`,
                `// snippet-key: ${snippetInfo.key}\n${snippetCode}`
              )
              : prev
          );
        }
      });
    });
  }, [content]);

  return (
    // 1) Prevent horizontal scroll on the parent container:
    <div className="p-6 overflow-x-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-2xl font-bold tracking-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 text-xl font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-4 text-lg font-semibold">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-3 text-base font-semibold">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="mb-2 text-sm font-bold">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="mb-2 text-xs font-bold uppercase">{children}</h6>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-2 pl-6 list-disc list-outside">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 pl-6 list-decimal list-outside">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          table: ({ children }) => (
            <table className="w-full mb-4 border-collapse table-auto">
              {children}
            </table>
          ),
          thead: ({ children }) => <thead className="border-b">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b">{children}</tr>,
          th: ({ children }) => (
            <th className="px-2 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-2 py-2 align-top">{children}</td>,
          code: ({
                   inline,
                   className,
                   children,
                   ...props
                 }: {
            inline?: boolean;
            className?: string;
            children?: ReactNode;
          } & HTMLAttributes<HTMLElement>) => {
            if (inline) {
              return (
                <code className={`${className || ""} px-1 py-0.5 bg-gray-100`} {...props}>
                  {children}
                </code>
              );
            }

            const lang = className?.replace("language-", "") || "plaintext";
            const codeString = String(children).trim();
            const snippetKey = codeString.match(/\/\/ snippet-key:\s+(.+)/)?.[1] ?? "";
            const rawSnippetUrl = snippetMapRef.current[snippetKey];
            const cleanedCode = codeString.replace(/\/\/ snippet-key: .+\n?/, "");

            return (
              <div
                className="relative mb-4 not-prose"
                data-snippet-key={snippetKey}
                ref={(el) => el && observerRef.current?.observe(el)}
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  backgroundColor: '#213C45',
                  padding: '16px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {rawSnippetUrl && (
                    <a
                      href={rawSnippetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-customColors-textBlue block mr-1"
                    >
                      <Icon src={CodeLinkIcon} size={16} strokeColor="#758F93" fillColor="#758F93" />
                    </a>
                  )}
                  <CopyButton
                    text={cleanedCode}
                    className="text-sm color-customColors-lightGrayGreen"
                  />
                </div>
                <SyntaxHighlighter
                  language={lang}
                  style={dracula}
                  customStyle={{
                    marginTop: '20px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#213C45',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '14px',
                    /**
                     * 2) Ensure no horizontal scroll by wrapping long lines
                     *    and restricting the maximum width:
                     */
                    maxWidth: '100%',         // prevents code from exceeding the container
                    overflowX: 'scroll',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none' // IE
                  }}
                  codeTagProps={{
                    style: { color: '#F89E0B' }
                  }}
                >
                  {cleanedCode}
                </SyntaxHighlighter>
              </div>
            );
          },
          a: ({ href, ...props }) => (
            <a
              className="font-bold hover:underline text-customColors-textBlue mx-1"
              {...props}
              href={href ? `${SDK_DOC_URL}${EXTENDED_PATH}${href}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
        }}
      >
        {deferredContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
