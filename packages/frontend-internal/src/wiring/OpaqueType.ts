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

// TODO(Rugvip): This lives here temporarily, but should be moved to a more
// central location. It's useful for backend packages too so we'll need to have
// it in a common package, but it might also be that we want to make it
// available publicly too in which case it would make sense to have this be part
// of @backstage/version-bridge. The problem with exporting it from there is
// that it would need to be very stable at that point, so it might be a bit
// early to put it there already.

/**
 * A helper for working with opaque types.
 */
export class OpaqueType<
  T extends {
    public: { $$type: string };
    versions: { version: string };
  },
> {
  /**
   * Creates a new opaque type.
   *
   * @param options.type The type identifier of the opaque type
   * @param options.versions The available versions of the opaque type
   * @returns A new opaque type helper
   */
  static create<
    T extends {
      public: { $$type: string };
      versions: { version: string };
    },
  >(options: {
    type: T['public']['$$type'];
    versions: Array<T['versions']['version']>;
  }) {
    return new OpaqueType<T>(options.type, new Set(options.versions));
  }

  #type: string;
  #versions: Set<string>;

  private constructor(type: string, versions: Set<string>) {
    this.#type = type;
    this.#versions = versions;
  }

  /**
   * The internal version of the opaque type, used like this: `typeof MyOpaqueType.TPublic`
   *
   * @remarks
   *
   * This property is only useful for type checking, its runtime value is `undefined`.
   */
  TPublic: T['public'] = undefined as any;

  /**
   * The internal version of the opaque type, used like this: `typeof MyOpaqueType.TInternal`
   *
   * @remarks
   *
   * This property is only useful for type checking, its runtime value is `undefined`.
   */
  TInternal: T['public'] & T['versions'] = undefined as any;

  /**
   * @param value Input value expected to be an instance of this opaque type
   * @throws If the value is not an instance of this opaque type
   * @returns The internal version of the opaque type
   */
  toInternal(value: unknown): T['public'] & T['versions'] {
    if (!this.#isThisType(value)) {
      throw new Error(
        `Invalid opaque type, expected '${
          this.#type
        }', but got '${this.#stringifyUnknown(value)}'`,
      );
    }
    this.#throwIfInvalidVersion(value.version);
    return value;
  }

  /**
   * @param value Input value expected to be an instance of this opaque type
   * @returns True if the value matches this opaque type
   */
  isInternal(value: unknown): value is T['public'] & T['versions'] {
    if (!this.#isThisType(value)) {
      return false;
    }
    this.#throwIfInvalidVersion(value.version);
    return true;
  }

  /**
   * @param version The expected version of the opaque type
   * @param value Input value expected to be an instance of this opaque type
   * @returns True if the value matches this opaque type and is the expected version
   */
  isVersion<TVersion extends T['versions']['version']>(
    version: TVersion,
    value: unknown,
  ): value is T['public'] &
    (T['versions'] extends infer UVersion
      ? UVersion extends { version: TVersion }
        ? UVersion
        : never
      : never) {
    return this.#isThisType(value) && value.version === version;
  }

  /**
   * Creates an instance of the opaque type, returning the public public type.
   *
   * By providing a type argument you can narrow the return to specific type parameters.
   */
  create<TBase extends T['public'] = T['public']>(
    value: T['public'] & T['versions'] & Object, // & Object to allow for object properties too, e.g. toString()
  ): TBase {
    return value as unknown as TBase;
  }

  #throwIfInvalidVersion(version: string) {
    if (!this.#versions.has(version)) {
      const versionsStr = Array.from(this.#versions).join("', '");
      throw new Error(
        `Invalid opaque type instance, bad version '${version}', expected one of '${versionsStr}'`,
      );
    }
  }

  #isThisType(value: unknown): value is T['public'] & T['versions'] {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    return (value as T['public']).$$type === this.#type;
  }

  #stringifyUnknown(value: unknown) {
    if (typeof value !== 'object') {
      return `<${typeof value}>`;
    }
    if (value === null) {
      return '<null>';
    }
    if ('$$type' in value) {
      return String(value.$$type);
    }
    return String(value);
  }
}
