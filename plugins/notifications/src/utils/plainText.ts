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

const HTML_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

/** @public */
export function toPlainText(text: string): string {
  const withoutHtml = text.replace(/<[^>]*>/g, ' ');
  const withoutEntities = withoutHtml.replace(
    /&(?:amp|lt|gt|quot|#39|nbsp);/g,
    entity => HTML_ENTITY_MAP[entity] ?? entity,
  );

  return withoutEntities
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** @public */
export function truncateText(
  text: string,
  maxChars: number,
): { display: string; truncated: boolean; full: string } {
  const full = toPlainText(text);

  if (full.length <= maxChars) {
    return { display: full, truncated: false, full };
  }

  return {
    display: `${full.slice(0, maxChars)}...`,
    truncated: true,
    full,
  };
}
