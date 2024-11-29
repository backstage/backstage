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

import Ajv from 'ajv';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import mergeAllOf, { Resolvers } from 'json-schema-merge-allof';
import traverse from 'json-schema-traverse';
import { ConfigReader } from '@backstage/config';
import {
  ConfigSchemaPackageEntry,
  ValidationFunc,
  CONFIG_VISIBILITIES,
  ConfigVisibility,
} from './types';
import { SchemaObject } from 'json-schema-traverse';
import { normalizeAjvPath } from './utils';

// Used to keep track of the internal deepVisibility inherited through the schema.
const inheritedVisibility = Symbol('inherited-visibility');

/**
 * This takes a collection of Backstage configuration schemas from various
 * sources and compiles them down into a single schema validation function.
 *
 * It also handles the implementation of the custom "visibility" keyword used
 * to specify the scope of different config paths.
 */
export function compileConfigSchemas(
  schemas: ConfigSchemaPackageEntry[],
  options?: {
    noUndeclaredProperties?: boolean;
  },
): ValidationFunc {
  // The ajv instance below is stateful and doesn't really allow for additional
  // output during validation. We work around this by having this extra piece
  // of state that we reset before each validation.
  const visibilityByDataPath = new Map<string, ConfigVisibility>();
  const deepVisibilityByDataPath = new Map<string, ConfigVisibility>();
  const deprecationByDataPath = new Map<string, string>();

  const ajv = new Ajv({
    allErrors: true,
    allowUnionTypes: true,
    coerceTypes: true,
    schemas: {
      'https://backstage.io/schema/config-v1': true,
    },
  })
    .addKeyword({
      keyword: 'visibility',
      metaSchema: {
        type: 'string',
        enum: CONFIG_VISIBILITIES,
      },
      compile(visibility: ConfigVisibility) {
        return (_data, context) => {
          if (context?.instancePath === undefined) {
            return false;
          }
          if (visibility && visibility !== 'backend') {
            const normalizedPath = normalizeAjvPath(context.instancePath);
            visibilityByDataPath.set(normalizedPath, visibility);
          }
          return true;
        };
      },
    })
    .addKeyword({
      keyword: 'deepVisibility',
      metaSchema: {
        type: 'string',
        /**
         * Disallow 'backend' deepVisibility to prevent cases of permission escaping.
         *
         * Something like:
         * - deepVisibility secret -> backend -> frontend.
         * - deepVisibility secret -> backend -> visibility frontend.
         */
        enum: ['frontend', 'secret'],
      },
      compile(visibility: 'frontend' | 'secret') {
        return (_data, context) => {
          if (context?.instancePath === undefined) {
            return false;
          }
          if (visibility) {
            const normalizedPath = normalizeAjvPath(context.instancePath);
            deepVisibilityByDataPath.set(normalizedPath, visibility);
          }
          return true;
        };
      },
    })
    .removeKeyword('deprecated') // remove `deprecated` keyword so that we can implement our own compiler
    .addKeyword({
      keyword: 'deprecated',
      metaSchema: { type: 'string' },
      compile(deprecationDescription: string) {
        return (_data, context) => {
          if (context?.instancePath === undefined) {
            return false;
          }
          const normalizedPath = normalizeAjvPath(context.instancePath);
          // create mapping of deprecation description and data path of property
          deprecationByDataPath.set(normalizedPath, deprecationDescription);
          return true;
        };
      },
    });

  for (const schema of schemas) {
    try {
      ajv.compile(schema.value);
    } catch (error) {
      throw new Error(`Schema at ${schema.path} is invalid, ${error}`);
    }
  }

  const merged = mergeConfigSchemas(schemas.map(_ => _.value));

  traverse(
    merged,
    (
      schema: SchemaObject & { [inheritedVisibility]?: ConfigVisibility },
      jsonPtr: string,
      _1: any,
      _2: any,
      _3?: any,
      parentSchema?: SchemaObject & {
        [inheritedVisibility]?: ConfigVisibility;
      },
    ) => {
      // Inherit parent deepVisibility if we don't define one ourselves.
      // This is used to detect situations where conflicting deep visibilities are set.
      schema[inheritedVisibility] ??=
        schema?.deepVisibility ?? parentSchema?.[inheritedVisibility];

      if (schema[inheritedVisibility]) {
        // Validate that we're not trying to set a conflicting visibility. This can be done
        // either by setting a conflicting visibility directly or deep visibility
        const values = [
          schema.visibility,
          schema[inheritedVisibility],
          parentSchema?.[inheritedVisibility],
        ];
        const hasFrontend = values.some(e => e === 'frontend');
        const hasSecret = values.some(e => e === 'secret');
        if (hasFrontend && hasSecret) {
          throw new Error(
            `Config schema visibility is both 'frontend' and 'secret' for ${jsonPtr}`,
          );
        }
      }

      if (options?.noUndeclaredProperties) {
        /**
         * The `additionalProperties` key can only be applied to `type: object` in the JSON
         *  schema.
         */
        if (schema?.type === 'object') {
          schema.additionalProperties ||= false;
        }
      }
    },
  );

  const validate = ajv.compile(merged);

  const visibilityBySchemaPath = new Map<string, ConfigVisibility>();
  traverse(merged, (schema, path) => {
    if (schema.visibility && schema.visibility !== 'backend') {
      visibilityBySchemaPath.set(normalizeAjvPath(path), schema.visibility);
    }
    if (schema.deepVisibility) {
      visibilityBySchemaPath.set(normalizeAjvPath(path), schema.deepVisibility);
    }
  });

  return configs => {
    const config = ConfigReader.fromConfigs(configs).getOptional();

    visibilityByDataPath.clear();
    deepVisibilityByDataPath.clear();

    const valid = validate(config);

    if (!valid) {
      return {
        errors: validate.errors ?? [],
        visibilityByDataPath: new Map(visibilityByDataPath),
        deepVisibilityByDataPath: new Map(deepVisibilityByDataPath),
        visibilityBySchemaPath,
        deprecationByDataPath,
      };
    }

    return {
      visibilityByDataPath: new Map(visibilityByDataPath),
      deepVisibilityByDataPath: new Map(deepVisibilityByDataPath),
      visibilityBySchemaPath,
      deprecationByDataPath,
    };
  };
}

/**
 * Given a list of configuration schemas from packages, merge them
 * into a single json schema.
 *
 * @public
 */
export function mergeConfigSchemas(schemas: JSONSchema[]): JSONSchema {
  const merged = mergeAllOf(
    { allOf: schemas },
    {
      // JSONSchema is typically subtractive, as in it always reduces the set of allowed
      // inputs through constraints. This changes the object property merging to be additive
      // rather than subtractive.
      ignoreAdditionalProperties: true,
      resolvers: {
        // This ensures that the visibilities across different schemas are sound, and
        // selects the most specific visibility for each path.
        visibility(values: string[], path: string[]) {
          const hasFrontend = values.some(_ => _ === 'frontend');
          const hasSecret = values.some(_ => _ === 'secret');
          if (hasFrontend && hasSecret) {
            throw new Error(
              `Config schema visibility is both 'frontend' and 'secret' for ${path.join(
                '/',
              )}`,
            );
          } else if (hasFrontend) {
            return 'frontend';
          } else if (hasSecret) {
            return 'secret';
          }

          return 'backend';
        },
      } as Partial<Resolvers<JSONSchema>>,
    },
  );
  return merged;
}
