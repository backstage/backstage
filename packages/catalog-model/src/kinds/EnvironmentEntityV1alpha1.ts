/*
 * Copyright 2023 The Backstage Authors
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
import { Entity } from '../entity';
import schema from '../schema/kinds/Environment.v1alpha1.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * Backstage catalog Environment kind Entity. Represents a single static location that software is deployed to.
 * Component lifecycle is tied to Environment lifecycle, a component should be deployed through an environment.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface EnvironmentEntityV1alpha1 extends Entity {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Environment';
}

/**
 * {@link KindValidator} for {@link ComponentEntityV1alpha1}.
 *
 * @public
 */
export const environmentEntityV1alpha1Validator =
  ajvCompiledJsonSchemaValidator(schema);
