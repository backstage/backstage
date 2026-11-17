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

import { createHash } from 'node:crypto';

/** A literal path fragment or a dynamic value that must be digested. */
export type DestinationTemplatePart =
  | Readonly<{ literal: string }>
  | Readonly<{ digest: string }>;

/**
 * A route's static skeleton and its explicitly redacted dynamic values.
 * Host names are bound by the trusted producer, not by the template.
 */
export type DestinationTemplate = readonly DestinationTemplatePart[];

type CompiledTemplate = (path: string) => string | undefined;

/** Validate once at registration; no dynamic part can be emitted in cleartext. */
export function compileDestinationTemplate(
  template: DestinationTemplate,
): CompiledTemplate {
  if (!Array.isArray(template) || template.length === 0) {
    throw new Error('Invalid destination template: expected a nonempty path');
  }
  const names = new Set<string>();
  let previousDynamic = false;
  const render: Array<string | { digest: string }> = [];
  for (const [index, part] of template.entries()) {
    if (!part || typeof part !== 'object' || Array.isArray(part)) {
      throw new Error('Invalid destination template part');
    }
    const keys = Object.keys(part);
    if (keys.length === 1 && keys[0] === 'literal') {
      const value = (part as { literal: unknown }).literal;
      if (
        typeof value !== 'string' ||
        !/^[A-Za-z0-9._~:/-]+$/.test(value) ||
        (index === 0 && !value.startsWith('/'))
      ) {
        throw new Error('Invalid destination template literal');
      }
      render.push(value);
      previousDynamic = false;
    } else if (keys.length === 1 && keys[0] === 'digest') {
      const name = (part as { digest: unknown }).digest;
      if (
        index === 0 ||
        previousDynamic ||
        typeof name !== 'string' ||
        !/^[a-z][a-z0-9_-]{0,31}$/.test(name) ||
        names.has(name)
      ) {
        throw new Error('Invalid destination template dynamic value');
      }
      names.add(name);
      render.push({ digest: name });
      previousDynamic = true;
    } else {
      throw new Error('Invalid destination template part');
    }
  }
  return path => {
    let offset = 0;
    let result = '';
    for (const [index, part] of render.entries()) {
      if (typeof part === 'string') {
        if (!path.startsWith(part, offset)) return undefined;
        offset += part.length;
        result += part;
      } else {
        const next = render[index + 1];
        let end = path.length;
        if (typeof next === 'string') {
          end =
            index + 2 === render.length
              ? path.length - next.length
              : path.indexOf(next, offset + 1);
        }
        if (end <= offset) return undefined;
        const digest = createHash('sha256')
          .update(path.slice(offset, end))
          .digest('hex')
          .slice(0, 16);
        result += `{${part.digest}=${digest}}`;
        offset = end;
      }
    }
    return offset === path.length ? result : undefined;
  };
}
