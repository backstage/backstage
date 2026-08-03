/*
 * Copyright 2026 The Backstage Authors
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
import { z } from 'zod';

export const capabilities = [
  'entity-card',
  'entity-content',
  'standalone-page',
  'home-page',
  'search-result',
  'techdocs-addon',
  'catalog-processor',
  'catalog-provider',
  'scaffolder-actions',
  'search-collator',
  'backend-module',
  'permissions',
  'signals',
] as const;

export type Capability = (typeof capabilities)[number];
export type SnapshotStatus = 'fresh' | 'stale' | 'unavailable';

type ConfigUi = {
  label?: string;
  secretEnv?: string;
};

type StringConfigSchema = {
  type: 'string';
  enum?: string[];
  default?: string;
  description?: string;
  'x-ui'?: ConfigUi;
};

type NumberConfigSchema = {
  type: 'number';
  enum?: number[];
  default?: number;
  description?: string;
  'x-ui'?: ConfigUi;
};

type IntegerConfigSchema = {
  type: 'integer';
  enum?: number[];
  default?: number;
  description?: string;
  'x-ui'?: ConfigUi;
};

type BooleanConfigSchema = {
  type: 'boolean';
  enum?: boolean[];
  default?: boolean;
  description?: string;
  'x-ui'?: ConfigUi;
};

type ObjectConfigSchema = {
  type: 'object';
  properties: Record<string, ConfigSchema>;
  required?: string[];
  description?: string;
  'x-ui'?: ConfigUi;
};

type ArrayConfigSchema = {
  type: 'array';
  items: ConfigSchema;
  description?: string;
  'x-ui'?: ConfigUi;
};

export type ConfigSchema =
  | StringConfigSchema
  | NumberConfigSchema
  | IntegerConfigSchema
  | BooleanConfigSchema
  | ObjectConfigSchema
  | ArrayConfigSchema;

const configUiSchema = z.strictObject({
  label: z.string().min(1).optional(),
  secretEnv: z.string().min(1).optional(),
});

const configDescriptionSchema = z.string().min(1).optional();

const configSchema: z.ZodType<ConfigSchema> = z.lazy(() =>
  z
    .discriminatedUnion('type', [
      z.strictObject({
        type: z.literal('string'),
        enum: z.array(z.string()).optional(),
        default: z.string().optional(),
        description: configDescriptionSchema,
        'x-ui': configUiSchema.optional(),
      }),
      z.strictObject({
        type: z.literal('number'),
        enum: z.array(z.number()).optional(),
        default: z.number().optional(),
        description: configDescriptionSchema,
        'x-ui': configUiSchema.optional(),
      }),
      z.strictObject({
        type: z.literal('integer'),
        enum: z.array(z.number().int()).optional(),
        default: z.number().int().optional(),
        description: configDescriptionSchema,
        'x-ui': configUiSchema.optional(),
      }),
      z.strictObject({
        type: z.literal('boolean'),
        enum: z.array(z.boolean()).optional(),
        default: z.boolean().optional(),
        description: configDescriptionSchema,
        'x-ui': configUiSchema.optional(),
      }),
      z
        .strictObject({
          type: z.literal('object'),
          properties: z.record(z.string(), configSchema),
          required: z.array(z.string()).optional(),
          description: configDescriptionSchema,
          'x-ui': configUiSchema.optional(),
        })
        .superRefine((node, context) => {
          const requiredNames = new Set<string>();

          for (const [index, name] of (node.required ?? []).entries()) {
            if (requiredNames.has(name)) {
              context.addIssue({
                code: 'custom',
                message: `required field "${name}" is duplicated`,
                path: ['required', index],
              });
            }
            requiredNames.add(name);

            if (
              !Object.prototype.hasOwnProperty.call(node.properties, name)
            ) {
              context.addIssue({
                code: 'custom',
                message: `required field "${name}" is not declared`,
                path: ['required', index],
              });
            }
          }
        }),
      z.strictObject({
        type: z.literal('array'),
        items: configSchema,
        description: configDescriptionSchema,
        'x-ui': configUiSchema.optional(),
      }),
    ])
    .superRefine((node, context) => {
      if (!node['x-ui']?.secretEnv) {
        return;
      }

      if (node.type !== 'string') {
        context.addIssue({
          code: 'custom',
          message: 'secretEnv is only supported for string fields',
          path: ['x-ui', 'secretEnv'],
        });
        return;
      }

      if (node.default !== undefined) {
        context.addIssue({
          code: 'custom',
          message: 'secret fields cannot define a default',
          path: ['default'],
        });
      }
    }),
);

const timestampSchema = z.string().datetime({ offset: true });
const calendarDateSchema = z.iso.date();
const reasonCodeSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Expected a stable reason code');

const repositorySchema = z.strictObject({
  url: z.string().url(),
  directory: z.string().min(1).optional(),
});

const npmSnapshotValuesSchema = {
  checkedAt: timestampSchema,
  latestVersion: z.string().min(1),
  lastPublishedAt: timestampSchema,
  repository: repositorySchema,
};

const npmSnapshotSchema = z.discriminatedUnion('status', [
  z.strictObject({
    status: z.literal('fresh'),
    lastAttemptAt: timestampSchema,
    ...npmSnapshotValuesSchema,
  }),
  z.strictObject({
    status: z.literal('stale'),
    lastAttemptAt: timestampSchema,
    reason: reasonCodeSchema,
    ...npmSnapshotValuesSchema,
  }),
  z.strictObject({
    status: z.literal('unavailable'),
    lastAttemptAt: timestampSchema,
    reason: reasonCodeSchema,
  }),
]);

export type NpmSnapshot = z.infer<typeof npmSnapshotSchema>;

const backstageSnapshotValuesSchema = {
  checkedAt: timestampSchema,
  version: z.string().min(1),
  sourceUrl: z.string().url(),
  sourcePath: z.string().min(1),
};

const backstageSnapshotSchema = z.discriminatedUnion('status', [
  z.strictObject({
    status: z.literal('fresh'),
    lastAttemptAt: timestampSchema,
    ...backstageSnapshotValuesSchema,
  }),
  z.strictObject({
    status: z.literal('stale'),
    lastAttemptAt: timestampSchema,
    reason: reasonCodeSchema,
    ...backstageSnapshotValuesSchema,
  }),
  z.strictObject({
    status: z.literal('unavailable'),
    lastAttemptAt: timestampSchema,
    reason: reasonCodeSchema,
  }),
]);

export type BackstageSnapshot = z.infer<typeof backstageSnapshotSchema>;

const setupSchema = z.strictObject({
  packages: z
    .array(
      z.strictObject({
        name: z.string().min(1),
        role: z.enum(['frontend', 'backend']),
      }),
    )
    .optional(),
  frontend: z
    .strictObject({
      routes: z.array(
        z.strictObject({
          name: z.string().min(1),
          type: z.enum(['provided', 'external']),
          description: z.string().min(1),
        }),
      ),
      extensions: z.array(
        z.strictObject({
          id: z.string().min(1),
          kind: z.string().min(1),
          description: z.string().min(1),
          enabledByDefault: z.boolean(),
        }),
      ),
    })
    .optional(),
  integration: z
    .array(
      z.strictObject({
        title: z.string().min(1),
        explanation: z.string().min(1),
        language: z.string().min(1),
        source: z.string().min(1),
      }),
    )
    .optional(),
  config: z
    .strictObject({
      schema: configSchema,
    })
    .optional(),
});

export const pluginManifestSchema = z.strictObject({
  title: z.string().min(1),
  author: z.string().min(1),
  authorUrl: z.string().url(),
  category: z.string().min(1),
  description: z.string().min(1),
  documentation: z.string().url(),
  iconUrl: z.string().min(1).optional(),
  npmPackageName: z.string().min(1),
  addedDate: calendarDateSchema,
  order: z.number().optional(),
  status: z.enum(['active', 'inactive', 'archived']),
  staleSince: calendarDateSchema.optional(),
  capabilities: z.array(z.enum(capabilities)).optional(),
  setup: setupSchema.optional(),
  snapshot: z
    .strictObject({
      npm: npmSnapshotSchema,
      backstage: backstageSnapshotSchema,
    })
    .optional(),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

export interface PluginData extends PluginManifest {
  slug: string;
  isNew: boolean;
}
