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
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { TestApiProvider } from '@backstage/test-utils';
import { permissionApiRef } from '../apis';

const mockAuthorize = jest.fn();

const permission = {
  name: 'access.something',
  attributes: { action: 'read' as const },
};

const TestComponent: FC = () => {
  const { loading, allowed, error } = usePermission(permission);
  return (
    <div>
      {loading && 'loading'}
      {error && 'error'}
      {allowed ? 'content' : null}
    </div>
  );
};

describe('usePermission', () => {
  it('Returns loading when permissionApi has not yet responded.', () => {
    mockAuthorize.mockReturnValueOnce(new Promise(() => {}));

    const { getByText } = render(
      <TestApiProvider
        apis={[[permissionApiRef, { authorize: mockAuthorize }]]}
      >
        <TestComponent />
      </TestApiProvider>,
    );

    expect(mockAuthorize).toHaveBeenCalledWith({ permission });
    expect(getByText('loading')).toBeTruthy();
  });

  it('Returns allowed when permissionApi allows authorization.', async () => {
    mockAuthorize.mockResolvedValueOnce({ result: AuthorizeResult.ALLOW });

    const { findByText } = render(
      <TestApiProvider
        apis={[[permissionApiRef, { authorize: mockAuthorize }]]}
      >
        <TestComponent />
      </TestApiProvider>,
    );

    expect(mockAuthorize).toHaveBeenCalledWith({ permission });
    expect(await findByText('content')).toBeTruthy();
  });

  it('Returns not allowed when permissionApi denies authorization.', async () => {
    mockAuthorize.mockResolvedValueOnce({ result: AuthorizeResult.DENY });

    const { findByText } = render(
      <TestApiProvider
        apis={[[permissionApiRef, { authorize: mockAuthorize }]]}
      >
        <TestComponent />
      </TestApiProvider>,
    );

    expect(mockAuthorize).toHaveBeenCalledWith({ permission });
    await expect(findByText('content')).rejects.toThrowError();
  });
});
