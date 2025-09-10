"use client";

import { useEffect } from "react";

interface MSClarityProps {
  projectId?: string;
}

const MSClarity: React.FC<MSClarityProps> = ({ projectId = "scjikv5n2k" }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      ((c: any, l: Document, a: string, r: string, i: string) => {
        let t: HTMLScriptElement;
        let y: Element;
        c[a] =
          c[a] ||
          (() => {
            (c[a].q = c[a].q || []).push(arguments);
          });
        t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode?.insertBefore(t, y);
      })(window, document, "clarity", "script", projectId);
    }
  }, [projectId]);

  return null;
};

export default MSClarity;
