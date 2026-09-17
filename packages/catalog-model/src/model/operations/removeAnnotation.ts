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

import { z } from 'zod/v3';

/**
 * Remove an annotation from the model.
 */
export const opRemoveAnnotationV1Schema = z.strictObject({
  op: z.literal('removeAnnotation.v1'),

  /**
   * The name of the annotation to remove, e.g. "backstage.io/techdocs-ref".
   */
  name: z.string(),
});

/** {@inheritDoc opRemoveAnnotationV1Schema} */
export type OpRemoveAnnotationV1 = z.infer<typeof opRemoveAnnotationV1Schema>;

/**
 * Creates a validated {@link OpRemoveAnnotationV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpRemoveAnnotationV1}.
 */
export function createRemoveAnnotationOp(
  input: Omit<OpRemoveAnnotationV1, 'op'> & { op?: never },
): OpRemoveAnnotationV1 {
  return opRemoveAnnotationV1Schema.parse({
    ...input,
    op: 'removeAnnotation.v1',
  });
}
