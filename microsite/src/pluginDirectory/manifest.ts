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
  repository: repositorySchema.optional(),
  // The `backstage.role` field declared in the published package.json
  // (e.g. `frontend-plugin`, `backend-plugin`), read from the npm registry.
  backstageRole: z.string().min(1).optional(),
  // npm package names this package directly depends on, read from its
  // published package.json `dependencies` via the npm registry. Used to
  // determine internalDependencies below.
  dependencyNames: z.array(z.string().min(1)).optional(),
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

const configSchemaSnapshotValuesSchema = {
  checkedAt: timestampSchema,
  schema: z.unknown(),
};

const configSchemaSnapshotSchema = z.discriminatedUnion('status', [
  z.strictObject({
    status: z.literal('fresh'),
    lastAttemptAt: timestampSchema,
    ...configSchemaSnapshotValuesSchema,
  }),
  z.strictObject({
    status: z.literal('stale'),
    lastAttemptAt: timestampSchema,
    reason: reasonCodeSchema,
    ...configSchemaSnapshotValuesSchema,
  }),
  z.strictObject({
    status: z.literal('unavailable'),
    lastAttemptAt: timestampSchema,
    reason: reasonCodeSchema,
  }),
]);

export type ConfigSchemaSnapshot = z.infer<typeof configSchemaSnapshotSchema>;

const packageSnapshotSchema = z.strictObject({
  functionality: z.string().min(1).optional(),
  npmPackageName: z.string().min(1),
  sourcePath: z.string().min(1).optional(),
  // Subset of this package's npm dependencyNames that are other packages of
  // this same plugin's snapshot.packages, used to group related packages'
  // config schemas together in the UI.
  internalDependencies: z.array(z.string().min(1)).optional(),
  npm: npmSnapshotSchema,
  configSchema: configSchemaSnapshotSchema,
});

export type PackageSnapshot = z.infer<typeof packageSnapshotSchema>;

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
  snapshot: z
    .strictObject({
      backstage: backstageSnapshotSchema,
      packages: z.array(packageSnapshotSchema).min(1),
    })
    .optional(),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

export interface PluginData extends PluginManifest {
  slug: string;
  isNew: boolean;
}
