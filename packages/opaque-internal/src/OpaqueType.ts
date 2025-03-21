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
    versions: { version: string | undefined };
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
      versions: { version: string | undefined };
    },
  >(options: {
    type: T['public']['$$type'];
    versions: Array<T['versions']['version']>;
  }) {
    return new OpaqueType<T>(options.type, new Set(options.versions));
  }

  #type: string;
  #versions: Set<string | undefined>;

  private constructor(type: string, versions: Set<string | undefined>) {
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
   * @returns True if the value matches this opaque type
   */
  isType = (value: unknown): value is T['public'] => {
    return this.#isThisInternalType(value);
  };

  /**
   * @param value Input value expected to be an instance of this opaque type
   * @throws If the value is not an instance of this opaque type or is of an unsupported version
   * @returns The internal version of the opaque type
   */
  toInternal = (value: unknown): T['public'] & T['versions'] => {
    if (!this.#isThisInternalType(value)) {
      throw new TypeError(
        `Invalid opaque type, expected '${
          this.#type
        }', but got '${this.#stringifyUnknown(value)}'`,
      );
    }

    if (!this.#versions.has(value.version)) {
      const versions = Array.from(this.#versions).map(this.#stringifyVersion);
      if (versions.length > 1) {
        versions[versions.length - 1] = `or ${versions[versions.length - 1]}`;
      }
      const expected =
        versions.length > 2 ? versions.join(', ') : versions.join(' ');
      throw new TypeError(
        `Invalid opaque type instance, got version ${this.#stringifyVersion(
          value.version,
        )}, expected ${expected}`,
      );
    }

    return value;
  };

  /**
   * Creates an instance of the opaque type, returning the public type.
   *
   * @param version The version of the instance to create
   * @param value The remaining public and internal properties of the instance
   * @returns An instance of the opaque type
   */
  createInstance<
    TVersion extends T['versions']['version'],
    TPublic extends T['public'],
  >(
    version: TVersion,
    props: Omit<T['public'], '$$type'> &
      (T['versions'] extends infer UVersion
        ? UVersion extends { version: TVersion }
          ? Omit<UVersion, 'version'>
          : never
        : never) &
      Object, // & Object to allow for object properties too, e.g. toString()
  ): TPublic {
    return Object.assign(props as object, {
      $$type: this.#type,
      ...(version && { version }),
    }) as unknown as TPublic;
  }

  #isThisInternalType(value: unknown): value is T['public'] & T['versions'] {
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

  #stringifyVersion = (version: string | undefined) => {
    return version ? `'${version}'` : 'undefined';
  };
}
