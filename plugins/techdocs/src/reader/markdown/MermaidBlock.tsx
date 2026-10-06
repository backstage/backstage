/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import DOMPurify from 'dompurify';
import type { TechDocsCodeBlockProps } from '@backstage/plugin-techdocs-react/alpha';

let nextId = 0;
// Mermaid has process-wide configuration. Serialize renders and reset our policy.
let queue: Promise<unknown> = Promise.resolve();
export default function MermaidBlock({ code }: TechDocsCodeBlockProps) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!root.current || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const state = useAsync(async () => {
    if (!visible) return undefined;
    if (code.length > 20000 || /%%\{|^---/m.test(code))
      throw new Error(
        'Diagram exceeds limits or contains unsupported configuration',
      );
    const run = queue
      .catch(() => {})
      .then(async () => {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          maxTextSize: 20000,
          maxEdges: 200,
          suppressErrorRendering: true,
          flowchart: { htmlLabels: false },
        });
        const { svg } = await mermaid.render(
          `techdocs-mermaid-${nextId++}`,
          code,
        );
        const clean = DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ['foreignObject', 'image', 'use'],
          FORBID_ATTR: ['href', 'xlink:href'],
        });
        // An image document cannot execute diagram event handlers or scripts.
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clean)}`;
      });
    queue = run;
    return run;
  }, [code, visible]);
  return (
    <div ref={root}>
      {state.value ? (
        <img src={state.value} alt="Mermaid diagram" />
      ) : (
        <pre>{code}</pre>
      )}
      {state.error && (
        <p role="alert">Diagram could not be rendered: {state.error.message}</p>
      )}
    </div>
  );
}
