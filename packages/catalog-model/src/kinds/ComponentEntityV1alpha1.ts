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
import schema from '../schema/kinds/Component.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * Backstage catalog Component kind Entity. Represents a single, individual piece of software.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ComponentEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  kind: 'Component';
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    subcomponentOf?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    system?: string;
    /**
     * A list of entity refs with kind=Environment, that this component is deployed to.
     */
    deploysToEnvironments?: string[];

    /**
     * A map of Environment entity ref to entity metadata to override in that environment. By default,
     *  a Component's metadata reflects their production deployment.
     */
    environmentOverrides?: Record<
      string,
      {
        annotations: Record<string, string>;
      }
    >;
  };
}

/**
 * {@link KindValidator} for {@link ComponentEntityV1alpha1}.
 *
 * @public
 */
export const componentEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);
