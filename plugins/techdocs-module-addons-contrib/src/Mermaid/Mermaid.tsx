/*
 * Copyright 2025 The Backstage Authors
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

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useShadowRoot } from '@backstage/plugin-techdocs-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

/**
 * Known mermaid diagram type keywords that appear at the start of a block.
 * Used to detect mermaid content in plain code blocks that lack a
 * distinguishing CSS class.
 */
const MERMAID_KEYWORDS =
  /^(graph\s|flowchart\s|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie\s|pie$|gitGraph|journey|C4Context|C4Container|C4Deployment|C4Dynamic|mindmap|timeline|sankey|xychart|block-beta|quadrantChart|requirementDiagram)/;

/**
 * TechDocs Content addon that finds mermaid diagram blocks in the shadow DOM
 * and renders them as SVG using the mermaid library.
 *
 * Supports three HTML patterns:
 * 1. `<pre class="mermaid">` — output of the mermaid2 mkdocs plugin
 * 2. `<code class="language-mermaid">` — standard fenced code block
 * 3. Plain `<code>` blocks whose text starts with a mermaid keyword — fallback
 *    for docs built without any mermaid mkdocs plugin
 */
export const MermaidAddon = () => {
  const shadowRoot = useShadowRoot();
  const renderedIds = useRef(new Set<string>());
  const observerRef = useRef<MutationObserver | null>(null);
  const renderCounterRef = useRef(0);

  useEffect(() => {
    if (!shadowRoot) return undefined;

    let cancelled = false;
    const currentRenderedIds = renderedIds.current;

    const findMermaidTargets = (): {
      container: HTMLElement;
      code: string;
    }[] => {
      const targets: { container: HTMLElement; code: string }[] = [];
      const root = shadowRoot.firstElementChild as HTMLElement | null;
      if (!root) return targets;

      // Pattern 1: <pre class="mermaid"> (mermaid2 plugin output)
      root.querySelectorAll<HTMLPreElement>('pre.mermaid').forEach(el => {
        if (el.getAttribute('data-mermaid-rendered') === 'true') return;
        const code = el.textContent?.trim();
        if (code) targets.push({ container: el, code });
      });

      // Pattern 2: <code class="language-mermaid">
      root
        .querySelectorAll<HTMLElement>('code.language-mermaid')
        .forEach(el => {
          const container = el.parentElement;
          if (!container) return;
          if (container.getAttribute('data-mermaid-rendered') === 'true')
            return;
          const code = el.textContent?.trim();
          if (code) targets.push({ container, code });
        });

      // Pattern 3: plain <code> inside <pre> whose content starts with a
      // mermaid keyword (fallback for docs built without mermaid plugin)
      root.querySelectorAll<HTMLElement>('pre code').forEach(el => {
        const container = el.closest('pre') as HTMLElement | null;
        if (!container) return;
        if (container.getAttribute('data-mermaid-rendered') === 'true') return;
        // Skip if already matched by patterns 1 or 2
        if (
          container.classList.contains('mermaid') ||
          el.classList.contains('language-mermaid')
        )
          return;
        const code = el.textContent?.trim();
        if (code && MERMAID_KEYWORDS.test(code)) {
          targets.push({ container, code });
        }
      });

      return targets;
    };

    const renderDiagrams = async () => {
      const targets = findMermaidTargets();
      if (targets.length === 0) return;

      for (const { container, code } of targets) {
        if (cancelled) break;

        try {
          const id = `mermaid-diagram-${renderCounterRef.current++}`;
          const { svg } = await mermaid.render(id, code);
          if (!cancelled) {
            container.innerHTML = svg;
            container.setAttribute('data-mermaid-rendered', 'true');
            renderedIds.current.add(id);
          }
        } catch (error) {
          if (!cancelled) {
            container.setAttribute('data-mermaid-rendered', 'true');
            container.innerHTML =
              '<pre style="color: #d32f2f; padding: 1em; border: 1px solid #d32f2f; border-radius: 4px;">Failed to render Mermaid diagram. Check the syntax.</pre>';
          }
          // eslint-disable-next-line no-console
          console.warn('Failed to render mermaid diagram:', error);
        }
      }
    };

    // Render on initial load
    renderDiagrams();

    // Re-render when the shadow DOM content changes (page navigation)
    observerRef.current = new MutationObserver(() => {
      renderDiagrams();
    });
    observerRef.current.observe(shadowRoot, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelled = true;
      observerRef.current?.disconnect();
      renderCounterRef.current = 0;
      currentRenderedIds.clear();
    };
  }, [shadowRoot]);

  return null;
};
