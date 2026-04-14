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
 * Remove a label from the model.
 */
export const opRemoveLabelV1Schema = z.strictObject({
  op: z.literal('removeLabel.v1'),

  /**
   * The name of the label to remove, e.g. "backstage.io/source-location".
   */
  name: z.string(),
});

/** {@inheritDoc opRemoveLabelV1Schema} */
export type OpRemoveLabelV1 = z.infer<typeof opRemoveLabelV1Schema>;

/**
 * Creates a validated {@link OpRemoveLabelV1} operation instance.
 *
 * @remarks
 *
 * The `op` field is filled in automatically. The input is verified against the
 * schema before returning, ensuring that the resulting op is reliably valid.
 *
 * @param input - All fields of the op except `op` itself.
 * @returns A fully validated {@link OpRemoveLabelV1}.
 */
export function createRemoveLabelOp(
  input: Omit<OpRemoveLabelV1, 'op'> & { op?: never },
): OpRemoveLabelV1 {
  return opRemoveLabelV1Schema.parse({ ...input, op: 'removeLabel.v1' });
}
