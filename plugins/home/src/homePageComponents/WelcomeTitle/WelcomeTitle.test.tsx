/*
 * Copyright 2021 The Backstage Authors
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

import {
  EntityPresentationApi,
  EntityRefPresentationSnapshot,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { identityApiRef } from '@backstage/core-plugin-api';
import {
  mockApis,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import { WelcomeTitle } from './WelcomeTitle';

describe('<WelcomeTitle>', () => {
  afterEach(() => jest.resetAllMocks());

  test('should greet user', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T23:00:00').valueOf());

    const apis = TestApiRegistry.from([
      identityApiRef,
      mockApis.identity({ userEntityRef: 'user:default/guest' }),
    ]);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <WelcomeTitle />
      </ApiProvider>,
    );

    expect(getByText(/Get some rest,/)).toHaveTextContent(
      'Get some rest, guest!',
    );
  });

  test('should greet user with a single language', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T10:00:00').valueOf());

    const apis = TestApiRegistry.from([
      identityApiRef,
      mockApis.identity({ userEntityRef: 'user:default/guest' }),
    ]);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <WelcomeTitle language={['English']} />
      </ApiProvider>,
    );

    expect(getByText(/Good morning,/)).toHaveTextContent(
      'Good morning, guest!',
    );
  });

  test('should greet user with the title from the entity presentation API', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T10:00:00').valueOf());

    const mockPresentationApi: EntityPresentationApi = {
      forEntity: entityOrRef => {
        const name =
          typeof entityOrRef === 'string'
            ? entityOrRef.split('/').pop()!
            : entityOrRef.metadata.name;
        const snapshot: EntityRefPresentationSnapshot = {
          entityRef: `user:default/${name}`,
          primaryTitle: 'Ada Lovelace',
        };
        return { snapshot, promise: Promise.resolve(snapshot) };
      },
    };
    const apis = TestApiRegistry.from(
      [entityPresentationApiRef, mockPresentationApi],
      [
        identityApiRef,
        mockApis.identity({ userEntityRef: 'user:default/ada' }),
      ],
    );

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <WelcomeTitle language={['English']} />
      </ApiProvider>,
    );

    expect(getByText(/Good morning,/)).toHaveTextContent(
      'Good morning, Ada Lovelace!',
    );
  });

  test('should greet user with the profile display name when set', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T10:00:00').valueOf());

    const apis = TestApiRegistry.from([
      identityApiRef,
      mockApis.identity({
        userEntityRef: 'user:default/jdoe',
        displayName: 'Jane Doe',
      }),
    ]);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <WelcomeTitle language={['English']} />
      </ApiProvider>,
    );

    expect(getByText(/Good morning,/)).toHaveTextContent(
      'Good morning, Jane Doe!',
    );
  });
});
