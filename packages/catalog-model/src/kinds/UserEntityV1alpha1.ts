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
const KIND = 'User' as const;

const schema = yup.object<Partial<UserEntityV1alpha1>>({
  apiVersion: yup.string().required().oneOf(API_VERSION),
  kind: yup.string().required().equals([KIND]),
  spec: yup
    .object({
      profile: yup
        .object({
          displayName: yup.string().min(1).notRequired(),
          email: yup.string().min(1).notRequired(),
          picture: yup.string().min(1).notRequired(),
        })
        .notRequired(),
      // Use this manual test because yup .required() requires at least one
      // element and there is no simple workaround -_-
      // the cast is there to convince typescript that the array itself is
      // required without using .required()
      memberOf: yup.array(yup.string().required()).test({
        name: 'isDefined',
        message: 'memberOf must be defined',
        test: v => Boolean(v),
      }) as yup.ArraySchema<string, object>,
    })
    .required(),
});

export interface UserEntityV1alpha1 extends Entity {
  apiVersion: typeof API_VERSION[number];
  kind: typeof KIND;
  spec: {
    profile?: {
      displayName?: string;
      email?: string;
      picture?: string;
    };
    memberOf: string[];
  };
}

export const userEntityV1alpha1Validator = schemaValidator(
  KIND,
  API_VERSION,
  schema,
);
