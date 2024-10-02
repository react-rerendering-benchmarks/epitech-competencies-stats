import { useRef } from "react";
import React from "react";
export default function useStorage<T>(key: string, defaultValue: T) {
  const state = React.useState<T | null>(null);
  React.useEffect(() => {
    let fetching = true;
    chrome.storage.local.get(key).then(data => {
      if (fetching) {
        console.log("key", key);
        console.log("data", data);
        state.current = data[key] || defaultValue;
      }
    }).catch(e => {
      console.error(e);
    });
    return () => {
      fetching = false;
    };
  }, [key]);
  React.useEffect(() => {
    console.log("saving", key, state.current);
    chrome.storage.local.set({
      [key]: state.current
    });
  }, [key, state.current]);
  return ([state.current, setState] as const);
}