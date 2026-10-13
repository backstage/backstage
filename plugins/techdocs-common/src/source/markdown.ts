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

import { emojify } from 'node-emoji';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

/** A portable tree shared by search extraction and the reader. @alpha */
export type TechDocsMarkdownNode = {
  type: string;
  tagName?: string;
  value?: string;
  name?: string;
  properties?: Record<string, unknown>;
  children?: TechDocsMarkdownNode[];
  position?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};
/** @alpha */
export type TechDocsHeading = { id: string; title: string; level: number };
/** Trusted, synchronous syntax transformations run before HTML sanitization. @alpha */
export type TechDocsMarkdownTransform = (tree: TechDocsMarkdownNode) => void;

/** @alpha */
export function techDocsNodeText(node: TechDocsMarkdownNode): string {
  return node.value ?? node.children?.map(techDocsNodeText).join('') ?? '';
}

/** Preserve common MkDocs block syntax without evaluating any author code. @alpha */
export function normalizeTechDocsMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let fence = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
        fence = '';
    }
    const block = !fence && line.match(/^( *)(!!!|\?\?\?\+?|===)\s+(.*)$/);
    if (!block) {
      output.push(line);
      continue;
    }
    const indent = block[1].length;
    const tab = block[2] === '===';
    const kind = tab ? 'tab' : block[3].split(/\s/)[0];
    const title =
      block[3].match(/"([^"\n]*)"/)?.[1] ??
      `${kind[0].toUpperCase()}${kind.slice(1)}`;
    let directive = 'note';
    if (tab) directive = 'tab';
    else if (block[2].startsWith('???')) directive = 'details';
    output.push(
      `${block[1]}:::${directive}[${title.replace(
        /[\[\]]/g,
        '',
      )}]{kind="${kind.replace(/[^a-z]/g, '')}"${
        block[2] === '???+' ? ' expanded="true"' : ''
      }}`,
    );
    while (
      i + 1 < lines.length &&
      (!lines[i + 1].trim() || lines[i + 1].startsWith(' '.repeat(indent + 4)))
    ) {
      i++;
      output.push(lines[i].slice(Math.min(indent + 4, lines[i].length)));
    }
    output.push(`${block[1]}:::`);
  }
  return output.join('\n');
}

/** Parses untrusted Markdown into a sanitized tree, with matching headings for search. @alpha */
export function parseTechDocsMarkdown(
  source: string,
  transforms: TechDocsMarkdownTransform[] = [],
) {
  if (source.length > 1_000_000)
    throw new Error('Documentation page exceeds the 1 MB limit');
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkDirective)
    .use(remarkFrontmatter)
    .use(() => (tree: unknown) => {
      const visit = (node: TechDocsMarkdownNode, depth: number) => {
        if (depth > 100)
          throw new Error('Documentation nesting exceeds 100 levels');
        if (node.type === 'containerDirective') {
          const attributes = (
            node as TechDocsMarkdownNode & {
              attributes?: Record<string, string>;
            }
          ).attributes;
          const collapsible = node.name === 'tab' || node.name === 'details';
          const kind = attributes?.kind ?? 'note';
          node.data = {
            hName: collapsible ? 'details' : 'aside',
            hProperties:
              node.name === 'tab'
                ? { className: ['techdocs-tab'] }
                : {
                    className: [`techdocs-${kind}`],
                    ...(attributes?.expanded === 'true' ? { open: true } : {}),
                  },
          };
          if (collapsible && node.children?.[0]) {
            node.children[0].data = { hName: 'summary' };
          }
        }
        if (node.type === 'text' && node.value)
          node.value = emojify(
            node.value
              .replace(/:thumbsup:/g, ':+1:')
              .replace(/:thumbsdown:/g, ':-1:'),
          );
        // Accept only bounded image dimensions and download markers, never author CSS.
        for (let i = 0; i < (node.children?.length ?? 0) - 1; i++) {
          const child = node.children![i];
          const following = node.children![i + 1];
          if (following.type !== 'text' || !following.value) continue;
          if (child.type === 'image') {
            const width = following.value.match(
              /^\{:\s*(?:style="width:\s*(\d+)px\s*;?"|width="(\d+)")\s*\}/,
            );
            if (width && Number(width[1] ?? width[2]) <= 10000) {
              child.data = {
                ...child.data,
                hProperties: {
                  ...child.data?.hProperties,
                  width: Number(width[1] ?? width[2]),
                },
              };
              following.value = following.value.slice(width[0].length);
            }
          } else if (child.type === 'link') {
            following.value = following.value.replace(
              /^\{:\s*download\s*\}/,
              '',
            );
          }
        }
        if (node.type === 'yaml') node.value = '';
        for (const child of node.children ?? []) visit(child, depth + 1);
      };
      visit(tree as TechDocsMarkdownNode, 0);
      for (const transform of transforms)
        transform(tree as TechDocsMarkdownNode);
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: [...(defaultSchema.tagNames ?? []), 'aside'],
      attributes: {
        ...defaultSchema.attributes,
        details: [
          ...(defaultSchema.attributes?.details ?? []),
          [
            'className',
            'techdocs-tab',
            /^techdocs-(note|warn|warning|info|tip|success|danger|error|example|quote)$/,
          ],
        ],
        aside: [
          [
            'className',
            /^techdocs-(note|warn|warning|info|tip|success|danger|error|example|quote)$/,
          ],
        ],
        code: [
          [
            'className',
            /^language-[a-z0-9_-]+$/,
            'math-inline',
            'math-display',
          ],
        ],
        div: [['className', 'math', 'math-display']],
        span: [['className', 'math', 'math-inline']],
      },
    });
  const normalized = normalizeTechDocsMarkdown(source);
  const tree = processor.runSync(
    processor.parse(normalized),
  ) as TechDocsMarkdownNode;
  const headings: TechDocsHeading[] = [];
  const ids = new Map<string, number>();
  const anchors = new Map<string, string>();
  const visit = (node: TechDocsMarkdownNode) => {
    if (normalized !== source) delete node.position;
    const originalId = node.properties?.id;
    if (typeof originalId === 'string')
      anchors.set(originalId.replace(/^user-content-/, ''), originalId);
    if (/^h[1-6]$/.test(node.tagName ?? '')) {
      const title = techDocsNodeText(node);
      const base =
        typeof originalId === 'string'
          ? originalId.replace(/^user-content-/, '')
          : title
              .toLowerCase()
              .replace(/[^\p{L}\p{N}_\s-]/gu, '')
              .trim()
              .replace(/\s+/g, '-') || 'section';
      const count = ids.get(base) ?? 0;
      ids.set(base, count + 1);
      const id = `techdocs-${base}${count ? `_${count}` : ''}`;
      if (typeof originalId === 'string')
        anchors.set(
          originalId.replace(/^user-content-/, ''),
          id.replace(/^techdocs-/, ''),
        );
      node.properties = { ...node.properties, id };
      headings.push({ id, title, level: Number(node.tagName![1]) });
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(tree);
  const fixAnchors = (node: TechDocsMarkdownNode) => {
    const href = node.properties?.href;
    if (
      typeof href === 'string' &&
      href.startsWith('#') &&
      anchors.has(href.slice(1))
    ) {
      node.properties!.href = `#${anchors.get(href.slice(1))}`;
    }
    for (const child of node.children ?? []) fixAnchors(child);
  };
  fixAnchors(tree);
  return {
    tree,
    headings,
    text: techDocsNodeText(tree),
    title: headings[0]?.title,
  };
}
