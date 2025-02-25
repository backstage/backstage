/*
 * Copyright 2025 The Backstage Authors
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
import { ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import React from 'react';

import { useMicrosoftAccessTokenProvider } from './useMicrosoftAccessTokenProvider';

describe('useMicrosoftAccessTokenProvider', () => {
  let microsoftAccessTokenProvider: string;

  const apiWrapper = ({ children }: PropsWithChildren) => (
    <TestApiProvider
      apis={[
        [
          configApiRef,
          new ConfigReader({
            kubernetes: {
              auth: {
                microsoft: { scope: microsoftAccessTokenProvider },
              },
            },
          }),
        ],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  it.each([
    {
      condition: 'missing config',
      returnValue: '6dae42f8-4368-4678-94ff-3960e28e3630/user.read',
    },
    {
      condition: 'default',
      returnValue: '6dae42f8-4368-4678-94ff-3960e28e3630/user.read',
    },
    {
      condition: 'configured',
      returnValue: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/user.read',
    },
  ])('Should return $returnValue if $condition', async ({ returnValue }) => {
    microsoftAccessTokenProvider = returnValue;

    const { result } = renderHook(() => useMicrosoftAccessTokenProvider(), {
      wrapper: apiWrapper,
    });

    expect(result.current).toEqual(returnValue);
  });
});

describe('useCustomMicrosoftAccessTokenProvider', () => {
  let microsoftAccessTokenProvider: string =
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/user.read';

  const apiWrapper = ({ children }: PropsWithChildren) => (
    <TestApiProvider
      apis={[
        [
          configApiRef,
          new ConfigReader({
            kubernetes: {
              auth: {
                microsoft: {
                  scope: microsoftAccessTokenProvider,
                },
              },
            },
          }),
        ],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  it.each([
    {
      condition: 'configured',
      returnValue: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/user.read',
    },
  ])('Should return $returnValue if $condition', async ({ returnValue }) => {
    microsoftAccessTokenProvider = returnValue;

    const { result } = renderHook(() => useMicrosoftAccessTokenProvider(), {
      wrapper: apiWrapper,
    });

    expect(result.current).toEqual(returnValue);
  });
});
