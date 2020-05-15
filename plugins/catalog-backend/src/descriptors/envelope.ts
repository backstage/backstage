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

import yaml from 'yaml';
import * as yup from 'yup';

export type DescriptorEnvelope = {
  apiVersion: string;
  kind: string;
  metadata?: object;
  spec?: object;
};

const descriptorEnvelopeSchema: yup.Schema<DescriptorEnvelope> = yup
  .object({
    apiVersion: yup.string().required(),
    kind: yup.string().required(),
    metadata: yup.object(),
    spec: yup.object(),
  })
  .noUnknown();

export async function parseDescriptorEnvelope(
  rawYaml: string,
): Promise<DescriptorEnvelope> {
  let descriptor;
  try {
    descriptor = yaml.parse(rawYaml);
  } catch (e) {
    throw new Error(`Malformed YAML, ${e}`);
  }

  try {
    return await descriptorEnvelopeSchema.validate(descriptor, {
      strict: true,
    });
  } catch (e) {
    throw new Error(`Malformed envelope, ${e}`);
  }
}
