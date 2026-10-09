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

import { z } from 'zod';

/** @alpha */
export const TECHDOCS_SOURCE_MANIFEST = '_techdocs/source/manifest.json';

/** @alpha */
export type TechDocsPublishingMode = 'legacy' | 'dual' | 'source';
/** @alpha */
export type TechDocsRenderingMode =
  | 'legacy'
  | 'opt-in'
  | 'prefer-source'
  | 'source';

const safePath = z
  .string()
  .min(1)
  .max(1024)
  .refine(
    value =>
      !/[\\%?#:]/.test(value) &&
      !Array.from(value).some(c => c.charCodeAt(0) < 32) &&
      value.split('/').every(part => part && part !== '.' && part !== '..'),
    'Expected a relative documentation path',
  );

/** @alpha */
export type TechDocsNavigation = {
  title: string;
  path?: string;
  children?: TechDocsNavigation[];
};
const navigation: z.ZodType<TechDocsNavigation> = z.lazy(() =>
  z.object({
    title: z.string().max(1024),
    path: safePath.optional(),
    children: z.array(navigation).max(10000).optional(),
  }),
);

/** The published, data-only source format. Unknown versions must not fall back to HTML. @alpha */
export const techDocsSourceManifestSchema = z.object({
  version: z.literal(1),
  available: z.boolean(),
  legacy: z.boolean(),
  optedIn: z.boolean(),
  title: z.string().max(1024),
  pages: z
    .array(
      z.object({
        path: safePath,
        route: z
          .string()
          .max(1024)
          .refine(
            value =>
              value === '' ||
              (value.endsWith('/') &&
                safePath.safeParse(value.slice(0, -1)).success),
            'Expected a relative page route',
          ),
        title: z.string().max(1024),
        file: z
          .string()
          .regex(/^_techdocs\/source\/files\/[a-f0-9]{64}\.json$/),
      }),
    )
    .max(10000),
  assets: z
    .array(
      z.object({
        path: safePath,
        file: z
          .string()
          .regex(/^_techdocs\/source\/files\/[a-f0-9]{64}\.json$/),
      }),
    )
    .max(10000),
  nav: z
    .unknown()
    .superRefine((value, ctx) => {
      const pending = [{ value, depth: 0 }];
      let count = 0;
      while (pending.length) {
        const item = pending.pop()!;
        if (++count > 20000 || item.depth > 30) {
          ctx.addIssue({
            code: 'custom',
            message: 'Navigation exceeds nesting or size limits',
          });
          return;
        }
        if (Array.isArray(item.value)) {
          for (const entry of item.value) {
            if (entry && typeof entry === 'object' && 'children' in entry)
              pending.push({ value: entry.children, depth: item.depth + 1 });
          }
        }
      }
    })
    .pipe(z.array(navigation).max(10000)),
  diagnostics: z.array(z.string().max(2048)).max(1000),
});
/** @alpha */
export type TechDocsSourceManifest = z.infer<
  typeof techDocsSourceManifestSchema
>;

/** @alpha */
export function selectTechDocsRenderer(
  policy: TechDocsRenderingMode,
  manifest?: TechDocsSourceManifest,
  preview?: string | null,
): 'legacy' | 'source' {
  if (policy === 'source') return 'source';
  if (preview === 'source' && manifest?.available) return 'source';
  if (preview === 'legacy' && manifest?.legacy) return 'legacy';
  if (
    manifest?.available &&
    (policy === 'prefer-source' || (policy === 'opt-in' && manifest.optedIn))
  )
    return 'source';
  return 'legacy';
}
