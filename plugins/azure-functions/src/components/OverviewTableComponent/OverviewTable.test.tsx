/*
 * Copyright 2022 The Backstage Authors
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
import { render } from '@testing-library/react';
import {
  AnyApiRef,
  configApiRef,
  errorApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { rest } from 'msw';
import {
  setupRequestMockHandlers,
  TestApiProvider,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { functionResponseMock } from '../../mocks/mocks';
import { azureFunctionsApiRef } from '../..';
import { OverviewTable } from './OverviewTable';

const errorApiMock = { post: jest.fn(), error$: jest.fn() };
const identityApiMock = (getCredentials: any) => ({
  signOut: jest.fn(),
  getProfileInfo: jest.fn(),
  getBackstageIdentity: jest.fn(),
  getCredentials,
});
const azureFunctionsApiMock = {};

const config = {
  getString: (_: string) => 'https://test-url',
};

const apis: [AnyApiRef, Partial<unknown>][] = [
  [errorApiRef, errorApiMock],
  [configApiRef, config],
  [azureFunctionsApiRef, azureFunctionsApiMock],
  [identityApiRef, identityApiMock],
];

describe('AzureFunctionsOverviewWidget', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    worker.use(
      rest.get('/list/func-mock', (_, res, ctx) => {
        res(ctx.json(functionResponseMock));
      }),
    );
  });

  it('should display an overview table with the data from the requests', async () => {
    const rendered = render(
      <TestApiProvider apis={apis}>
        <OverviewTable data={[functionResponseMock]} loading={false} />
      </TestApiProvider>,
    );

    expect(
      await rendered.findByText(functionResponseMock.functionName),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText(functionResponseMock.state),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText(
        new Date(functionResponseMock.lastModifiedDate).toUTCString(),
      ),
    ).toBeInTheDocument();
  });
});
