/*
 * Copyright 2020 The Backstage Authors
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

import { render, renderHook, screen } from '@testing-library/react';
import { createVersionedContextForTesting } from '@backstage/version-bridge';
import { createApiRef } from './ApiRef';
import { useApi, withApis } from './useApi';

describe('useApi', () => {
  const context = createVersionedContextForTesting('api-context');

  afterEach(() => {
    context.reset();
  });

  it('should resolve routes', () => {
    const get = jest.fn(() => 'my-api-impl');
    context.set({ 1: { get } });

    const apiRef = createApiRef<string>({ id: 'x' });
    const renderedHook = renderHook(() => useApi(apiRef));

    const value = renderedHook.result.current;
    expect(value).toBe('my-api-impl');
    expect(get).toHaveBeenCalledWith(apiRef);
  });
});

describe('withApis', () => {
  const context = createVersionedContextForTesting('api-context');

  afterEach(() => {
    context.reset();
  });

  it('injects APIs and forwards other props through the shared API context', () => {
    const messageRef = createApiRef<() => string>({ id: 'message' });
    const get = jest.fn(() => () => 'hello');
    context.set({ 1: { get } });
    const apis = Object.assign(Object.create(null), { message: messageRef });
    const Component = withApis<{ message: () => string }>(apis)(
      ({ message, suffix }: { message: () => string; suffix: string }) => (
        <p>
          {message()}
          {suffix}
        </p>
      ),
    );

    render(<Component suffix="!" />);

    expect(screen.getByText('hello!')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith(messageRef);
    expect(Component.displayName).toBe('withApis(Component)');
  });
});
