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

import { Entity } from '@backstage/catalog-model';
import {
  parseFilterExpression,
  splitFilterExpression,
} from './parseFilterExpression';

describe('parseFilterExpression', () => {
  it('supports "kind" expressions', () => {
    const component = { kind: 'Component' } as unknown as Entity;
    const user = { kind: 'User' } as unknown as Entity;
    const resource = { kind: 'Resource' } as unknown as Entity;

    expect(parseFilterExpression('kind:component')(component)).toBe(true);
    expect(parseFilterExpression('kind:componenT')(component)).toBe(true);
    expect(parseFilterExpression('kind:user')(component)).toBe(false);

    // match ANY of the parameters
    expect(parseFilterExpression('kind:user,component')(user)).toBe(true);
    expect(parseFilterExpression('kind:user,component')(component)).toBe(true);
    expect(parseFilterExpression('kind:user,component')(resource)).toBe(false);
  });

  it('supports "is" expressions', () => {
    const empty = {
      metadata: {},
    } as unknown as Entity;
    const orphan = {
      metadata: {
        annotations: { ['backstage.io/orphan']: 'true' },
      },
    } as unknown as Entity;

    expect(parseFilterExpression('is:orphan')(empty)).toBe(false);
    expect(parseFilterExpression('is:orphan')(orphan)).toBe(true);

    expect(() =>
      parseFilterExpression('is:orphan,bar'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'bar' is not a valid parameter for 'is' filter expressions, expected one of 'orphan'"`,
    );
  });

  it('supports "has" expressions', () => {
    const empty1 = {
      metadata: {},
    } as unknown as Entity;
    const empty2 = {
      metadata: {
        labels: {},
        annotations: {},
        links: [],
      },
    } as unknown as Entity;
    const labels = {
      metadata: {
        labels: { a: 'b' },
      },
    } as unknown as Entity;
    const annotations = {
      metadata: {
        annotations: { a: 'b' },
      },
    } as unknown as Entity;
    const links = {
      metadata: { links: [{}] },
    } as unknown as Entity;

    expect(parseFilterExpression('has:labels')(empty1)).toBe(false);
    expect(parseFilterExpression('has:labels')(empty2)).toBe(false);
    expect(parseFilterExpression('has:labels')(labels)).toBe(true);

    expect(parseFilterExpression('has:annotations')(empty1)).toBe(false);
    expect(parseFilterExpression('has:annotations')(empty2)).toBe(false);
    expect(parseFilterExpression('has:annotations')(annotations)).toBe(true);

    expect(parseFilterExpression('has:links')(empty1)).toBe(false);
    expect(parseFilterExpression('has:links')(empty2)).toBe(false);
    expect(parseFilterExpression('has:links')(links)).toBe(true);

    // match ANY of the parameters
    expect(parseFilterExpression('has:labels,links')(empty1)).toBe(false);
    expect(parseFilterExpression('has:labels,links')(empty2)).toBe(false);
    expect(parseFilterExpression('has:labels,links')(labels)).toBe(true);
    expect(parseFilterExpression('has:labels,links')(links)).toBe(true);
    expect(parseFilterExpression('has:labels,links')(annotations)).toBe(false);

    expect(() =>
      parseFilterExpression('has:labels,bar'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'bar' is not a valid parameter for 'has' filter expressions, expected one of 'labels','annotations','links'"`,
    );
  });

  it('rejects unknown keys', () => {
    expect(() =>
      parseFilterExpression('unknown:foo'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'unknown' is not a valid filter expression key, expected one of 'kind','type','is','has'"`,
    );
  });

  it('rejects malformed inputs', () => {
    expect(() => parseFilterExpression(':')).toThrowErrorMatchingInlineSnapshot(
      `"':' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() =>
      parseFilterExpression(':a'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"':a' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() =>
      parseFilterExpression('a:'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'a:' is not a valid filter expression, expected 'key:parameter' form"`,
    );
  });
});

describe('splitFilterExpression', () => {
  it('properly splits into expression atoms', () => {
    expect(splitFilterExpression('')).toEqual([]);
    expect(splitFilterExpression('   ')).toEqual([]);
    expect(splitFilterExpression('kind:component')).toEqual([
      { key: 'kind', parameters: ['component'] },
    ]);
    expect(splitFilterExpression('kind:component,user')).toEqual([
      { key: 'kind', parameters: ['component', 'user'] },
    ]);
    expect(splitFilterExpression('kind:component,user type:foo')).toEqual([
      { key: 'kind', parameters: ['component', 'user'] },
      { key: 'type', parameters: ['foo'] },
    ]);
    expect(splitFilterExpression('with:multiple:colons')).toEqual([
      { key: 'with', parameters: ['multiple:colons'] },
    ]);
  });

  it('rejects malformed inputs', () => {
    expect(() => splitFilterExpression(':')).toThrowErrorMatchingInlineSnapshot(
      `"':' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() =>
      splitFilterExpression(':a'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"':a' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() =>
      splitFilterExpression('a:'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'a:' is not a valid filter expression, expected 'key:parameter' form"`,
    );
  });
});
