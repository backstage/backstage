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

import fs from 'fs-extra';
import { resolve as resolvePath, dirname } from 'path';
import Ajv from 'ajv';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import mergeAllOf, { Resolvers } from 'json-schema-merge-allof';
import { AppConfig, ConfigReader } from '@backstage/config';

const CONFIG_VISIBILITIES = ['frontend', 'backend', 'secret'] as const;

type ConfigVisibility = typeof CONFIG_VISIBILITIES[number];

type ConfigSchema = {
  load(appConfigs: AppConfig[]): AppConfig[];
};

type ConfigSchemaPackageEntry = {
  value: JSONSchema;
  path: string;
};

type Options = {
  dependencies: string[];
};

type ValidationError = string;

type ValidationResult = {
  errors?: ValidationError[];
  visibilities: Map<string, ConfigVisibility>;
};

type ValidationFunc = (configs: AppConfig[]) => ValidationResult;

export async function loadSchema(options: Options): Promise<ConfigSchema> {
  const start = process.hrtime();

  const schemas = await collectConfigSchemas(options.dependencies[0]);

  const [durS, durNs] = process.hrtime(start);
  const dur = (durS + durNs / 10 ** 9).toFixed(3);
  console.log(`DEBUG: collected config schemas in ${dur}s`);
  console.log('DEBUG: schemas =', schemas);

  const validate = compileConfigSchemas(schemas);

  return {
    load(configs: AppConfig[]): AppConfig[] {
      const result = validate(configs);
      console.log('DEBUG: result =', result);
      if (result.errors) {
        throw new Error(
          `Config validation failed, ${result.errors.join('; ')}`,
        );
      }

      return configs;
    },
  };
}

function compileConfigSchemas(
  schemas: ConfigSchemaPackageEntry[],
): ValidationFunc {
  const visibilities = new Map<string, ConfigVisibility>();

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
            if (visibility === 'frontend') {
              visibilities.set(ctx.dataPath, visibility);
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

    visibilities.clear();
    const valid = validate(config);
    if (!valid) {
      const errors = ajv.errorsText(validate.errors);
      return {
        errors: [errors],
        visibilities: new Map(),
      };
    }

    return {
      visibilities: new Map(visibilities),
    };
  };
}

const req =
  typeof __non_webpack_require__ === 'undefined'
    ? require
    : __non_webpack_require__;

async function collectConfigSchemas(
  name: string,
  opts: unknown = {},
  visited: Set<string> = new Set(),
  schemas: ConfigSchemaPackageEntry[] = [],
): Promise<ConfigSchemaPackageEntry[]> {
  const pkgPath = req.resolve(`${name}/package.json`, opts);
  if (visited.has(pkgPath)) {
    return schemas;
  }
  visited.add(pkgPath);
  const pkg = await fs.readJson(pkgPath);
  const depNames = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];

  // TODO(Rugvip): Trying this out to avoid having to traverse the full dependency graph,
  //               since that's pretty slow. We probably need a better way to determine when
  //               we've left the Backstage ecosystem, but this will do for now.
  const hasSchema = 'configSchema' in pkg;
  const hasBackstageDep = depNames.some(_ => _.startsWith('@backstage/'));
  if (!hasSchema && !hasBackstageDep) {
    return schemas;
  }
  if (hasSchema) {
    if (typeof pkg.configSchema === 'string') {
      if (!pkg.configSchema.endsWith('.json')) {
        throw new Error(
          `Config schema files must be .json, got ${pkg.configSchema}`,
        );
      }
      const value = await fs.readJson(
        resolvePath(dirname(pkgPath), pkg.configSchema),
      );
      schemas.push({
        value,
        path: pkgPath,
      });
    } else {
      schemas.push({
        value: pkg.configSchema,
        path: pkgPath,
      });
    }
  }

  for (const depName of depNames) {
    await collectConfigSchemas(depName, { paths: [pkgPath] }, visited, schemas);
  }

  return schemas;
}
