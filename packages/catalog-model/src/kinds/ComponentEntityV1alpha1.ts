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
import { schemaValidator } from './util';

const API_VERSION = ['backstage.io/v1alpha1', 'backstage.io/v1beta1'] as const;
const KIND = 'Component' as const;

const schema = yup.object<Partial<ComponentEntityV1alpha1>>({
  apiVersion: yup.string().required().oneOf(API_VERSION),
  kind: yup.string().required().equals([KIND]),
  spec: yup
    .object({
      type: yup.string().required().min(1),
      lifecycle: yup.string().required().min(1),
      owner: yup.string().required().min(1),
      subcomponentOf: yup.string().notRequired().min(1),
      providesApis: yup.array(yup.string().required()).notRequired(),
      consumesApis: yup.array(yup.string().required()).notRequired(),
      system: yup.string().notRequired().min(1),
    })
    .required(),
});

export interface ComponentEntityV1alpha1 extends Entity {
  apiVersion: typeof API_VERSION[number];
  kind: typeof KIND;
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    subcomponentOf?: string;
    providesApis?: string[];
    consumesApis?: string[];
    system?: string;
  };
}

export const componentEntityV1alpha1Validator = schemaValidator(
  KIND,
  API_VERSION,
  schema,
);
