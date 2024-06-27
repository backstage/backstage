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

import { ConfigReader } from '@backstage/config';
import {
  readAccessRestrictionsFromConfig,
  readStringOrStringArrayFromConfig,
} from './helpers';
import { JsonObject } from '@backstage/types';
import { mockServices } from '@backstage/backend-test-utils';

describe('readStringOrStringArrayFromConfig', () => {
  it('handles all cases correctly', () => {
    const config = mockServices.rootConfig({
      data: {
        wrongType: 1,
        wrongTypeInArray: [1],
        singleString: 'a',
        spaceSeparatedString: 'a b c',
        commaSeparatedString: 'a,b,c',
        mixedSeparatorsString: 'a b,c  ,, d',
        emptyString: '',
        emptyArray: [],
        simpleArray: ['a', 'b', 'c'],
        arrayWithSeparators: ['a b', 'c,d', 'e'],
        complexDuplicates: ['a', 'a b', 'a', 'b, a'],
      },
    });

    expect(() =>
      readStringOrStringArrayFromConfig(config, 'wrongType'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'wrongType' in 'mock-config', got number, wanted string"`,
    );
    expect(() =>
      readStringOrStringArrayFromConfig(config, 'wrongTypeInArray'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'wrongTypeInArray[0]' in 'mock-config', got number, wanted string-array"`,
    );
    expect(readStringOrStringArrayFromConfig(config, 'singleString')).toEqual([
      'a',
    ]);
    expect(
      readStringOrStringArrayFromConfig(config, 'spaceSeparatedString'),
    ).toEqual(['a', 'b', 'c']);
    expect(
      readStringOrStringArrayFromConfig(config, 'commaSeparatedString'),
    ).toEqual(['a', 'b', 'c']);
    expect(
      readStringOrStringArrayFromConfig(config, 'mixedSeparatorsString'),
    ).toEqual(['a', 'b', 'c', 'd']);
    expect(() =>
      readStringOrStringArrayFromConfig(config, 'emptyString'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'emptyString' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(
      readStringOrStringArrayFromConfig(config, 'emptyArray'),
    ).toBeUndefined();
    expect(readStringOrStringArrayFromConfig(config, 'simpleArray')).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(
      readStringOrStringArrayFromConfig(config, 'arrayWithSeparators'),
    ).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(
      readStringOrStringArrayFromConfig(config, 'complexDuplicates'),
    ).toEqual(['a', 'b']);
  });
});

describe('readAccessRestrictionsFromConfig', () => {
  function r(config: JsonObject) {
    return readAccessRestrictionsFromConfig(new ConfigReader(config));
  }

  it('handles empty / missing restrictions', () => {
    expect(r({})).toBeUndefined();
    expect(r({ accessRestrictions: [] })).toBeUndefined();
  });

  it('handles type errors', () => {
    expect(() =>
      r({ accessRestrictions: 7 }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'accessRestrictions' in 'mock-config', got number, wanted object-array"`,
    );
    expect(() =>
      r({ accessRestrictions: ['hello'] }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'accessRestrictions[0]' in 'mock-config', got string, wanted object-array"`,
    );
    expect(() =>
      r({ accessRestrictions: [{ unknown: {} }] }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid key 'unknown' in 'accessRestrictions' config, expected one of 'plugin', 'permission', 'permissionAttribute'"`,
    );
    expect(() =>
      r({ accessRestrictions: [{ plugin: 7 }] }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'accessRestrictions[0].plugin' in 'mock-config', got number, wanted string"`,
    );
    expect(() =>
      r({ accessRestrictions: [{ plugin: 'valid', permission: 7 }] }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'accessRestrictions[0].permission' in 'mock-config', got number, wanted string"`,
    );
    expect(() =>
      r({ accessRestrictions: [{ plugin: 'valid', permission: [7] }] }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'accessRestrictions[0].permission[0]' in 'mock-config', got number, wanted string-array"`,
    );
    expect(() =>
      r({ accessRestrictions: [{ plugin: 'valid', permissionAttribute: 7 }] }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'accessRestrictions[0].permissionAttribute' in 'mock-config', got number, wanted object"`,
    );
    expect(() =>
      r({
        accessRestrictions: [
          { plugin: 'valid', permissionAttribute: { a: [] } },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid key 'a' in 'permissionAttribute' config, expected 'action'"`,
    );
    expect(() =>
      r({
        accessRestrictions: [
          { plugin: 'valid', permissionAttribute: { action: 7 } },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'accessRestrictions[0].permissionAttribute.action' in 'mock-config', got number, wanted string"`,
    );
    expect(() =>
      r({
        accessRestrictions: [
          { plugin: 'valid', permissionAttribute: { action: 'wrong' } },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid value 'wrong' at 'action' in 'permissionAttributes' config, valid values are 'create', 'read', 'update', 'delete'"`,
    );
  });

  it('parses valid access restrictions', () => {
    expect(
      r({
        accessRestrictions: [
          {
            plugin: 'a',
          },
        ],
      }),
    ).toEqual(
      new Map(
        Object.entries({
          a: {},
        }),
      ),
    );

    expect(
      r({
        accessRestrictions: [
          {
            plugin: 'a',
            permission: 'a, b a',
          },
        ],
      }),
    ).toEqual(
      new Map(
        Object.entries({
          a: { permissionNames: ['a', 'b'] },
        }),
      ),
    );

    expect(
      r({
        accessRestrictions: [
          {
            plugin: 'a',
            permission: ['a', 'b', 'a'],
          },
        ],
      }),
    ).toEqual(
      new Map(
        Object.entries({
          a: { permissionNames: ['a', 'b'] },
        }),
      ),
    );

    expect(
      r({
        accessRestrictions: [
          {
            plugin: 'a',
            permissionAttribute: { action: 'read, update read' },
          },
        ],
      }),
    ).toEqual(
      new Map(
        Object.entries({
          a: { permissionAttributes: { action: ['read', 'update'] } },
        }),
      ),
    );

    expect(
      r({
        accessRestrictions: [
          {
            plugin: 'a',
            permissionAttribute: { action: ['read', 'update', 'read'] },
          },
        ],
      }),
    ).toEqual(
      new Map(
        Object.entries({
          a: { permissionAttributes: { action: ['read', 'update'] } },
        }),
      ),
    );
  });
});
