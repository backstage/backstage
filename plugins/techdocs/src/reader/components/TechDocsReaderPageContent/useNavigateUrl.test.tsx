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
import React from 'react';
import {
  MockConfigApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { resolveUrlToRelative, useNavigateUrl } from './useNavigateUrl';
import { configApiRef } from '@backstage/core-plugin-api';

const navigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('resolveUrlToRelative', () => {
  it('does nothing when app.baseUrl has no subpath', () => {
    const url = 'http://localhost:3000/test';
    const baseUrl = 'http://localhost:3000';
    expect(resolveUrlToRelative(url, baseUrl)).toBe('/test');
  });

  it('removes the app.baseUrl subpath when present', () => {
    const url = 'http://localhost:3000/instance/test';
    const baseUrl = 'http://localhost:3000/instance';
    expect(resolveUrlToRelative(url, baseUrl)).toBe('/test');
  });
});

const Component = ({ to }: { to: string }) => {
  const navigateTo = useNavigateUrl();
  return <>{navigateTo(to)}</>;
};

describe('useNavigateUrl', () => {
  beforeEach(() => {
    navigate.mockReset();
  });
  it('navigates to the desired page as expected', async () => {
    const baseUrl = 'http://localhost:3000';
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new MockConfigApi({
              app: {
                baseUrl,
              },
            }),
          ],
        ]}
      >
        <Component to={`${baseUrl}/test`} />
      </TestApiProvider>,
    );
    expect(navigate).toHaveBeenCalledWith('/test');
  });
  it('handles app.baseUrl subpaths', async () => {
    const baseUrl = 'http://localhost:3000/instance';
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new MockConfigApi({
              app: {
                baseUrl,
              },
            }),
          ],
        ]}
      >
        <Component to={`${baseUrl}/test`} />
      </TestApiProvider>,
    );
    expect(navigate).toHaveBeenCalledWith('/test');
  });
  it('handles relative urls', async () => {
    const baseUrl = 'http://localhost:3000';
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new MockConfigApi({
              app: {
                baseUrl,
              },
            }),
          ],
        ]}
      >
        <Component to="/test" />
      </TestApiProvider>,
    );
    expect(navigate).toHaveBeenCalledWith('/test');
  });
});
