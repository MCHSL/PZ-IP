import { useRef, useEffect } from "react";

export function humanFileSize(size: number) {
  var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    Number((size / Math.pow(1024, i)).toFixed(2)) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
}

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
