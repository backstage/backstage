/*
 * Copyright 2024 The Backstage Authors
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

import { usePodDeleteButtonText } from './usePodDeleteButtonText';

describe('usePodDeleteButtonText', () => {
  let haveButtonText: string | undefined;

  const apiWrapper = ({ children }: PropsWithChildren) => (
    <TestApiProvider
      apis={[
        [
          configApiRef,
          new ConfigReader({
            kubernetes: {
              podDelete: { buttonText: haveButtonText },
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
      returnValue: undefined,
    },
    { condition: 'custom text', returnValue: 'Restart pod' },
  ])('Should return $returnValue if $condition', async ({ returnValue }) => {
    haveButtonText = returnValue;

    const { result } = renderHook(() => usePodDeleteButtonText(), {
      wrapper: apiWrapper,
    });

    expect(result.current).toEqual(returnValue);
  });
});
