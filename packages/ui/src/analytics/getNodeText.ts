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

import { type ReactNode, isValidElement, Children } from 'react';

/**
 * Recursively extracts text content from a React node tree.
 * Returns undefined if no text content is found (e.g. icon-only children
 * or render functions).
 *
 * @public
 */
export function getNodeText(
  node: ReactNode | ((...args: any[]) => ReactNode),
): string | undefined {
  if (typeof node === 'function') {
    return undefined;
  }
  if (Array.isArray(node)) {
    const text = Children.map(node, getNodeText)?.filter(Boolean).join(' ');
    return text || undefined;
  }
  if (isValidElement(node)) {
    return getNodeText(node.props.children);
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  return undefined;
}
