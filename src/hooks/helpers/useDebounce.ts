import { useCallback, useEffect, useRef } from "react";

type CallbackFunction<T> = (args: T) => void;

const useDebounce = <T>(
  callback: CallbackFunction<T>,
  delay: number,
): ((args: T) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect((): (() => void) => () => clearTimeout(timeoutRef.current), []);

  return useCallback(
    (args: T): void => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout((): void => {
        callback(args);
      }, delay);
    },
    [callback, delay],
  );
};

export default useDebounce;
