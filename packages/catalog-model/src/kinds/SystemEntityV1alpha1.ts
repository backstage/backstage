/*
 * Copyright 2020 The Backstage Authors
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

import type { Entity } from '../entity/Entity';
import { ajvCompiledJsonSchemaValidator } from './util';
import schema from '../schema/kinds/System.v1alpha1.schema.json';

/**
 * Backstage catalog System kind Entity. Systems group Components, Resources and APIs together.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface SystemEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'System';
  spec: {
    owner: string;
    domain?: string;
    type?: string;
  };
}

/**
 * {@link KindValidator} for {@link SystemEntityV1alpha1}.
 *
 * @public
 */
export const systemEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);
