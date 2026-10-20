/*
 * Copyright 2026 The Backstage Authors
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

import { AppError } from '@backstage/frontend-app-api';
import { render, screen } from '@testing-library/react';
import { maybeCreateErrorPage } from './maybeCreateErrorPage';

it('treats routing diagnostics as fatal unless explicitly configured as warnings', () => {
  const errors: AppError[] = [
    {
      code: 'ROUTE_OVERRIDE_INVALID',
      message: 'Invalid override',
      context: { pluginId: 'test', routeId: 'test.root' },
    },
    {
      code: 'ROUTE_PARAMETERS_INVALID',
      message: 'Invalid parameters',
      context: {
        routeId: 'test.root',
        expectedParams: ['id'],
        actualParams: [],
      },
    },
    {
      code: 'ROUTE_TARGET_INVALID',
      message: 'Invalid target',
      context: { routeId: 'test.root', extensionId: 'page:test' },
    },
    {
      code: 'ROUTE_MOUNT_CONFLICT',
      message: 'Ambiguous mounts',
      context: {
        extensionId: 'page:test',
        mountExtensionIds: ['page:test/first', 'page:test/second'],
      },
    },
    {
      code: 'ROUTE_NOT_FOUND',
      message: 'Missing target',
      context: { routeId: 'test.root', extensionId: 'page:test/missing' },
    },
  ];
  const { unmount } = render(maybeCreateErrorPage({ errors })!);
  for (const error of errors) {
    expect(screen.getByText(error.code, { exact: false })).toBeInTheDocument();
  }
  unmount();
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    expect(
      maybeCreateErrorPage(
        { errors },
        { warningCodes: errors.map(error => error.code) },
      ),
    ).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      'ROUTE_PARAMETERS_INVALID: Invalid parameters',
    );
    expect(
      maybeCreateErrorPage(
        { errors },
        { warningCodes: ['ROUTE_PARAMETERS_INVALID'] },
      ),
    ).toBeDefined();
  } finally {
    warn.mockRestore();
  }
});
