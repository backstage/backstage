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

/**
 * Registers the built-in Backstage catalog kinds.
 * These are the standard kinds that ship with every Backstage instance.
 */
export function registerBuiltinKinds(registry: CatalogModelRegistry) {
  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'Component',
      singular: 'component',
      plural: 'components',
      shortNames: ['comp'],
    },
    description: 'A software component',
    categories: ['core', 'software'],
    schema: z => ({
      spec: {
        type: z.string().meta({ description: 'Component type' }),
        lifecycle: z
          .lifecycle()
          .meta({ description: 'Current lifecycle stage' }),
        owner: z
          .entityRef({ kind: ['Group', 'User'] })
          .withRelations({ forward: 'ownedBy', reverse: 'ownerOf' })
          .meta({ description: 'The owning entity' }),
        system: z
          .entityRef({ kind: 'System' })
          .withRelations({ forward: 'partOf', reverse: 'hasPart' })
          .optional()
          .meta({ description: 'The system this belongs to' }),
        subcomponentOf: z
          .entityRef({ kind: 'Component' })
          .withRelations({
            forward: 'subcomponentOf',
            reverse: 'hasSubcomponent',
          })
          .optional()
          .meta({ description: 'Parent component if this is a subcomponent' }),
        providesApis: z
          .array(
            z.entityRef({ kind: 'API' }).withRelations({
              forward: 'providesApi',
              reverse: 'apiProvidedBy',
            }),
          )
          .optional()
          .meta({ description: 'APIs this component provides' }),
        consumesApis: z
          .array(
            z.entityRef({ kind: 'API' }).withRelations({
              forward: 'consumesApi',
              reverse: 'apiConsumedBy',
            }),
          )
          .optional()
          .meta({ description: 'APIs this component consumes' }),
        dependsOn: z
          .array(
            z
              .entityRef({ kind: ['Component', 'Resource'] })
              .withRelations({ forward: 'dependsOn', reverse: 'dependencyOf' }),
          )
          .optional()
          .meta({ description: 'Other entities this component depends on' }),
      },
    }),
  });

  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'API',
      singular: 'api',
      plural: 'apis',
    },
    description: 'An API exposed by a component',
    categories: ['core', 'software'],
    schema: z => ({
      spec: {
        type: z.string().meta({ description: 'API type' }),
        lifecycle: z
          .lifecycle()
          .meta({ description: 'Current lifecycle stage' }),
        owner: z
          .entityRef({ kind: ['Group', 'User'] })
          .withRelations({ forward: 'ownedBy', reverse: 'ownerOf' })
          .meta({ description: 'The owning entity' }),
        system: z
          .entityRef({ kind: 'System' })
          .withRelations({ forward: 'partOf', reverse: 'hasPart' })
          .optional()
          .meta({ description: 'The system this belongs to' }),
        definition: z.string().meta({ description: 'The API definition' }),
      },
    }),
  });

  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'System',
      singular: 'system',
      plural: 'systems',
      shortNames: ['sys'],
    },
    description: 'A collection of resources and components',
    categories: ['core', 'organizational'],
    schema: z => ({
      spec: {
        owner: z
          .entityRef({ kind: ['Group', 'User'] })
          .withRelations({ forward: 'ownedBy', reverse: 'ownerOf' })
          .meta({ description: 'The owning entity' }),
        domain: z
          .entityRef({ kind: 'Domain' })
          .withRelations({ forward: 'partOf', reverse: 'hasPart' })
          .optional()
          .meta({ description: 'The domain this system belongs to' }),
      },
    }),
  });

  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'Domain',
      singular: 'domain',
      plural: 'domains',
    },
    description: 'A group of systems that share terminology and domain models',
    categories: ['core', 'organizational'],
    schema: z => ({
      spec: {
        owner: z
          .entityRef({ kind: ['Group', 'User'] })
          .withRelations({ forward: 'ownedBy', reverse: 'ownerOf' })
          .meta({ description: 'The owning entity' }),
      },
    }),
  });

  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'Resource',
      singular: 'resource',
      plural: 'resources',
      shortNames: ['res'],
    },
    description: 'Infrastructure needed to operate a component',
    categories: ['core', 'infrastructure'],
    schema: z => ({
      spec: {
        type: z.string().meta({ description: 'Resource type' }),
        owner: z
          .entityRef({ kind: ['Group', 'User'] })
          .withRelations({ forward: 'ownedBy', reverse: 'ownerOf' })
          .meta({ description: 'The owning entity' }),
        system: z
          .entityRef({ kind: 'System' })
          .withRelations({ forward: 'partOf', reverse: 'hasPart' })
          .optional()
          .meta({ description: 'The system this belongs to' }),
        dependsOn: z
          .array(
            z
              .entityRef({ kind: ['Component', 'Resource'] })
              .withRelations({ forward: 'dependsOn', reverse: 'dependencyOf' }),
          )
          .optional()
          .meta({ description: 'Other entities this resource depends on' }),
        dependencyOf: z
          .array(
            z.entityRef({ kind: ['Component', 'Resource'] }).withRelations({
              forward: 'dependencyOf',
              reverse: 'dependsOn',
            }),
          )
          .optional()
          .meta({ description: 'Entities that depend on this resource' }),
      },
    }),
  });

  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'Group',
      singular: 'group',
      plural: 'groups',
      shortNames: ['grp'],
    },
    description: 'A team or organizational unit',
    categories: ['core', 'organizational'],
    schema: z => ({
      spec: {
        type: z.string().meta({ description: 'Group type' }),
        parent: z
          .entityRef({ kind: 'Group' })
          .withRelations({ forward: 'childOf', reverse: 'parentOf' })
          .optional()
          .meta({ description: 'Parent group' }),
        children: z
          .array(
            z
              .entityRef({ kind: 'Group' })
              .withRelations({ forward: 'parentOf', reverse: 'childOf' }),
          )
          .meta({ description: 'Child groups' }),
        members: z
          .array(
            z
              .entityRef({ kind: 'User' })
              .withRelations({ forward: 'hasMember', reverse: 'memberOf' }),
          )
          .optional()
          .meta({ description: 'Users that are members of this group' }),
      },
    }),
  });

  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'User',
      singular: 'user',
      plural: 'users',
    },
    description: 'A person',
    categories: ['core', 'organizational'],
    schema: z => ({
      spec: {
        memberOf: z
          .array(
            z
              .entityRef({ kind: 'Group' })
              .withRelations({ forward: 'memberOf', reverse: 'hasMember' }),
          )
          .meta({ description: 'Groups this user belongs to' }),
      },
    }),
  });

  registry.createKind({
    apiVersion: 'backstage.io/v1alpha1',
    names: {
      kind: 'Location',
      singular: 'location',
      plural: 'locations',
      shortNames: ['loc'],
    },
    description: 'A marker that references other entity locations',
    categories: ['core'],
    schema: z => ({
      spec: {
        type: z.string().optional().meta({ description: 'Location type' }),
        target: z
          .string()
          .optional()
          .meta({ description: 'Single target location' }),
        targets: z
          .array(z.string())
          .optional()
          .meta({ description: 'List of target locations' }),
        presence: z
          .enum(['required', 'optional'])
          .optional()
          .meta({ description: 'Whether the location target must exist' }),
      },
    }),
  });
}
