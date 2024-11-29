/*
 * Copyright 2022 The Backstage Authors
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
import { useTemplateSecrets, SecretsContextProvider } from './SecretsContext';
import { renderHook, act } from '@testing-library/react';

describe('SecretsContext', () => {
  it('should allow the setting of secrets in the context', async () => {
    const { result } = renderHook(
      () => ({
        hook: useTemplateSecrets(),
      }),
      {
        wrapper: ({ children }: React.PropsWithChildren<{}>) => (
          <SecretsContextProvider>{children}</SecretsContextProvider>
        ),
      },
    );
    expect(result.current.hook?.secrets.foo).toEqual(undefined);

    act(() => result.current.hook.setSecrets({ foo: 'bar' }));

    expect(result.current.hook?.secrets.foo).toEqual('bar');
  });

  it('should create SecretsContextProvider with initial secrets', async () => {
    const { result } = renderHook(
      () => ({
        hook: useTemplateSecrets(),
      }),
      {
        wrapper: ({ children }: React.PropsWithChildren<{}>) => (
          <SecretsContextProvider initialSecrets={{ foo: 'bar' }}>
            {children}
          </SecretsContextProvider>
        ),
      },
    );
    expect(result.current.hook?.secrets.foo).toEqual('bar');
  });
});
