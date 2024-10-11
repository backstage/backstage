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
import { DefaultScaffolderFormHooksApi } from '../api/FormHooksApi';
import { createScaffolderFormHook } from '@backstage/plugin-scaffolder-react/alpha';
import { createApiRef } from '@backstage/core-plugin-api';

import { TestApiProvider, withLogCollector } from '@backstage/test-utils';
import { renderHook } from '@testing-library/react';
import { useFormHooks } from './useFormHooks';
import React from 'react';
import { formHooksApiRef } from '../api/ref';

describe('useFormHooks', () => {
  const mockApiRef = createApiRef<{
    test: (input: string) => void;
  }>({ id: 'test' });

  const mockApiImplementation = { test: jest.fn() };

  const mockHook = createScaffolderFormHook({
    id: 'test',
    deps: { mockApiRef },
    schema: {
      input: {
        test: z => z.string(),
      },
    },
    async fn({ input: { test } }, { mockApiRef: mock }) {
      mock.test(test);
    },
  });

  it('should wrap up the form hooks', async () => {
    const renderedHook = renderHook(() => useFormHooks(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [mockApiRef, mockApiImplementation],
            [
              formHooksApiRef,
              // @ts-expect-error - todo
              DefaultScaffolderFormHooksApi.create({ hooks: [mockHook] }),
            ],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    const result = renderedHook.result.current!;

    expect(result.size).toBe(1);

    const testHook = result.get('test')!;
    expect(testHook).toBeDefined();

    await testHook.fn({
      setSecrets: () => {},
      input: { test: 'input value' },
    });

    expect(mockApiImplementation.test).toHaveBeenCalledWith('input value');
  });

  it('should skip failing deps', async () => {
    const { error } = await withLogCollector(async () => {
      const renderedHook = renderHook(() => useFormHooks(), {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [
                formHooksApiRef,
                // @ts-expect-error - todo
                DefaultScaffolderFormHooksApi.create({ hooks: [mockHook] }),
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

    expect(error[0]).toMatchInlineSnapshot(
      `[Error: Failed to resolve apiRef test for form hook test]`,
    );
  });
});
