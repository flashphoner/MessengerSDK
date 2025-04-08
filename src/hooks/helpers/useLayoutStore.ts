// useLayoutStore.ts
import { useEffect, useState } from 'react';
import { getLayoutState, subscribeLayoutStore } from '@/stores/layoutStore';

/**
 * Hook to subscribe to specific parts of the LayoutState
 * using a selector.
 *
 * For example, if you only need `docsOpen`:
 * const docsOpen = useLayoutStore(state => state.docsOpen);
 */
export function useLayoutStore<T>(selector: (state: ReturnType<typeof getLayoutState>) => T): T {
  // Initialize local state for the selected slice of the store
  const [selected, setSelected] = useState<T>(() => selector(getLayoutState()));

  useEffect(() => {
    // Subscribe to the store and update the state when the value changes
    const unsubscribe = subscribeLayoutStore(() => {
      const newSelected = selector(getLayoutState());
      setSelected(newSelected);
    });

    // Clean up the subscription when the component unmounts or the selector changes
    return unsubscribe;
  }, [selector]);

  return selected;
}
