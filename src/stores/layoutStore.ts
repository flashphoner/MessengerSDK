type LayoutState = {
  docsOpen: boolean;
  sidebarOpen: boolean;
};

const STORAGE_KEY = "layoutState";

function loadLayoutState(): LayoutState {
  const savedState = localStorage.getItem(STORAGE_KEY);
  return savedState
    ? JSON.parse(savedState)
    : { docsOpen: true, sidebarOpen: true };
}


let layoutState: LayoutState = loadLayoutState();

let listeners: Array<() => void> = [];

/**
 * Subscribe to layout state changes.
 */
export function subscribeLayoutStore(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

/**
 * Notify all listeners of a state change.
 */
function notifyAll() {
  listeners.forEach((listener) => listener());
}

/**
 * Get the current layout state.
 */
export function getLayoutState(): LayoutState {
  return layoutState;
}

/**
 * Update the layout state with partial updates and save to localStorage.
 */
export function setLayoutState(partial: Partial<LayoutState>) {
  layoutState = { ...layoutState, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutState));
  notifyAll();
}

/**
 * Action to toggle the docsOpen state.
 */
export function toggleDocsOpen() {
  setLayoutState({ docsOpen: !layoutState.docsOpen });
}

/**
 * Action to toggle the sidebarOpen state.
 */
export function toggleSidebarOpen() {
  setLayoutState({ sidebarOpen: !layoutState.sidebarOpen });
}
