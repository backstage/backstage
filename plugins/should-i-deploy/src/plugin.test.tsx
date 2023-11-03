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
import { Routes, Route } from 'react-router';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  ShouldIDeployCard,
  ShouldIDeployPage,
  shouldIDeployPlugin,
} from './plugin';
import {
  ShouldIDeployCIApi,
  ShouldIDeployCIApiRef,
} from './api/ShouldIDeployCIApi';
import { screen } from '@testing-library/react';

const fetchPageApi = {
  fetch: jest.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        message: "It's a good day to deploy!",
        date: new Date().toISOString(),
      }),
  }),
};

const mockSuccessApiRef = {
  get: async () =>
    Promise.resolve({
      message: "It's a good day to deploy!",
      date: new Date().toISOString(),
    }),
};

describe('Plugin base', () => {
  it('should export plugin', () => {
    expect(shouldIDeployPlugin).toBeDefined();
  });

  it('should create plugin api', () => {
    const apiArray = Array.from(shouldIDeployPlugin.getApis());
    const api = apiArray[0]?.factory({
      fetchApi: fetchPageApi,
    }) as ShouldIDeployCIApi[];
    expect(api).toBeDefined();
  });
});

describe('Plugin page', () => {
  beforeEach(async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [ShouldIDeployCIApiRef, mockSuccessApiRef as ShouldIDeployCIApi],
        ]}
      >
        <Routes>
          <Route path="/" element={<ShouldIDeployPage />} />
        </Routes>
      </TestApiProvider>,
    );
  }, 35000);

  it('should export plugin page', () => {
    expect(ShouldIDeployPage).toBeDefined();
    const { getByText } = screen;
    const element = getByText(/Should i deploy today/i);
    expect(element).toBeInTheDocument();
  });
});

describe('Plugin card', () => {
  beforeEach(async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [ShouldIDeployCIApiRef, mockSuccessApiRef as ShouldIDeployCIApi],
        ]}
      >
        <Routes>
          <Route path="/" element={<ShouldIDeployCard />} />
        </Routes>
      </TestApiProvider>,
    );
  }, 35000);

  it('should export plugin card', async () => {
    expect(ShouldIDeployCard).toBeDefined();
    expect(
      await screen.findByTestId('should-i-deploy-card'),
    ).toBeInTheDocument();
  });
});
