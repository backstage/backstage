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

import { createServiceFactory, createServiceRef } from './types';

describe('createServiceFactory', () => {
  it('should create a meta factory with no options', () => {
    const ref = createServiceRef<string>({ id: 'x' });
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      async factory(_deps) {
        return async () => 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));
    expect(metaFactory().service).toBe(ref);

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    // @ts-expect-error
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory(null);
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a meta factory with optional options', () => {
    const ref = createServiceRef<string>({ id: 'x' });
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      async factory(_deps, _opts?: { x: number }) {
        return async () => 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a meta factory with required options', () => {
    const ref = createServiceRef<string>({ id: 'x' });
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      async factory(_deps, _opts: { x: number }) {
        return async () => 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    // @ts-expect-error
    metaFactory();
  });

  it('should create a meta factory with optional options as interface', () => {
    interface TestOptions {
      x: number;
    }
    const ref = createServiceRef<string>({ id: 'x' });
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      async factory(_deps, _opts?: TestOptions) {
        return async () => 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    metaFactory(undefined);
    metaFactory();
  });

  it('should create a meta factory with required options as interface', () => {
    interface TestOptions {
      x: number;
    }
    const ref = createServiceRef<string>({ id: 'x' });
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      async factory(_deps, _opts: TestOptions) {
        return async () => 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));

    // @ts-expect-error
    metaFactory('string');
    // @ts-expect-error
    metaFactory({});
    metaFactory({ x: 1 });
    // @ts-expect-error
    metaFactory({ x: 1, y: 2 });
    // @ts-expect-error
    metaFactory(null);
    // @ts-expect-error
    metaFactory(undefined);
    // @ts-expect-error
    metaFactory();
  });

  it('should only allow objects as options', () => {
    const ref = createServiceRef<string>({ id: 'x' });
    const metaFactory = createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: string) {
        return async () => 'x';
      },
    });
    expect(metaFactory).toEqual(expect.any(Function));
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: number) {
        return async () => 'x';
      },
    });
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: symbol) {
        return async () => 'x';
      },
    });
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: bigint) {
        return async () => 'x';
      },
    });
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: 'string') {
        return async () => 'x';
      },
    });
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: Array) {
        return async () => 'x';
      },
    });
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: Map) {
        return async () => 'x';
      },
    });
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: Set) {
        return async () => 'x';
      },
    });
    createServiceFactory({
      service: ref,
      deps: {},
      // @ts-expect-error
      async factory(_deps, _opts: null) {
        return async () => 'x';
      },
    });
  });
});
