import { FC, memo, useEffect, useRef, useState } from 'react';
import mermaid, { MermaidConfig } from 'mermaid';

interface MermaidProps {
  code: string;
  dark?: boolean;
}
const cfg: MermaidConfig = {
  startOnLoad: false,
  theme: 'base',
  sequence: {
    noteAlign: 'left',
    actorMargin: 16,
    messageMargin: 16,
    diagramMarginX: 16,
    diagramMarginY: 16,
  },
  themeVariables: {
    primaryColor:     '#DDD6FE',
    primaryTextColor: '#312E81',
    secondaryColor:   '#FDE047',
    noteBkgColor:     '#213C45',
    noteTextColor:    '#F9F9F9',
  },
  themeCSS: `
    .noteRect { fill:#213C45; }
    .noteText { fill:#F9F9F9; }
    .noteText tspan + tspan { dy: 1.4em; }
  `,
};
const svgCache = new Map<string, string>();

let mermaidReady = false;

const Mermaid: FC<MermaidProps> = memo(({ code }) => {
  const [svg, setSvg] = useState<string | null>(null);

  /** Stable unique ID => no more merged <defs> */
  const idRef = useRef(`mmd-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    /** if we are rendered before — fast set */
    if (svgCache.has(code)) {
      setSvg(svgCache.get(code)!);
      return;            // skip the async render
    }

    if (!mermaidReady) {
      mermaid.initialize(cfg);
      mermaidReady = true;
    }

    let cancelled = false;

    (async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, code);
        if (!cancelled) {
          svgCache.set(code, svg);   // caching
          setSvg(svg);
        }
      } catch (err) {
        if (!cancelled) setSvg(`<pre>Diagram render error</pre>`);
        console.error('Mermaid render error:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [code]);

  return (
    <div
      className="
        my-4 max-w-full overflow-x-auto
        rounded-lg bg-[#213C45]/10 p-4
        shadow-md hover:shadow-lg transition
      "
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
});

Mermaid.displayName = 'MermaidDiagram';

export default Mermaid;
