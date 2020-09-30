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
import { Entity } from '../entity';
import { EntityPolicy } from '../types';

export function schemaPolicy(
  kind: string,
  apiVersion: readonly string[],
  schema: yup.Schema<any>,
): EntityPolicy {
  return {
    async enforce(envelope: Entity): Promise<Entity | undefined> {
      if (
        kind !== envelope.kind ||
        !apiVersion.includes(envelope.apiVersion as any)
      ) {
        return undefined;
      }
      return await schema.validate(envelope, { strict: true });
    },
  };
}
