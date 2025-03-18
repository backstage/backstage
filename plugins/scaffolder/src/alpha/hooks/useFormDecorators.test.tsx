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
import { createApiRef, errorApiRef } from '@backstage/core-plugin-api';

import { TestApiProvider } from '@backstage/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { useFormDecorators } from './useFormDecorators';
import React from 'react';
import { formDecoratorsApiRef } from '../api/ref';
import { TemplateParameterSchema } from '@backstage/plugin-scaffolder-react';

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

  const manifest: TemplateParameterSchema = {
    EXPERIMENTAL_formDecorators: [{ id: 'test', input: { test: 'hello' } }],
    steps: [],
    title: 'test',
  };

  it('should run the form decorators for a given manifest with the correct input', async () => {
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
            [errorApiRef, { post: () => {} }],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    await waitFor(async () => {
      const result = renderedHook.result.current!;

      await result.run({
        formState: {},
        secrets: {},
        manifest,
      });

      expect(mockApiImplementation.test).toHaveBeenCalledWith('hello');
    });
  });

  it('should return existing secrets and formstate', async () => {
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
            [errorApiRef, { post: () => {} }],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });
    await waitFor(async () => {
      const result = renderedHook.result.current!;

      const { secrets, formState } = await result.run({
        formState: { test: 'formState' },
        secrets: { test: 'hello' },
        manifest,
      });

      expect(secrets).toEqual({ test: 'hello' });
      expect(formState).toEqual({ test: 'formState' });
    });
  });

  it('should allow merging of existing secrets and formstate', async () => {
    const secretAndFormDataModifier = createScaffolderFormDecorator({
      id: 'test',
      async decorator({ setFormState, setSecrets }) {
        setFormState(state => ({ ...state, new: 'formState' }));
        setSecrets(state => ({ ...state, new: 'hello' }));
      },
    });
    const renderedHook = renderHook(() => useFormDecorators(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [mockApiRef, mockApiImplementation],
            [
              formDecoratorsApiRef,
              DefaultScaffolderFormDecoratorsApi.create({
                decorators: [mockDecorator, secretAndFormDataModifier],
              }),
            ],
            [errorApiRef, { post: () => {} }],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });
    await waitFor(async () => {
      const result = renderedHook.result.current!;

      const { secrets, formState } = await result.run({
        formState: { test: 'formState' },
        secrets: { test: 'hello' },
        manifest,
      });

      expect(secrets).toEqual({ test: 'hello', new: 'hello' });
      expect(formState).toEqual({ test: 'formState', new: 'formState' });
    });
  });
});
