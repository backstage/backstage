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
import React, { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useConsumerGroupsForEntity } from './useConsumerGroupsForEntity';
import { EntityContext } from '@backstage/plugin-catalog';
import { Entity } from '@backstage/catalog-model';

describe('useConsumerGroupOffsets', () => {
  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'test',
      annotations: {
        'kafka.apache.org/consumer-groups': 'consumer',
      },
    },
    spec: {
      owner: 'guest',
      type: 'Website',
      lifecycle: 'development',
    },
  };

  const wrapper = ({ children }: PropsWithChildren<{}>) => {
    return (
      <EntityContext.Provider value={{ entity: entity, loading: false }}>
        {children}
      </EntityContext.Provider>
    );
  };

  const subject = () => renderHook(useConsumerGroupsForEntity, { wrapper });

  it('returns correct consumer group for annotation', async () => {
    const { result } = subject();
    expect(result.current).toBe('consumer');
  });
});
