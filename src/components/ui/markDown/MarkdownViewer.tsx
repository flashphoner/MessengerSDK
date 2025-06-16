import React, { FC, ReactNode, HTMLAttributes, useEffect, useState, useDeferredValue, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "@/components/ui/buttons/CopyButton";
import { EXTENDED_PATH, SDK_DOC_URL } from "@/utils/constants";
import CodeLinkIcon from "@/assets/icons/codeLink.svg";
import Icon from '@/components/ui/icon/Icon';
import Mermaid from '@/components/ui/Mermaid';
import {stripCommonIndent, removeMarkersButKeepText, stripAsterisks} from "@/utils/helpers";

export type MarkdownViewerProps = {
  content?: string;
};
function toRawUrl(url: string): string | null {
  if (url.includes("github.com")) {
    return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }
  if (url.includes("gitlab.flashphoner.com")) {
    const match = url.match(/gitlab\.flashphoner\.com\/(.+)\/blob\/([^/]+)\/(.+)$/);
    if (!match) return null;
    const [, groupAndRepo, branch, filePath] = match;
    return `https://gitlab.flashphoner.com/${groupAndRepo}/raw/${branch}/${filePath}`;
  }
  return null;
}
// Caches
const linesCache: Record<string, string[]> = {};
const promisesCache: Record<string, Promise<string[]> | undefined> = {};

async function fetchSnippetFile(url: string): Promise<string[]> {
  const cachedLines = linesCache[url];
  if (cachedLines) {
    return cachedLines;
  }

  const existingPromise = promisesCache[url];
  if (existingPromise) {
    return existingPromise;
  }

  const rawUrl = toRawUrl(url);
  if (!rawUrl) {
    throw new Error(`Unsupported URL: ${url}`);
  }

  const newPromise = (async () => {
    try {
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

    const regex = /\[(.*?)\]\((https:\/\/(?:github\.com|gitlab\.flashphoner\.com)\/[^)]+)#L(\d+)-L(\d+)\)/g;
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
            await fetchSnippetFile(snippetInfo.url);
          }

          const lines = linesCache[snippetInfo.url] || [];
          let snippetCode = lines
            .slice(snippetInfo.start - 1, snippetInfo.end)
            .join("\n");
          const snippetLines = lines.slice(snippetInfo.start - 1, snippetInfo.end);
          snippetCode   = snippetLines.join('\n');

          snippetCode = stripCommonIndent(snippetCode);
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
        skipHtml={true}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-2xl font-bold tracking-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 text-xl font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold">{children}</h3>
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

            const infoString   = className?.replace('language-', '').trim() || 'plaintext';
            const [rawLang, ...flags] = infoString.split(/\s+/);
            const isTsDoc   = rawLang === 'tsdoc';
            const highlightLang = isTsDoc ? 'ts' : rawLang;
            const manualSnippet = flags.includes('snippet') || isTsDoc;
            const codeString   = String(children).trim();
            const cleanedCode = stripAsterisks(stripCommonIndent(
              removeMarkersButKeepText(codeString.replace(/\/\/ snippet-key: .+\n?/, ''))
            ));

            const snippetKey   = codeString.match(/\/\/ snippet-key:\s+(.+)/)?.[1] ?? '';
            const rawSnippetUrl = snippetMapRef.current[snippetKey];

            if (highlightLang === 'mermaid') {
              return <Mermaid code={codeString}/>;
            }

            if (manualSnippet || snippetKey) {
              return (
                <div
                  data-snippet-key={snippetKey}
                  ref={el => el && observerRef.current?.observe(el)}
                  className="relative mb-4 not-prose inline-block max-w-full overflow-x-auto
                             rounded-lg shadow-md bg-[#213C45] p-4 min-h-10"
                >
                  <div className="absolute top-2 right-2 z-10 flex">
                    {rawSnippetUrl && (
                      <a
                        href={rawSnippetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-customColors-textBlue mr-1"
                      >
                        <Icon src={CodeLinkIcon} size={16} strokeColor="#758F93" fillColor="#758F93" />
                      </a>
                    )}
                    <CopyButton text={cleanedCode} className="text-sm color-customColors-lightGrayGreen" />
                  </div>

                  <SyntaxHighlighter
                    language={highlightLang}
                    style={dracula}
                    customStyle={{
                      display: 'inline-block',
                      width: 'max-content',
                      maxWidth: '100%',
                      margin: 0,
                      background: 'transparent',
                      fontFamily: '"Courier New", monospace',
                      fontSize: 14,
                      whiteSpace: 'pre',
                    }}
                    codeTagProps={{ style: { color: '#F89E0B' } }}
                  >
                    {cleanedCode}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <SyntaxHighlighter
                language={highlightLang}
                style={dracula}
                customStyle={{
                  display: 'inline-block',
                  width: 'max-content',
                  maxWidth: '100%',
                  margin: 0,
                  background: 'transparent',
                  fontFamily: '"Courier New", monospace',
                  fontSize: 14,
                  whiteSpace: 'pre',
                }}
                codeTagProps={{ style: { color: '#F89E0B' } }}
              >
                {cleanedCode}
              </SyntaxHighlighter>
            );

          },
          a: ({href, ...props}) => (
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
