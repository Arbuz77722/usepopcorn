import { useEffect } from "react";

export function useKey(keyword, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === keyword.toLowerCase()) {
          action();
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [action, keyword]
  );
}
