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

import { Entity } from '@backstage/catalog-model';
import {
  compileCatalogModel,
  defaultCatalogEntityModel,
} from '@backstage/catalog-model/alpha';
import { ModelHolder } from '../model/ModelHolder';
import { BuiltinKindsEntityProcessor } from './BuiltinKindsEntityProcessor';
import { ModelProcessor } from './ModelProcessor';

const fixtures: Array<{
  kind: string;
  spec: Entity['spec'];
  relations: Array<{
    forward: string;
    reverse: string;
    kind: string;
    name: string;
    namespace?: string;
  }>;
}> = [
  {
    kind: 'Component',
    spec: {
      type: 'service',
      lifecycle: 'production',
      owner: 'team',
      subcomponentOf: 'parent',
      providesApis: ['api-b', 'api-a'],
      consumesApis: ['API:external/consumed-api'],
      dependsOn: ['Resource:database'],
      dependencyOf: ['Component:dependent'],
      system: 'system',
    },
    relations: [
      { forward: 'ownedBy', reverse: 'ownerOf', kind: 'Group', name: 'team' },
      {
        forward: 'partOf',
        reverse: 'hasPart',
        kind: 'Component',
        name: 'parent',
      },
      {
        forward: 'providesApi',
        reverse: 'apiProvidedBy',
        kind: 'API',
        name: 'api-a',
      },
      {
        forward: 'providesApi',
        reverse: 'apiProvidedBy',
        kind: 'API',
        name: 'api-b',
      },
      {
        forward: 'consumesApi',
        reverse: 'apiConsumedBy',
        kind: 'API',
        name: 'consumed-api',
        namespace: 'external',
      },
      {
        forward: 'dependsOn',
        reverse: 'dependencyOf',
        kind: 'Resource',
        name: 'database',
      },
      {
        forward: 'dependencyOf',
        reverse: 'dependsOn',
        kind: 'Component',
        name: 'dependent',
      },
      { forward: 'partOf', reverse: 'hasPart', kind: 'System', name: 'system' },
    ],
  },
  {
    kind: 'API',
    spec: {
      type: 'openapi',
      lifecycle: 'production',
      owner: 'User:external/owner',
      definition: 'openapi: 3.0.0',
      system: 'system',
    },
    relations: [
      {
        forward: 'ownedBy',
        reverse: 'ownerOf',
        kind: 'User',
        name: 'owner',
        namespace: 'external',
      },
      { forward: 'partOf', reverse: 'hasPart', kind: 'System', name: 'system' },
    ],
  },
  {
    kind: 'Resource',
    spec: {
      type: 'database',
      owner: 'team',
      dependsOn: ['Resource:infrastructure'],
      dependencyOf: ['Component:consumer'],
      system: 'system',
    },
    relations: [
      { forward: 'ownedBy', reverse: 'ownerOf', kind: 'Group', name: 'team' },
      {
        forward: 'dependsOn',
        reverse: 'dependencyOf',
        kind: 'Resource',
        name: 'infrastructure',
      },
      {
        forward: 'dependencyOf',
        reverse: 'dependsOn',
        kind: 'Component',
        name: 'consumer',
      },
      { forward: 'partOf', reverse: 'hasPart', kind: 'System', name: 'system' },
    ],
  },
  {
    kind: 'System',
    spec: { owner: 'team', domain: 'domain' },
    relations: [
      { forward: 'ownedBy', reverse: 'ownerOf', kind: 'Group', name: 'team' },
      { forward: 'partOf', reverse: 'hasPart', kind: 'Domain', name: 'domain' },
    ],
  },
  {
    kind: 'Domain',
    spec: { owner: 'team', subdomainOf: 'parent' },
    relations: [
      { forward: 'ownedBy', reverse: 'ownerOf', kind: 'Group', name: 'team' },
      { forward: 'partOf', reverse: 'hasPart', kind: 'Domain', name: 'parent' },
    ],
  },
  {
    kind: 'Group',
    spec: {
      type: 'team',
      parent: 'parent',
      children: ['child-b', 'child-a'],
      members: ['user-b', 'user-a'],
    },
    relations: [
      {
        forward: 'childOf',
        reverse: 'parentOf',
        kind: 'Group',
        name: 'parent',
      },
      {
        forward: 'parentOf',
        reverse: 'childOf',
        kind: 'Group',
        name: 'child-a',
      },
      {
        forward: 'parentOf',
        reverse: 'childOf',
        kind: 'Group',
        name: 'child-b',
      },
      {
        forward: 'hasMember',
        reverse: 'memberOf',
        kind: 'User',
        name: 'user-a',
      },
      {
        forward: 'hasMember',
        reverse: 'memberOf',
        kind: 'User',
        name: 'user-b',
      },
    ],
  },
  {
    kind: 'User',
    spec: { memberOf: ['team-b', 'team-a'] },
    relations: [
      {
        forward: 'memberOf',
        reverse: 'hasMember',
        kind: 'Group',
        name: 'team-a',
      },
      {
        forward: 'memberOf',
        reverse: 'hasMember',
        kind: 'Group',
        name: 'team-b',
      },
    ],
  },
  {
    kind: 'Location',
    spec: { type: 'url', target: 'https://example.com/catalog-info.yaml' },
    relations: [],
  },
];

describe('ModelProcessor compatibility with built-in kinds', () => {
  it.each(fixtures)(
    'processes $kind across versions and namespaces like the legacy processor',
    async ({ kind, spec, relations }) => {
      const processor = new ModelProcessor(
        ModelHolder.modelPassthroughForTest(
          compileCatalogModel([defaultCatalogEntityModel]),
        ),
      );
      const legacyProcessor = new BuiltinKindsEntityProcessor();
      const location = {
        type: 'url',
        target: 'https://example.com/catalog-info.yaml',
      };

      for (const apiVersion of [
        'backstage.io/v1alpha1',
        'backstage.io/v1beta1',
      ]) {
        for (const namespace of [undefined, 'custom-ns']) {
          const input: Entity = {
            apiVersion,
            kind,
            metadata: { name: 'entity', ...(namespace ? { namespace } : {}) },
            spec,
          };
          const entity = await processor.preProcessEntity(
            structuredClone(input),
          );
          const legacyEntity = await legacyProcessor.preProcessEntity(
            structuredClone(input),
          );
          expect(entity).toEqual(legacyEntity);
          await expect(processor.validateEntityKind(entity)).resolves.toBe(
            true,
          );
          await expect(
            legacyProcessor.validateEntityKind(legacyEntity),
          ).resolves.toBe(true);

          const emit = jest.fn();
          const legacyEmit = jest.fn();
          await expect(
            processor.postProcessEntity(entity, location, emit),
          ).resolves.toEqual(entity);
          await legacyProcessor.postProcessEntity(
            legacyEntity,
            location,
            legacyEmit,
          );

          const source = {
            kind,
            namespace: namespace ?? 'default',
            name: 'entity',
          };
          const expected = relations.flatMap(relation => {
            const target = {
              kind: relation.kind,
              namespace: relation.namespace ?? namespace ?? 'default',
              name: relation.name,
            };
            return [
              { source, type: relation.forward, target },
              { source: target, type: relation.reverse, target: source },
            ];
          });
          for (const emitted of [emit.mock.calls, legacyEmit.mock.calls]) {
            expect(emitted).toHaveLength(expected.length);
            expect(emitted.map(([result]) => result.relation)).toEqual(
              expect.arrayContaining(expected),
            );
          }
        }
      }
    },
  );
});
