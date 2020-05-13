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
import { DescriptorEnvelope } from './envelope';
import { Component } from '../catalog/types';

export type ComponentDescriptor = {
  metadata: {
    name: string;
  };
  spec: {
    type: string;
  };
};

const componentDescriptorSchema: yup.Schema<ComponentDescriptor> = yup.object({
  metadata: yup.object({
    name: yup.string().required(),
  }),
  spec: yup.object({
    type: yup.string().required(),
  }),
});

export async function parseComponentDescriptor(
  envelope: DescriptorEnvelope,
): Promise<Component[]> {
  let componentDescriptor;
  try {
    componentDescriptor = await componentDescriptorSchema.validate(envelope, {
      strict: true,
    });
  } catch (e) {
    throw new Error(`Malformed component, ${e}`);
  }

  const component: Component = {
    name: componentDescriptor.metadata.name,
  };

  return [component];
}
