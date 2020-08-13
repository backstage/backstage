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
import type { Entity } from '../entity/Entity';
import type { EntityPolicy } from '../types';

const API_VERSION = ['backstage.io/v1alpha1', 'backstage.io/v1beta1'] as const;
const KIND = 'Component' as const;

export interface ComponentEntityV1alpha1 extends Entity {
  apiVersion: typeof API_VERSION[number];
  kind: typeof KIND;
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    implementsApis?: string[];
  };
}

export class ComponentEntityV1alpha1Policy implements EntityPolicy {
  private schema: yup.Schema<any>;

  constructor() {
    this.schema = yup.object<Partial<ComponentEntityV1alpha1>>({
      apiVersion: yup.string().required().oneOf(API_VERSION),
      kind: yup.string().required().equals([KIND]),
      spec: yup
        .object({
          type: yup.string().required().min(1),
          lifecycle: yup.string().required().min(1),
          owner: yup.string().required().min(1),
          implementsApis: yup.array(yup.string()).notRequired(),
        })
        .required(),
    });
  }

  async enforce(envelope: Entity): Promise<Entity> {
    return await this.schema.validate(envelope, { strict: true });
  }
}
