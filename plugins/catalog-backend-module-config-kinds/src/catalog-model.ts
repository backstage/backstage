/*
 * Copyright 2024 The Backstage Authors
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

import type { CatalogModelRegistry } from '@backstage/catalog-model-extensions';
import type { Config } from '@backstage/config';
import type { ConfigKindDef, ConfigFieldDef } from './configToSchema';
import { configFieldToZodSchema } from './configToSchema';

/**
 * Reads catalog.customKinds from config and registers them as catalog kinds.
 * This is the build-time registration function used by the generator.
 */
export default function registerConfigKinds(
  registry: CatalogModelRegistry,
  config?: Config,
) {
  if (!config) {
    return;
  }

  const customKindsConfig = config.getOptionalConfigArray(
    'catalog.customKinds',
  );
  if (!customKindsConfig) {
    return;
  }

  const customKinds: ConfigKindDef[] = customKindsConfig.map(kindConfig => ({
    apiVersion: kindConfig.getString('apiVersion'),
    names: {
      kind: kindConfig.getString('names.kind'),
      singular: kindConfig.getString('names.singular'),
      plural: kindConfig.getString('names.plural'),
      shortNames: kindConfig.getOptionalStringArray('names.shortNames'),
    },
    description: kindConfig.getOptionalString('description'),
    categories: kindConfig.getOptionalStringArray('categories'),
    schema: readSchemaConfig(kindConfig),
  }));

  for (const kindDef of customKinds) {
    registry.createKind({
      apiVersion: kindDef.apiVersion,
      names: kindDef.names,
      description: kindDef.description,
      categories: kindDef.categories,
      schema: z => {
        const spec: Record<string, any> = {};
        for (const [fieldName, fieldDef] of Object.entries(
          kindDef.schema.spec,
        )) {
          spec[fieldName] = configFieldToZodSchema(z, fieldDef);
        }

        const metadata: Record<string, any> = {};
        if (kindDef.schema.metadata?.annotations) {
          const annotations: Record<string, any> = {};
          for (const [key, fieldDef] of Object.entries(
            kindDef.schema.metadata.annotations,
          )) {
            annotations[key] = configFieldToZodSchema(z, fieldDef);
          }
          metadata.annotations = annotations;
        }
        if (kindDef.schema.metadata?.labels) {
          const labels: Record<string, any> = {};
          for (const [key, fieldDef] of Object.entries(
            kindDef.schema.metadata.labels,
          )) {
            labels[key] = configFieldToZodSchema(z, fieldDef);
          }
          metadata.labels = labels;
        }

        return { spec, metadata };
      },
    });
  }
}

function readSchemaConfig(kindConfig: Config): ConfigKindDef['schema'] {
  const specConfig = kindConfig.getConfig('schema.spec');
  const spec: Record<string, ConfigFieldDef> = {};

  for (const key of specConfig.keys()) {
    spec[key] = readFieldConfig(specConfig.getConfig(key));
  }

  const result: ConfigKindDef['schema'] = { spec };

  const annotationsConfig = kindConfig.getOptionalConfig(
    'schema.metadata.annotations',
  );
  if (annotationsConfig) {
    result.metadata = result.metadata ?? {};
    result.metadata.annotations = {};
    for (const key of annotationsConfig.keys()) {
      result.metadata.annotations[key] = readFieldConfig(
        annotationsConfig.getConfig(key),
      );
    }
  }

  const labelsConfig = kindConfig.getOptionalConfig('schema.metadata.labels');
  if (labelsConfig) {
    result.metadata = result.metadata ?? {};
    result.metadata.labels = {};
    for (const key of labelsConfig.keys()) {
      result.metadata.labels[key] = readFieldConfig(
        labelsConfig.getConfig(key),
      );
    }
  }

  return result;
}

function readFieldConfig(fieldConfig: Config): ConfigFieldDef {
  const def: ConfigFieldDef = {
    type: fieldConfig.getString('type') as ConfigFieldDef['type'],
    description: fieldConfig.getOptionalString('description'),
    optional: fieldConfig.getOptionalBoolean('optional'),
    values: fieldConfig.getOptionalStringArray('values'),
  };

  const kind = fieldConfig.getOptionalStringArray('kind');
  if (kind) {
    def.kind = kind;
  } else {
    const singleKind = fieldConfig.getOptionalString('kind');
    if (singleKind) {
      def.kind = singleKind;
    }
  }

  const relationsConfig = fieldConfig.getOptionalConfig('relations');
  if (relationsConfig) {
    def.relations = {
      forward: relationsConfig.getString('forward'),
      reverse: relationsConfig.getString('reverse'),
    };
  }

  return def;
}
