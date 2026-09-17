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

import { createApiRef } from '@backstage/frontend-plugin-api';
import { createApiMock } from './createApiMock';
import { getMockApiFactory } from './MockWithApiFactory';

describe('createApiMock', () => {
  type TestApi = {
    greet(name: string): string;
    count: number;
  };

  const testApiRef = createApiRef<TestApi>({ id: 'test.create-mock' });

  it('returns a factory function that produces jest mocks', () => {
    const mock = createApiMock(testApiRef, () => ({
      greet: jest.fn(),
      count: 0 as any,
    }));

    const api = mock();
    api.greet('world');
    expect(api.greet).toHaveBeenCalledTimes(1);
    expect(api.greet).toHaveBeenCalledWith('world');
  });

  it('applies partial implementations via mockImplementation', () => {
    const mock = createApiMock(testApiRef, () => ({
      greet: jest.fn(),
      count: 0 as any,
    }));

    const api = mock({ greet: (name: string) => `Hello ${name}!` });
    expect(api.greet('world')).toBe('Hello world!');
    expect(api.greet).toHaveBeenCalledTimes(1);
  });

  it('preserves non-function partial values', () => {
    const mock = createApiMock(testApiRef, () => ({
      greet: jest.fn(),
      count: 0 as any,
    }));

    const api = mock({ count: 42 });
    expect(api.count).toBe(42);
  });

  it('attaches a mock API factory via the symbol', () => {
    const mock = createApiMock(testApiRef, () => ({
      greet: jest.fn(),
      count: 0 as any,
    }));

    const api = mock();
    const factory = getMockApiFactory(api);
    expect(factory).toBeDefined();
    expect(factory!.api).toBe(testApiRef);
  });

  it('creates fresh mocks on each call', () => {
    const mock = createApiMock(testApiRef, () => ({
      greet: jest.fn(),
      count: 0 as any,
    }));

    const api1 = mock();
    const api2 = mock();
    api1.greet('a');
    expect(api1.greet).toHaveBeenCalledTimes(1);
    expect(api2.greet).toHaveBeenCalledTimes(0);
  });
});
