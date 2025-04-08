// src/stores/layoutStore.ts

type LayoutState = {
  docsOpen: boolean;
  sidebarOpen: boolean;
};

let layoutState: LayoutState = {
  docsOpen: true,
  sidebarOpen: true, // Default state is "open"
};

let listeners: Array<() => void> = [];

/**
 * Subscribe to layout state changes.
 * The listener will be called when the state changes.
 *
 * @param listener - A callback function to be called on state change
 * @returns A function to unsubscribe the listener
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
 *
 * @returns The current layout state
 */
export function getLayoutState(): LayoutState {
  return layoutState;
}

/**
 * Update the layout state with partial updates.
 *
 * @param partial - Partial state to be updated
 */
export function setLayoutState(partial: Partial<LayoutState>) {
  layoutState = { ...layoutState, ...partial };
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
