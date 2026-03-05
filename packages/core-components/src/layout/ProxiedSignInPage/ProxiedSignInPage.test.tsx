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

import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  mockApis,
  registerMswTestHooks,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import { ProxiedSignInPage } from './ProxiedSignInPage';
import { discoveryApiRef } from '@backstage/core-plugin-api';

describe('ProxiedSignInPage', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  const Subject = wrapInTestApp(<div>authenticated</div>, {
    components: {
      SignInPage: props => (
        <TestApiProvider
          apis={[
            [
              discoveryApiRef,
              mockApis.discovery({ baseUrl: 'http://example.com' }),
            ],
          ]}
        >
          <ProxiedSignInPage {...props} provider="test" />
        </TestApiProvider>
      ),
    },
  });

  it('should sign in a user', async () => {
    worker.use(
      rest.get('http://example.com/api/auth/test/refresh', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({
            profile: {
              email: 'e',
              displayName: 'd',
              picture: 'p',
            },
            backstageIdentity: {
              token: 'a.e30.c',
              identity: {
                type: 'user',
                userEntityRef: 'k:ns/ue',
                ownershipEntityRefs: ['k:ns/oe'],
              },
            },
          }),
        ),
      ),
    );

    render(Subject);

    await expect(
      screen.findByText('authenticated'),
    ).resolves.toBeInTheDocument();
  });

  it('should forward error', async () => {
    worker.use(
      rest.get('http://example.com/api/auth/test/refresh', (_, res, ctx) =>
        res(
          ctx.status(401),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({
            error: { name: 'Error', message: 'not-displayed' },
          }),
        ),
      ),
    );

    render(Subject);

    await expect(
      screen.findByText('Request failed with 401 Unauthorized'),
    ).resolves.toBeInTheDocument();
  });

  it('should allow custom error component', async () => {
    const ErrorComponent = ({ error }: { error?: Error }) => (
      <>
        <h1>Failed to authenticate</h1>
        <div>{error?.message}</div>
      </>
    );

    const CustomSubject = wrapInTestApp(<div>authenticated</div>, {
      components: {
        SignInPage: props => (
          <TestApiProvider
            apis={[
              [
                discoveryApiRef,
                {
                  getBaseUrl: async () => 'http://example.com/api/auth',
                },
              ],
            ]}
          >
            <ProxiedSignInPage
              {...props}
              provider="test"
              ErrorComponent={ErrorComponent}
            />
          </TestApiProvider>
        ),
      },
    });

    worker.use(
      rest.get('http://example.com/api/auth/test/refresh', (_, res, ctx) =>
        res(
          ctx.status(401),
          ctx.set('Content-Type', 'application/json'),
          ctx.json({
            error: { name: 'Error', message: 'not-displayed' },
          }),
        ),
      ),
    );

    render(CustomSubject);

    await expect(
      screen.findByText('Failed to authenticate'),
    ).resolves.toBeInTheDocument();

    await expect(
      screen.findByText('Request failed with 401 Unauthorized'),
    ).resolves.toBeInTheDocument();
  });
});
