export function updateArray<T>(
  array: T[],
  value: unknown,
  action: "add" | "remove" | "replace",
  key: keyof T,
  newItem?: T,
): T[] {
  if (action === "add" && newItem) {
    // Add new item if no item with the same key value exists
    return array.some((arrayItem) => arrayItem[key] === value)
      ? array
      : [...array, newItem];
  } else if (action === "remove") {
    // Remove item with the specified key value
    return array.filter((arrayItem) => arrayItem[key] !== value);
  } else if (action === "replace" && newItem) {
    // Replace item with the specified key value, if found
    return array.map((arrayItem) =>
      arrayItem[key] === value ? newItem : arrayItem,
    );
  }
  // Return the original array if action is invalid or conditions are unmet
  return array;
}

export function updateArrayByProperties<T extends { userId: string | number }>(
  array: T[],
  keyValue: T["userId"],
  updatedProperties: Partial<Omit<T, "userId">>,
): T[] {
  const index = array.findIndex((arrayItem) => arrayItem.userId === keyValue);

  if (index !== -1) {
    // replace exist element
    array[index] = { ...array[index], ...updatedProperties };
    return [...array];
  } else {
    // add a new element
    return [...array, { userId: keyValue, ...updatedProperties } as T];
  }
}

export const checkServerAvailability = async (url: string): Promise<boolean> => {
  if (!url.length) {
    return false;
  }
  try {
    const socket = new WebSocket(url);
    return new Promise<boolean>((resolve, reject) => {
      socket.onopen = () => {
        resolve(true);
        socket.close();
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        reject(new Error('Failed to connect to WebSocket server'));
      };

      socket.onclose = (event) => {
        if (!event.wasClean) {
          console.error('WebSocket closed unexpectedly:', event);
          reject(new Error('WebSocket closed unexpectedly'));
        }
      };
    });
  } catch (error) {
    console.error('Connection Server Error:', error);
    return false;
  }
};

export const getStorageKey = (key: string): string => `${key}`;

export const encodeBase64 = (buffer: ArrayBuffer): string => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binary);
};
export const decodeBase64 = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
};

