/*
 * Copyright 2020 Spotify AB
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

import * as yup from 'yup';

export type DescriptorEnvelope = {
  apiVersion: string;
  kind: string;
  metadata?: object;
  spec?: object;
};

// The schema of the envelope that's common to all versions/kinds
const descriptorEnvelopeSchema: yup.Schema<DescriptorEnvelope> = yup
  .object({
    apiVersion: yup.string().required(),
    kind: yup.string().required(),
    metadata: yup.object(),
    spec: yup.object(),
  })
  .noUnknown();

// Validate some raw structured data as a descriptor envelope
export async function parseDescriptorEnvelope(
  data: object,
): Promise<DescriptorEnvelope> {
  try {
    return await descriptorEnvelopeSchema.validate(data, { strict: true });
  } catch (e) {
    throw new Error(`Malformed envelope, ${e}`);
  }
}
