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
import {
  AnyApiRef,
  configApiRef,
  errorApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { rest } from 'msw';
import {
  renderInTestApp,
  setupRequestMockHandlers,
  TestApiProvider,
} from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { siteMock } from '../../mocks/mocks';
import { AzureSitesOverviewTable } from './AzureSitesOverviewTable';
import { azureSiteApiRef } from '../../api';

const errorApiMock = { post: jest.fn(), error$: jest.fn() };
const identityApiMock = (getCredentials: any) => ({
  signOut: jest.fn(),
  getProfileInfo: jest.fn(),
  getBackstageIdentity: jest.fn(),
  getCredentials,
});
const azureSitesApiMock = {};

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return { loading: false, entity: undefined };
  },
}));

jest.mock('@backstage/plugin-catalog-react/alpha', () => ({
  useEntityPermission: () => {
    return { loading: false, allowed: true };
  },
}));

jest.mock('@backstage/catalog-model', () => ({
  stringifyEntityRef: () => {
    return {};
  },
}));

const config = {
  getString: (_: string) => 'https://test-url',
};

const mockAuthorize = jest
  .fn()
  .mockImplementation(async () => ({ result: AuthorizeResult.ALLOW }));
const permissionApi: Partial<PermissionApi> = { authorize: mockAuthorize };

const apis: [AnyApiRef, Partial<unknown>][] = [
  [errorApiRef, errorApiMock],
  [configApiRef, config],
  [azureSiteApiRef, azureSitesApiMock],
  [identityApiRef, identityApiMock],
  [permissionApiRef, permissionApi],
];

describe('AzureSitesOverviewWidget', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  beforeEach(() => {
    worker.use(
      rest.get('/list/func-mock', (_, res, ctx) => {
        res(ctx.json(siteMock));
      }),
    );
  });

  it('should display an overview table with the data from the requests', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <AzureSitesOverviewTable data={[siteMock]} loading={false} />
      </TestApiProvider>,
    );

    await expect(
      rendered.findByText(siteMock.name),
    ).resolves.toBeInTheDocument();
    expect(rendered.getByText(siteMock.location)).toBeInTheDocument();
    expect(rendered.getByText(siteMock.state)).toBeInTheDocument();
    // TODO(Rugvip): This check is disabled, because in Node.js 18.13 an unexpected
    //               invisible whitespace character is present in the formatted time.
    // expect(
    //   rendered.getByText(
    //     DateTime.fromISO(siteMock.lastModifiedDate).toLocaleString(
    //       DateTime.DATETIME_MED,
    //     ),
    //   ),
    // ).toBeInTheDocument();
  });
});
