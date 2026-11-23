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

import { ApiProvider } from '@backstage/core-app-api';
import {
  EntityPresentationApi,
  EntityRefPresentationSnapshot,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { WelcomeTitle } from './WelcomeTitle';

describe('<WelcomeTitle>', () => {
  afterEach(() => jest.resetAllMocks());

  test('should greet user', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T23:00:00').valueOf());

    const { getByText } = await renderInTestApp(<WelcomeTitle />);

    expect(getByText(/Get some rest, guest/)).toBeInTheDocument();
  });

  test('should greet user with a single language', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T10:00:00').valueOf());

    const { getByText } = await renderInTestApp(
      <WelcomeTitle language={['English']} />,
    );

    expect(getByText(/Good morning, guest/)).toBeInTheDocument();
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
    const apis = TestApiRegistry.from([
      entityPresentationApiRef,
      mockPresentationApi,
    ]);

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <WelcomeTitle language={['English']} />
      </ApiProvider>,
    );

    expect(getByText(/Good morning, Ada Lovelace/)).toBeInTheDocument();
  });
});
