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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Content } from './Content';
import { ShouldIDeployCIApiRef } from '../../api';
import { ShouldIDeployCIApi } from '../../api/ShouldIDeployCIApi';
import { screen } from '@testing-library/react';

const mockSuccessApiRef = {
  get: async () =>
    Promise.resolve({
      timezone: 'UTC',
      date: '2023-10-30T11:10:26.000Z',
      shouldideploy: true,
      message: 'Make me proud',
    }),
};

const mockErrorApiRef = {
  get: async () => Promise.reject(new Error('Error to load infos')),
};

describe('ShouldIDeployCard', () => {
  beforeEach(async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            ShouldIDeployCIApiRef,
            mockSuccessApiRef as unknown as ShouldIDeployCIApi,
          ],
        ]}
      >
        <Content />
      </TestApiProvider>,
    );
  });

  it('should render', async () => {
    expect(
      await screen.findByTestId('should-i-deploy-card'),
    ).toBeInTheDocument();
  });
});

describe('ShouldIDeployCard Error', () => {
  beforeEach(async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            ShouldIDeployCIApiRef,
            mockErrorApiRef as unknown as ShouldIDeployCIApi,
          ],
        ]}
      >
        <Content />
      </TestApiProvider>,
    );
  });

  it('should render error panel', async () => {
    expect(screen.getByText('Error to load infos')).toBeInTheDocument();
  });
});
