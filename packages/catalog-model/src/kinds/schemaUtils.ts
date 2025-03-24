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

export function createEntitySchema<
  TApiVersion extends string,
  TKind extends string = string,
  TMetadata extends {} = {},
  TSpec extends {} = {},
>(
  creatorFn: (zImpl: typeof z) => {
    kind: z.ZodLiteral<TKind>;
    apiVersion?: z.ZodType<TApiVersion>;
    metadata?: z.ZodType<TMetadata>;
    spec: z.ZodType<TSpec>;
  },
): EntitySchema<TApiVersion, TKind, TMetadata, TSpec> {
  const options = creatorFn(z);

  return z
    .object({
      apiVersion: (options.apiVersion ??
        z.enum([
          'backstage.io/v1alpha1',
          'backstage.io/v1beta1',
        ])) as z.ZodType<TApiVersion>,
      kind: options.kind,
      spec: options.spec,
      ...(options.metadata && { metadata: options.metadata }),
    })
    .strict();
}

// ALTERNATIVE APPROACH. creatorFn must return a z.object({}) of entity shape
// ts complains if the object doesn't match but autocomplete is not so efficient as above

// export function createEntitySchema<
//   TApiVersion extends string,
//   TKind extends string,
//   TMetadata extends {},
//   TSpec extends {},
// >(
//   creatorFn: (zImpl: typeof z) => z.ZodObject<{
//     kind: z.ZodLiteral<TKind>;
//     apiVersion?: z.ZodType<TApiVersion>;
//     metadata?: z.ZodType<TMetadata>;
//     spec: z.ZodType<TSpec>;
//   }>,
// ) {
//   const options = creatorFn(z);

//   return z
//     .object({
//       apiVersion: z.enum(['backstage.io/v1alpha1', 'backstage.io/v1beta1']),
//       metadata: defaultEntityMetadataSchema,
//     })
//     .merge(options) as EntitySchema<TApiVersion, TKind, TMetadata, TSpec>;
// }

// export type EntitySchema = ReturnType<
//   typeof createEntitySchema<
//     [string, ...string[]],
//     string,
//     z.ZodObject<any, any>,
//     z.ZodObject<any, any>
//   >
// >;

export type EntitySchema<
  TApiVersion extends string = string,
  TKind extends string = string,
  TMetadata extends {} = {},
  TSpec extends {} = {},
> = z.ZodObject<{
  apiVersion: z.ZodType<TApiVersion>;
  kind: z.ZodLiteral<TKind>;
  metadata?: z.ZodType<TMetadata>;
  spec: z.ZodType<TSpec>;
}>;

// export type EntitySchema<
//   TApiVersion extends string = string,
//   TKind extends string = string,
//   TMetadata extends {} = {},
//   TSpec extends {} = {},
// > = z.ZodObject<{
//   apiVersion: TApiVersion;
//   kind: TKind extends string ? (string extends TKind ? never : TKind) : never;
//   metadata?: TMetadata;
//   spec: TSpec;
// }>;

export function schemasToParser(
  schemas: EntitySchema[],
  customMetadataSchema: z.ZodObject<any, any> | undefined,
) {
  const entitySchemas = Array.from(
    new Map(schemas.map(s => [s.shape.kind, s])).values(),
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
