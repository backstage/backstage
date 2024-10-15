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

import { Entity, EntityPolicy } from '@backstage/catalog-model';
import { transformLegacyPolicyToProcessor } from './transformLegacyPolicyToProcessor';
import { clone } from 'lodash';

describe('transformLegacyPolicyToProcessor', () => {
  const entityToProcess: Entity = {
    apiVersion: 'backstage.io/v1alpha',
    kind: 'Component',
    metadata: {
      name: 'test',
    },
  };
  it('modifies the entity if the policy modifies the entity', async () => {
    const policy: EntityPolicy = {
      async enforce(entity) {
        entity.kind = 'Group';
        return entity;
      },
    };
    const processor = transformLegacyPolicyToProcessor(policy);
    const clonedEntity = clone(entityToProcess);
    const entity = await processor.preProcessEntity?.(
      clonedEntity,
      {} as any,
      jest.fn(),
      {} as any,
      {} as any,
    );
    expect(entity).toBeTruthy();
    expect(entity?.kind).toBe('Group');
    expect(entity?.apiVersion).toBe('backstage.io/v1alpha');
    expect(entity?.metadata.name).toBe('test');
  });

  it('does not modify the entity if the policy returns undefined', async () => {
    const policy: EntityPolicy = {
      async enforce() {
        return undefined;
      },
    };
    const processor = transformLegacyPolicyToProcessor(policy);
    const clonedEntity = clone(entityToProcess);
    const entity = await processor.preProcessEntity?.(
      clonedEntity,
      {} as any,
      jest.fn(),
      {} as any,
      {} as any,
    );
    expect(entity).toBeTruthy();
    expect(entity?.kind).toBe('Component');
    expect(entity?.apiVersion).toBe('backstage.io/v1alpha');
    expect(entity?.metadata.name).toBe('test');
  });

  it('bubbles up processor error', async () => {
    const policy: EntityPolicy = {
      async enforce() {
        throw new TypeError('Invalid value for metadata.name');
      },
    };
    const processor = transformLegacyPolicyToProcessor(policy);
    const clonedEntity = clone(entityToProcess);
    await expect(
      processor.preProcessEntity?.(
        clonedEntity,
        {} as any,
        jest.fn(),
        {} as any,
        {} as any,
      ),
    ).rejects.toThrow(/Invalid value for metadata.name/);
  });
});
