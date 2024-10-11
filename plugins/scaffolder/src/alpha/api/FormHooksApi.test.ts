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
import { DefaultScaffolderFormHooksApi } from './FormHooksApi';
import { createScaffolderFormHook } from '@backstage/plugin-scaffolder-react/alpha';
import { createApiRef } from '@backstage/core-plugin-api';

import { TestApiRegistry, withLogCollector } from '@backstage/test-utils';

describe('FormHooksApi', () => {
  const mockApiRef = createApiRef<{
    test: (input: string) => void;
  }>({ id: 'test' });
  const mockApiImplementation = { test: jest.fn() };

  it('should wrap up the form hooks', async () => {
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

    const hooks = new DefaultScaffolderFormHooksApi({
      formHooks: [mockHook],
      apiHolder: TestApiRegistry.from([mockApiRef, mockApiImplementation]),
    });

    const formHooks = await hooks.getFormHooks();
    const [boundHook] = formHooks;

    expect(formHooks.length).toBe(1);
    expect(boundHook.id).toBe('test');

    await boundHook.fn({ setSecret: () => {}, input: { test: 'input value' } });
    expect(mockApiImplementation.test).toHaveBeenCalledWith('input value');
  });

  it('should skip failing deps', async () => {
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

    const hooks = new DefaultScaffolderFormHooksApi({
      formHooks: [mockHook],
      apiHolder: TestApiRegistry.from(),
    });

    const { error } = await withLogCollector(async () => {
      const formHooks = await hooks.getFormHooks();
      expect(formHooks.length).toBe(0);
    });

    expect(error[0]).toMatchInlineSnapshot(
      `[Error: Failed to resolve apiRef test for form hook test - it will be disabled]`,
    );
  });
});
