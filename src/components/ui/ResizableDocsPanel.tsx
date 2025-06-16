import React, {
  FC,
  useState,
  useRef,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from 'react';
import MarkdownViewer from '@/components/ui/markDown/MarkdownViewer';
import DocHeader from '@/components/ui/docHeader/DocHeader';

/* ——— sizing config ——— */
const MIN_W = 280;
const MAX_W = 700;
const DEFAULT_W = 450;
const COLLAPSED_W = 52;
const clamp = (v: number) => Math.min(MAX_W, Math.max(MIN_W, v));

export type ResizableDocsPanelProps = {
  docsOpen: boolean;
  content: string;
  onToggle?: () => void;
};

const ResizableDocsPanel: FC<ResizableDocsPanelProps> = (props) => {
  const {
    docsOpen,
    content,
    onToggle,
  } = props;

  /* width refs */
  const widthLive = useRef(docsOpen ? DEFAULT_W : COLLAPSED_W);
  const [width, setWidth] = useState(widthLive.current);
  const panelRef = useRef<HTMLDivElement>(null);

  /* drag state */
  const dragging = useRef(false);

  /* mouse handlers */
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    const next = clamp(widthLive.current - e.movementX);
    widthLive.current = next;
    if (panelRef.current) panelRef.current.style.width = `${next}px`;
  }, []);

  const stopDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.classList.remove('noselect');
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDrag);
    setWidth(widthLive.current);
  }, [onMouseMove]);

  const startDrag = (e: ReactMouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.classList.add('noselect');
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
  };

  /* collapse / expand */
  const toggleCollapse = () => {
    onToggle?.();
    widthLive.current = docsOpen ? COLLAPSED_W : DEFAULT_W;
    setWidth(widthLive.current);
  };

  /* ——— render ——— */
  return (
    <div
      ref={panelRef}
      className={`
        relative flex flex-col flex-shrink-0
        border-l border-customColors-borderGray
        ${dragging.current ? '' : 'transition-[width] duration-200'}
      `}
      style={{ width }}
    >
      <DocHeader docsOpen={docsOpen} onClickCollapse={toggleCollapse} />

      {docsOpen && (
        <div className="custom-scrollbar overflow-y-auto bg-white flex-1">
          <MarkdownViewer content={content} />
        </div>
      )}

      {docsOpen && (
        <div
          onMouseDown={startDrag}
          className="
            absolute -left-2 top-0 h-full w-2.5
            cursor-ew-resize z-10
            bg-transparent hover:bg-slate-300/40 active:bg-slate-400/40
            will-change-transform
          "
        />
      )}
    </div>
  );
};

export default ResizableDocsPanel;
