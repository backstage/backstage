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

import Ajv from 'ajv';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import mergeAllOf, { Resolvers } from 'json-schema-merge-allof';
import { ConfigReader } from '@backstage/config';
import {
  ConfigSchemaPackageEntry,
  ValidationFunc,
  CONFIG_VISIBILITIES,
  ConfigVisibility,
} from './types';

export function compileConfigSchemas(
  schemas: ConfigSchemaPackageEntry[],
): ValidationFunc {
  const visibilityByPath = new Map<string, ConfigVisibility>();

  const ajv = new Ajv({
    strict: true,
    allErrors: true,
    defaultMeta: 'http://json-schema.org/draft-07/schema#',
    schemas: {
      'https://backstage.io/schema/config-v1': true,
    },
    keywords: [
      {
        keyword: 'visibility',
        schemaType: 'string',
        metaSchema: {
          type: 'string',
          enum: CONFIG_VISIBILITIES,
        },
        compile(visibility: ConfigVisibility) {
          return (_data, ctx) => {
            if (!ctx) {
              return false;
            }
            if (visibility) {
              visibilityByPath.set(ctx.dataPath, visibility);
            }
            return true;
          };
        },
      },
    ],
  });

  const merged = mergeAllOf(
    { allOf: schemas.map(_ => _.value) },
    {
      ignoreAdditionalProperties: true,
      resolvers: {
        visibility(values: string[], path: string[]) {
          const hasApp = values.some(_ => _ === 'frontend');
          const hasSecret = values.some(_ => _ === 'secret');
          if (hasApp && hasSecret) {
            throw new Error(
              `Config schema visibility is both 'frontend' and 'secret' for ${path.join(
                '/',
              )}`,
            );
          } else if (hasApp) {
            return 'frontend';
          } else if (hasSecret) {
            return 'secret';
          }

          return 'backend';
        },
      } as Partial<Resolvers<JSONSchema>>,
    },
  );

  const validate = ajv.compile(merged);

  return configs => {
    const config = ConfigReader.fromConfigs(configs).get();

    visibilityByPath.clear();

    const valid = validate(config);
    if (!valid) {
      const errors = ajv.errorsText(validate.errors);
      return {
        errors: [errors],
        visibilityByPath: new Map(),
      };
    }

    return {
      visibilityByPath: new Map(visibilityByPath),
    };
  };
}
