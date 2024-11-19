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
import { DefaultScaffolderFormDecoratorsApi } from '../api/FormDecoratorsApi';
import { createScaffolderFormDecorator } from '@backstage/plugin-scaffolder-react/alpha';
import { createApiRef } from '@backstage/core-plugin-api';

import { TestApiProvider } from '@backstage/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { useFormDecorators } from './useFormDecorators';
import React from 'react';
import { formDecoratorsApiRef } from '../api/ref';

describe('useFormDecorators', () => {
  const mockApiRef = createApiRef<{
    test: (input: string) => void;
  }>({ id: 'test' });

  const mockApiImplementation = { test: jest.fn() };

  const mockDecorator = createScaffolderFormDecorator({
    id: 'test',
    deps: { mockApiRef },
    schema: {
      input: {
        test: z => z.string(),
      },
    },
    async decorator({ input: { test } }, { mockApiRef: mock }) {
      mock.test(test);
    },
  });

  it('should wrap up the form decorators', async () => {
    const renderedHook = renderHook(() => useFormDecorators(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [mockApiRef, mockApiImplementation],
            [
              formDecoratorsApiRef,
              DefaultScaffolderFormDecoratorsApi.create({
                decorators: [mockDecorator],
              }),
            ],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    await waitFor(async () => {
      const result = renderedHook.result.current!;

      expect(result.size).toBe(1);

      const testDecorator = result.get('test')!;
      expect(testDecorator).toBeDefined();

      await testDecorator.decorator({
        formState: {},
        setFormState: () => {},
        setSecrets: () => {},
        input: { test: 'input value' },
      });

      expect(mockApiImplementation.test).toHaveBeenCalledWith('input value');
    });
  });

  it('should skip failing deps', async () => {
    const renderedHook = renderHook(() => useFormDecorators(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [
              formDecoratorsApiRef,
              DefaultScaffolderFormDecoratorsApi.create({
                decorators: [mockDecorator],
              }),
            ],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    const result = renderedHook.result.current!;
    expect(result.size).toBe(0);
  });
});
