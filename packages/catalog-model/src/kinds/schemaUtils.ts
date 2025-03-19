/*
 * Copyright 2025 The Backstage Authors
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

import { Entity } from '../entity/Entity';
import { z } from 'zod';
import { defaultEntityMetadataSchema } from './metadata';

// export function createEntitySchema<
//   TApiVersion extends [string, ...string[]],
//   TKind extends string,
//   TMetadata extends z.ZodObject<any, any>,
//   TSpec extends z.ZodObject<any, any>,
// >(options: {
//   kind: z.ZodLiteral<TKind>;
//   apiVersion?: z.ZodEnum<TApiVersion>;
//   metadata?: TMetadata;
//   spec: TSpec;
// }) {
//   return z
//     .object({
//       apiVersion:
//         options.apiVersion ??
//         z.enum(['backstage.io/v1alpha1', 'backstage.io/v1beta1']),
//       kind: options.kind,
//       spec: options.spec,
//       metadata: options.metadata ?? defaultEntityMetadataSchema,
//     })
//     .strict();
// }

export function createEntitySchema<
  TApiVersion extends [string, ...string[]],
  TKind extends string,
  TMetadata extends z.ZodObject<any, any>,
  TSpec extends z.ZodObject<any, any>,
>(
  creatorFn: (zImpl: typeof z) => {
    kind: z.ZodLiteral<TKind>;
    apiVersion?: z.ZodEnum<TApiVersion>;
    metadata?: TMetadata;
    spec: TSpec;
  },
) {
  const options = creatorFn(z);

  return z
    .object({
      apiVersion:
        options.apiVersion ??
        z.enum(['backstage.io/v1alpha1', 'backstage.io/v1beta1']),
      kind: options.kind,
      spec: options.spec,
      metadata: options.metadata ?? defaultEntityMetadataSchema,
    })
    .strict();
}

export type EntitySchema = ReturnType<
  typeof createEntitySchema<
    [string, ...string[]],
    string,
    z.ZodObject<any, any>,
    z.ZodObject<any, any>
  >
>;

export function schemasToParser(
  schemas: EntitySchema[],
  customMetadataSchema: z.ZodObject<any, any> | undefined,
) {
  const entitySchemas = Array.from(
    new Map(schemas.map(s => [s.shape.kind.value, s])).values(),
  ).map(schema =>
    customMetadataSchema
      ? schema.extend({
          metadata: customMetadataSchema,
        })
      : schema,
  );

  const union = z.discriminatedUnion(
    'kind',
    entitySchemas as [EntitySchema, ...EntitySchema[]],
  );

  return {
    safeParse: (input: any) => union.safeParse(input),
  } as EntityValidator;
}

/**
 * @public
 */
export type EntityValidator = {
  safeParse(input: any):
    | {
        success: true;
        data: Entity;
        error?: never;
      }
    | {
        success: false;
        error: AggregateError;
        data?: never;
      };
};
