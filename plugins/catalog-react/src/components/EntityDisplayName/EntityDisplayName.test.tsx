/*
 * Copyright 2023 The Backstage Authors
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

import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { createDeferred } from '@backstage/types';
import { screen } from '@testing-library/react';
import ObservableImpl from 'zen-observable';
import {
  EntityRefPresentation,
  EntityRefPresentationSnapshot,
  entityPresentationApiRef,
} from '../../apis';
import { EntityDisplayName } from './EntityDisplayName';

describe('<EntityDisplayName />', () => {
  const entityPresentationApi = {
    forEntity: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('works with the sync the happy path', async () => {
    entityPresentationApi.forEntity.mockReturnValue({
      snapshot: {
        entityRef: 'component:default/foo',
        primaryTitle: 'foo',
      },
      update$: undefined,
    } as EntityRefPresentation);

    await renderInTestApp(
      <TestApiProvider
        apis={[[entityPresentationApiRef, entityPresentationApi]]}
      >
        <EntityDisplayName entityRef="component:default/foo" />
      </TestApiProvider>,
    );

    expect(screen.getByText('foo')).toBeInTheDocument();
  });

  it('works with the async the happy path', async () => {
    const promise = createDeferred<EntityRefPresentationSnapshot>();

    entityPresentationApi.forEntity.mockReturnValue({
      snapshot: {
        entityRef: 'component:default/foo',
        primaryTitle: 'foo',
      },
      update$: new ObservableImpl(subscriber => {
        promise.then(value => subscriber.next(value));
      }),
      promise: Promise.resolve({
        entityRef: 'component:default/foo',
        primaryTitle: 'foo',
      }),
    } as EntityRefPresentation);

    await renderInTestApp(
      <TestApiProvider
        apis={[[entityPresentationApiRef, entityPresentationApi]]}
      >
        <EntityDisplayName entityRef="component:default/foo" />
      </TestApiProvider>,
    );

    expect(screen.getByText('foo')).toBeInTheDocument();

    promise.resolve({
      entityRef: 'component:default/foo',
      primaryTitle: 'bar',
    });

    await expect(screen.findByText('bar')).resolves.toBeInTheDocument();
  });
});
