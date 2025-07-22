import { useEffect, useRef } from 'react';

export function useSmartScrollToHash(deps: unknown[] = []) {
  const timeoutRef = useRef<number | null>(null);
  const lastHash = useRef<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || lastHash.current === hash) return;

    const id = hash.slice(1);

    const attemptScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        lastHash.current = hash;
      }
    };

    const observer = new MutationObserver(() => {
      if (document.getElementById(id)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          attemptScroll();
          observer.disconnect();
        }, 200);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    attemptScroll();

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line
  }, deps);
}
