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

import React from 'react';
import { AuthorizeResult, Permission } from '@backstage/permission-common';
import { render } from '@testing-library/react';
import { WithPermission } from './WithPermission';
import { usePermission, AsyncPermissionResult } from '../hooks/usePermission';

jest.mock('../hooks/usePermission', () => ({
  AsyncPermissionResult: jest.requireActual('../hooks/usePermission')
    .AsyncPermissionResult,
  usePermission: jest.fn(),
}));

const mockUsePermission = usePermission as jest.MockedFunction<
  typeof usePermission
>;

describe('WithPermission component', () => {
  describe('authorization pending', () => {
    beforeEach(() => {
      mockUsePermission.mockReturnValue(AsyncPermissionResult.pending());
    });

    it('does not render children', () => {
      const { queryByText } = render(
        <WithPermission
          permission={
            {
              name: 'example.permission',
            } as Permission
          }
        >
          <div>Hello Tests!</div>
        </WithPermission>,
      );

      expect(queryByText('Hello Tests!')).not.toBeInTheDocument();
    });
  });

  describe('permission allowed', () => {
    beforeEach(() => {
      mockUsePermission.mockReturnValue(
        AsyncPermissionResult.fromAuthorizeResult(AuthorizeResult.ALLOW),
      );
    });

    it('renders children', () => {
      const { getByText } = render(
        <WithPermission
          permission={
            {
              name: 'example.permission',
            } as Permission
          }
        >
          <div>Hello Tests!</div>
        </WithPermission>,
      );

      expect(getByText('Hello Tests!')).toBeInTheDocument();
    });
  });

  describe('permission denied', () => {
    beforeEach(() => {
      mockUsePermission.mockReturnValue(
        AsyncPermissionResult.fromAuthorizeResult(AuthorizeResult.DENY),
      );
    });

    it('does not render children', () => {
      const { queryByText } = render(
        <WithPermission
          permission={
            {
              name: 'example.permission',
            } as Permission
          }
        >
          <div>Hello Tests!</div>
        </WithPermission>,
      );

      expect(queryByText('Hello Tests!')).not.toBeInTheDocument();
    });
  });
});
