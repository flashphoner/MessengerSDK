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

export function stripCommonIndent(code: string): string {
  const lines = code.split('\n');

  const indents = lines
    .filter(l => l.trim().length)
    .map(l => l.match(/^(\s*)/)![0].length);

  const minIndent = indents.length ? Math.min(...indents) : 0;

  return lines.map(l => l.slice(minIndent)).join('\n');
}

export function stripMarkers(commentBlock: string): string {
  return commentBlock
    .split('\n')
    .map(line =>
      // remove stars
      line.replace(/^\s*\*\s?/, '').trimEnd()
    )
    .join('\n')
    .trim();
}
export function stripAsterisks(text: string): string {
  return text
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim();
}
export function removeMarkersButKeepText(src: string): string {
  return src.replace(/\/\*\*([\s\S]*?)\*\//g, (_, inner) => {
    return '\n' + stripMarkers(inner) + '\n';
  });
}
