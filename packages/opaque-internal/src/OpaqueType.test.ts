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

import { OpaqueType } from './OpaqueType';

describe('OpaqueType', () => {
  it('should create a basic opaque type with a single version', () => {
    type MyType = {
      $$type: 'my-type';
    };

    const OpaqueMyType = OpaqueType.create<{
      public: MyType;
      versions: {
        version: 'v1';
        foo: string;
      };
    }>({
      type: 'my-type',
      versions: ['v1'],
    });

    // @ts-expect-error - unsupported version
    OpaqueMyType.createInstance('v2', {
      foo: 'bar',
    });

    // @ts-expect-error - missing internal field
    OpaqueMyType.createInstance('v1', {});

    OpaqueMyType.createInstance('v1', {
      // @ts-expect-error - invalid internal field
      foo: 3,
    });

    const myInstance = OpaqueMyType.createInstance('v1', {
      foo: 'bar',
    });

    expect(myInstance.$$type).toBe('my-type');
    // @ts-expect-error - version field not accessible
    expect(myInstance.version).toBe('v1');
    // @ts-expect-error - internal field not accessible
    expect(myInstance.foo).toBe('bar');

    expect(OpaqueMyType.isType(myInstance)).toBe(true);
    expect(OpaqueMyType.isType('hello')).toBe(false);
    expect(OpaqueMyType.isType({ $$type: 'some-other' })).toBe(false);
    expect(OpaqueMyType.isType({ $$type: 'my-type' })).toBe(true);

    const myInternal = OpaqueMyType.toInternal(myInstance);
    expect(myInternal).toBe(myInstance);
    // All fields accessible
    expect(myInternal.$$type).toBe('my-type');
    expect(myInternal.version).toBe('v1');
    expect(myInternal.foo).toBe('bar');

    expect(() =>
      OpaqueMyType.toInternal('hello'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got '<string>'"`,
    );
    expect(() => OpaqueMyType.toInternal(3)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got '<number>'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal(undefined),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got '<undefined>'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal(Symbol('wat')),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got '<symbol>'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal(null),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got '<null>'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal(() => {}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got '<function>'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'some-other-type' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got 'some-other-type'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal({ an: 'object' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type, expected 'my-type', but got '[object Object]'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'my-type' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type instance, got version undefined, expected 'v1'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'my-type', version: 'v0' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type instance, got version 'v0', expected 'v1'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'my-type', version: { foo: 'bar' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type instance, got version '[object Object]', expected 'v1'"`,
    );
  });

  it('should create a basic opaque type with multiple versions', () => {
    type MyType = {
      $$type: 'my-type';
    };

    const OpaqueMyType = OpaqueType.create<{
      public: MyType;
      versions:
        | {
            version: 'v1';
            foo: string;
          }
        | {
            version: 'v2';
            bar: string;
          }
        | {
            version: 'v3';
            baz: string;
          };
    }>({
      type: 'my-type',
      versions: ['v1', 'v2', 'v3'],
    });

    // @ts-expect-error - unsupported version
    OpaqueMyType.createInstance('v0', {
      foo: 'bar',
    });

    // @ts-expect-error - missing internal field
    OpaqueMyType.createInstance('v1', {});

    OpaqueMyType.createInstance('v1', {
      // @ts-expect-error - invalid internal field
      foo: 3,
    });

    OpaqueMyType.createInstance('v2', {
      // @ts-expect-error - version mismatch
      foo: 'bar',
    });

    OpaqueMyType.createInstance('v1', {
      // @ts-expect-error - version mismatch
      bar: 'foo',
    });

    const myInstanceV1 = OpaqueMyType.createInstance('v1', {
      foo: 'bar',
    });

    const myInstanceV2 = OpaqueMyType.createInstance('v2', {
      bar: 'foo',
    });

    expect(myInstanceV1.$$type).toBe('my-type');
    // @ts-expect-error - version field not accessible
    expect(myInstanceV1.version).toBe('v1');
    // @ts-expect-error - internal field not accessible
    expect(myInstanceV1.foo).toBe('bar');

    expect(myInstanceV2.$$type).toBe('my-type');
    // @ts-expect-error - version field not accessible
    expect(myInstanceV2.version).toBe('v2');
    // @ts-expect-error - internal field not accessible
    expect(myInstanceV2.bar).toBe('foo');

    expect(OpaqueMyType.isType(myInstanceV1)).toBe(true);
    expect(OpaqueMyType.isType(myInstanceV2)).toBe(true);
    expect(OpaqueMyType.isType('hello')).toBe(false);

    const myInternalV1 = OpaqueMyType.toInternal(myInstanceV1);
    expect(myInternalV1).toBe(myInstanceV1);
    // All fields accessible
    expect(myInternalV1.$$type).toBe('my-type');
    expect(myInternalV1.version).toBe('v1');
    // @ts-expect-error - version has not been narrowed down
    expect(myInternalV1.foo).toBe('bar');

    const myInternalV2 = OpaqueMyType.toInternal(myInstanceV2);
    expect(myInternalV2).toBe(myInstanceV2);
    // All fields accessible
    expect(myInternalV2.$$type).toBe('my-type');
    expect(myInternalV2.version).toBe('v2');
    // @ts-expect-error - version has not been narrowed down
    expect(myInternalV2.bar).toBe('foo');

    // Narrowing the version allows access to internal fields
    expect(myInternalV1.version === 'v1' && myInternalV1.foo).toBe('bar');
    expect(myInternalV2.version === 'v2' && myInternalV2.bar).toBe('foo');

    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'my-type' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type instance, got version undefined, expected 'v1', 'v2', or 'v3'"`,
    );
    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'my-type', version: 'v0' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type instance, got version 'v0', expected 'v1', 'v2', or 'v3'"`,
    );
  });

  it('should support undefined version for backwards compatibility', () => {
    type MyType = {
      $$type: 'my-type';
    };

    const OpaqueMyType = OpaqueType.create<{
      public: MyType;
      versions: {
        version: undefined;
        foo: string;
      };
    }>({
      type: 'my-type',
      versions: [undefined],
    });

    // @ts-expect-error - unsupported version
    OpaqueMyType.createInstance('v1', {
      foo: 'bar',
    });

    // @ts-expect-error - missing internal field
    OpaqueMyType.createInstance(undefined, {});

    OpaqueMyType.createInstance(undefined, {
      // @ts-expect-error - invalid internal field
      foo: 3,
    });

    const myInstance = OpaqueMyType.createInstance(undefined, {
      foo: 'bar',
    });

    expect(myInstance.$$type).toBe('my-type');
    // @ts-expect-error - version field not accessible
    expect(myInstance.version).toBe(undefined);
    // @ts-expect-error - internal field not accessible
    expect(myInstance.foo).toBe('bar');

    expect(OpaqueMyType.isType(myInstance)).toBe(true);
    expect(OpaqueMyType.isType('hello')).toBe(false);

    const myInternal = OpaqueMyType.toInternal(myInstance);
    expect(myInternal).toBe(myInstance);
    // All fields accessible
    expect(myInternal.$$type).toBe('my-type');
    expect(myInternal.version).toBe(undefined);
    expect(myInternal.foo).toBe('bar');

    expect(OpaqueMyType.toInternal({ $$type: 'my-type' })).toBeDefined();
    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'my-type', version: 'v0' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type instance, got version 'v0', expected undefined"`,
    );
  });

  it('should support undefined version mixed with defined versions', () => {
    type MyType = {
      $$type: 'my-type';
    };

    const OpaqueMyType = OpaqueType.create<{
      public: MyType;
      versions:
        | {
            version: 'v1';
            foo: string;
          }
        | {
            version: undefined;
            bar: string;
          };
    }>({
      type: 'my-type',
      versions: [undefined, 'v1'],
    });

    // @ts-expect-error - unsupported version
    OpaqueMyType.createInstance('v0', {
      foo: 'bar',
    });

    // @ts-expect-error - missing internal field
    OpaqueMyType.createInstance('v1', {});

    OpaqueMyType.createInstance('v1', {
      // @ts-expect-error - invalid internal field
      foo: 3,
    });

    OpaqueMyType.createInstance(undefined, {
      // @ts-expect-error - version mismatch
      foo: 'bar',
    });

    OpaqueMyType.createInstance('v1', {
      // @ts-expect-error - version mismatch
      bar: 'foo',
    });

    const myInstanceV1 = OpaqueMyType.createInstance('v1', {
      foo: 'bar',
    });

    const myInstanceV2 = OpaqueMyType.createInstance(undefined, {
      bar: 'foo',
    });

    expect(myInstanceV1.$$type).toBe('my-type');
    // @ts-expect-error - version field not accessible
    expect(myInstanceV1.version).toBe('v1');
    // @ts-expect-error - internal field not accessible
    expect(myInstanceV1.foo).toBe('bar');

    expect(myInstanceV2.$$type).toBe('my-type');
    // @ts-expect-error - version field not accessible
    expect(myInstanceV2.version).toBe(undefined);
    // @ts-expect-error - internal field not accessible
    expect(myInstanceV2.bar).toBe('foo');

    expect(OpaqueMyType.isType(myInstanceV1)).toBe(true);
    expect(OpaqueMyType.isType(myInstanceV2)).toBe(true);
    expect(OpaqueMyType.isType('hello')).toBe(false);

    const myInternalV1 = OpaqueMyType.toInternal(myInstanceV1);
    expect(myInternalV1).toBe(myInstanceV1);
    // All fields accessible
    expect(myInternalV1.$$type).toBe('my-type');
    expect(myInternalV1.version).toBe('v1');
    // @ts-expect-error - version has not been narrowed down
    expect(myInternalV1.foo).toBe('bar');

    const myInternalV2 = OpaqueMyType.toInternal(myInstanceV2);
    expect(myInternalV2).toBe(myInstanceV2);
    // All fields accessible
    expect(myInternalV2.$$type).toBe('my-type');
    expect(myInternalV2.version).toBe(undefined);
    // @ts-expect-error - version has not been narrowed down
    expect(myInternalV2.bar).toBe('foo');

    // Narrowing the version allows access to internal fields
    expect(myInternalV1.version === 'v1' && myInternalV1.foo).toBe('bar');
    expect(myInternalV2.version === undefined && myInternalV2.bar).toBe('foo');

    expect(OpaqueMyType.toInternal({ $$type: 'my-type' })).toBeDefined();
    expect(() =>
      OpaqueMyType.toInternal({ $$type: 'my-type', version: 'v3' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid opaque type instance, got version 'v3', expected undefined or 'v1'"`,
    );
  });

  it('should create an empty opaque type with no versions', () => {
    type MyType = {
      $$type: 'my-type';
    };

    const OpaqueMyType = OpaqueType.create<{
      public: MyType;
      versions: {
        version: undefined;
      };
    }>({
      type: 'my-type',
      versions: [undefined],
    });

    // @ts-expect-error - unsupported version
    OpaqueMyType.createInstance('v0', {
      foo: 'bar',
    });

    const myInstance = OpaqueMyType.createInstance(undefined, {});

    expect(myInstance.$$type).toBe('my-type');

    expect(OpaqueMyType.isType(myInstance)).toBe(true);
    expect(OpaqueMyType.isType('hello')).toBe(false);

    const myInternal = OpaqueMyType.toInternal(myInstance);
    expect(myInternal).toBe(myInstance);
    // All fields accessible
    expect(myInternal.$$type).toBe('my-type');
    expect(myInternal.version).toBe(undefined);
  });

  it('should work with class implementations', () => {
    type MyType = {
      $$type: 'my-type';
    };

    const OpaqueMyType = OpaqueType.create<{
      public: MyType;
      versions: {
        version: 'v1';
        getX(): number;
      };
    }>({
      type: 'my-type',
      versions: ['v1'],
    });

    class MyTypeImpl {
      getX() {
        return 4;
      }
    }

    const myInstance = OpaqueMyType.createInstance('v1', new MyTypeImpl());

    expect(myInstance.$$type).toBe('my-type');

    expect(OpaqueMyType.isType(myInstance)).toBe(true);

    const myInternal = OpaqueMyType.toInternal(myInstance);
    expect(myInternal).toBe(myInstance);

    expect(myInternal.$$type).toBe('my-type');
    expect(myInternal.version).toBe('v1');
    expect(myInternal.getX()).toBe(4);
  });
});
