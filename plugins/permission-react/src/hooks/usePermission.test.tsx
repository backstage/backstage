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

import React, { FC } from 'react';
import { render } from '@testing-library/react';
import { usePermission } from './usePermission';
import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
import { TestApiProvider } from '@backstage/test-utils';
import { PermissionApi, permissionApiRef } from '../apis';
import { SWRConfig } from 'swr';

const permission = createPermission({
  name: 'access.something',
  attributes: { action: 'read' },
});

const TestComponent: FC = () => {
  const { loading, allowed, error } = usePermission({ permission });
  return (
    <div>
      {loading && 'loading'}
      {error && 'error'}
      {allowed ? 'content' : null}
    </div>
  );
};

function renderComponent(mockApi: PermissionApi) {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <TestApiProvider apis={[[permissionApiRef, mockApi]]}>
        <TestComponent />
      </TestApiProvider>
      ,
    </SWRConfig>,
  );
}

describe('usePermission', () => {
  const mockPermissionApi = { authorize: jest.fn() };

  it('Returns loading when permissionApi has not yet responded.', () => {
    mockPermissionApi.authorize.mockReturnValueOnce(new Promise(() => {}));

    const { getByText } = renderComponent(mockPermissionApi);

    expect(mockPermissionApi.authorize).toHaveBeenCalledWith({ permission });
    expect(getByText('loading')).toBeTruthy();
  });

  it('Returns allowed when permissionApi allows authorization.', async () => {
    mockPermissionApi.authorize.mockResolvedValueOnce({
      result: AuthorizeResult.ALLOW,
    });

    const { findByText } = renderComponent(mockPermissionApi);

    expect(mockPermissionApi.authorize).toHaveBeenCalledWith({ permission });
    expect(await findByText('content')).toBeTruthy();
  });

  it('Returns not allowed when permissionApi denies authorization.', async () => {
    mockPermissionApi.authorize.mockResolvedValueOnce({
      result: AuthorizeResult.DENY,
    });

    const { findByText } = renderComponent(mockPermissionApi);

    expect(mockPermissionApi.authorize).toHaveBeenCalledWith({ permission });
    await expect(findByText('content')).rejects.toThrowError();
  });
});
