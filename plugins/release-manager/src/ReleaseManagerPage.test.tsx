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
import React from 'react';
import { render, act } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import ReleaseManagerPage from './ReleaseManagerPage';
import useAxios from 'axios-hooks';
import { tracksMock } from './utils/mocks';
import {
  ApiProvider,
  ApiRegistry,
  configApiRef,
  ConfigReader,
} from '@backstage/core';

jest.mock('axios-hooks');

const responseMap: { [key: string]: any } = {
  ['/com.spotify.music/tracks']: [{ data: tracksMock, loading: false }],
};

(useAxios as any).mockImplementation((url: string) => {
  const mockExecute = () => {};

  return [...responseMap[url], mockExecute];
});

class ConfigReaderMock extends ConfigReader {
  getString(key: string): string {
    if (key === 'releasemanager.android.identifier') return 'com.spotify.music';
    if (key === 'releasemanager.android.baseUrl') return '';

    return '';
  }
}

describe('<ReleaseManagerPage />', () => {
  it('renders without exploding', async () => {
    await act(async () => {
      const { getByText } = await render(
        wrapInTestApp(
          <ApiProvider
            apis={ApiRegistry.with(
              configApiRef,
              new ConfigReaderMock({}, 'ctx'),
            )}
          >
            <ReleaseManagerPage />
          </ApiProvider>,
        ),
      );
      expect(getByText('Release Manager')).toBeInTheDocument();
    });
  });
});
