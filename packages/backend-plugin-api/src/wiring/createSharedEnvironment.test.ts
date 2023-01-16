/*
 * Copyright 2023 The Backstage Authors
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

import {
  createServiceFactory,
  createServiceRef,
  ServiceFactoryOrFunction,
} from '../services';
import {
  createSharedEnvironment,
  InternalSharedBackendEnvironment,
} from './createSharedEnvironment';

const fooService = createServiceRef<string>({ id: 'foo', scope: 'root' });
const fooFactory = createServiceFactory({
  service: fooService,
  deps: {},
  async factory() {
    return 'foo';
  },
});

const barService = createServiceRef<number>({ id: 'bar', scope: 'root' });
const barFactory = createServiceFactory({
  service: barService,
  deps: {},
  async factory() {
    return 0xba5;
  },
});

describe('createSharedEnvironment', () => {
  it('should create an empty shared environment', () => {
    const env = createSharedEnvironment({});
    expect(env).toBeDefined();
    const internalEnv = env() as unknown as InternalSharedBackendEnvironment;
    expect(internalEnv).toEqual({
      $$type: 'SharedBackendEnvironment',
      version: 'v1',
      services: undefined,
    });
  });

  it('should create a shared environment with services', () => {
    const env = createSharedEnvironment({
      services: [fooFactory, barFactory()],
    });
    const internalEnv = env() as unknown as InternalSharedBackendEnvironment;
    expect(internalEnv.version).toBe('v1');
    expect(internalEnv.services?.length).toBe(2);
    expect(internalEnv.services?.[0]?.service.id).toBe('foo');
    expect(internalEnv.services?.[1]?.service.id).toBe('bar');
  });

  it('should create a shared environment with options', () => {
    const env = createSharedEnvironment((options?: { withFoo?: boolean }) => {
      const services = new Array<ServiceFactoryOrFunction>();
      if (options?.withFoo) {
        services.push(fooFactory());
      }
      services.push(barFactory);
      return { services };
    });
    const internalEnv1 = env() as unknown as InternalSharedBackendEnvironment;
    expect(internalEnv1.version).toBe('v1');
    expect(internalEnv1.services?.length).toBe(1);
    expect(internalEnv1.services?.[0]?.service.id).toBe('bar');

    const internalEnv2 = env({
      withFoo: true,
    }) as unknown as InternalSharedBackendEnvironment;
    expect(internalEnv2.version).toBe('v1');
    expect(internalEnv2.services?.length).toBe(2);
    expect(internalEnv2.services?.[0]?.service.id).toBe('foo');
    expect(internalEnv2.services?.[1]?.service.id).toBe('bar');
  });

  it('should not allow duplicate service factories', () => {
    expect(() =>
      createSharedEnvironment({
        services: [fooFactory, fooFactory()],
      })(),
    ).toThrow(
      "Duplicate service implementations provided in shared environment for 'foo'",
    );
  });
});
