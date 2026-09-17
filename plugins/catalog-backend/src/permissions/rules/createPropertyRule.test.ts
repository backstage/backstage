/*
 * Copyright 2021 The Backstage Authors
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

import { createPropertyRule } from './createPropertyRule';

describe('createPropertyRule', () => {
  const { name, description, apply, toQuery } = createPropertyRule('metadata');

  it('formats the rule name correctly', () => {
    expect(name).toBe('HAS_METADATA');
  });

  it('formats the rule description correctly', () => {
    expect(description).toBe(
      'Allow entities with the specified metadata subfield',
    );
  });

  describe('apply', () => {
    describe('key only', () => {
      it('returns false when specified key is not present', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
              },
            },
            {
              key: 'org.name',
            },
          ),
        ).toBe(false);
      });

      it('returns false when specified key is an empty array', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                tags: [],
              },
            },
            {
              key: 'tags',
            },
          ),
        ).toBe(false);
      });

      it('returns true when specified key is present', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                org: {
                  name: 'test-org',
                },
              },
            },
            {
              key: 'org.name',
            },
          ),
        ).toBe(true);
      });

      it('returns true when specified key is an array containing more than an element', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                tags: ['java'],
              },
            },
            {
              key: 'tags',
            },
          ),
        ).toBe(true);
      });

      it.each([false, 0, ''])(
        'returns true when the specified key has the falsy scalar value %p',
        fieldValue => {
          const specRule = createPropertyRule('spec');

          expect(
            specRule.apply(
              {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component',
                metadata: {
                  name: 'test-component',
                },
                spec: {
                  field: fieldValue,
                },
              },
              {
                key: 'field',
              },
            ),
          ).toBe(true);
        },
      );
    });

    describe('key and value', () => {
      it('returns false when specified key is not present', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
              },
            },
            {
              key: 'org.name',
              value: 'test-org',
            },
          ),
        ).toBe(false);
      });

      it('returns false when specified value is not present', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                org: {
                  name: 'another-org',
                },
              },
            },
            {
              key: 'org.name',
              value: 'test-org',
            },
          ),
        ).toBe(false);
      });

      it(`returns false when key is an array and doesn't contain the specified value`, () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                tags: ['java'],
              },
            },
            {
              key: 'tags',
              value: 'python',
            },
          ),
        ).toBe(false);
      });

      it('returns true when specified key and value is present', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                org: {
                  name: 'test-org',
                },
              },
            },
            {
              key: 'org.name',
              value: 'test-org',
            },
          ),
        ).toBe(true);
      });

      it(`returns true when key is an array and contains the specified value`, () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                tags: ['java', 'java11'],
              },
            },
            {
              key: 'tags',
              value: 'java',
            },
          ),
        ).toBe(true);
      });

      it('matches metadata string values case-insensitively', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                namespace: 'Internal',
              },
            },
            {
              key: 'namespace',
              value: 'internal',
            },
          ),
        ).toBe(true);
      });

      it('matches nested property keys case-insensitively', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                org: {
                  name: 'test-org',
                },
              },
            },
            {
              key: 'ORG.NAME',
              value: 'test-org',
            },
          ),
        ).toBe(true);
      });

      it.each([
        [false, 'false'],
        [0, '0'],
      ])(
        'matches the scalar value %p using its indexed string value',
        (fieldValue, value) => {
          const specRule = createPropertyRule('spec');

          expect(
            specRule.apply(
              {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component',
                metadata: {
                  name: 'test-component',
                },
                spec: {
                  field: fieldValue,
                },
              },
              {
                key: 'field',
                value,
              },
            ),
          ).toBe(true);
        },
      );

      it('matches metadata array values case-insensitively', () => {
        expect(
          apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
                tags: ['Java'],
              },
            },
            {
              key: 'tags',
              value: 'java',
            },
          ),
        ).toBe(true);
      });

      it('matches spec string values case-insensitively', () => {
        const specRule = createPropertyRule('spec');

        expect(
          specRule.apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
              },
              spec: {
                owner: 'Group:Default/Test',
              },
            },
            {
              key: 'owner',
              value: 'group:default/test',
            },
          ),
        ).toBe(true);
      });

      it('matches spec array values case-insensitively', () => {
        const specRule = createPropertyRule('spec');

        expect(
          specRule.apply(
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test-component',
              },
              spec: {
                audiences: ['Internal'],
              },
            },
            {
              key: 'audiences',
              value: 'internal',
            },
          ),
        ).toBe(true);
      });
    });
  });

  describe('toQuery', () => {
    it('returns an appropriate catalog-backend filter', () => {
      expect(
        toQuery({
          key: 'backstage.io/test-component',
        }),
      ).toEqual({
        key: 'metadata.backstage.io/test-component',
      });
    });
  });
});
