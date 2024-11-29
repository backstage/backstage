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
  function run(expression: string) {
    const result = parseFilterExpression(expression);
    if (result.expressionParseErrors.length) {
      throw result.expressionParseErrors[0];
    }
    return result.filterFn;
  }

  it('supports "kind" expressions', () => {
    const component = { kind: 'Component' } as unknown as Entity;
    const user = { kind: 'User' } as unknown as Entity;
    const resource = { kind: 'Resource' } as unknown as Entity;

    expect(run('kind:user,component')(user)).toBe(true);
    expect(run('kind:user,component')(component)).toBe(true);
    expect(run('kind:user,component')(resource)).toBe(false);
  });

  it('supports "type" expressions', () => {
    const empty = {} as unknown as Entity;
    const service = { spec: { type: 'service' } } as unknown as Entity;
    const website = { spec: { type: 'website' } } as unknown as Entity;
    const pipeline = { spec: { type: 'pipeline' } } as unknown as Entity;

    expect(run('type:service,website')(empty)).toBe(false);
    expect(run('type:service,website')(service)).toBe(true);
    expect(run('type:service,website')(website)).toBe(true);
    expect(run('type:service,website')(pipeline)).toBe(false);
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

    expect(run('is:orphan')(empty)).toBe(false);
    expect(run('is:orphan')(orphan)).toBe(true);

    expect(() => run('is:orphan,bar')).toThrowErrorMatchingInlineSnapshot(
      `"'bar' is not a valid parameter for 'is' filter expressions, expected one of 'orphan'"`,
    );
  });

  it('supports "has" expressions', () => {
    const empty = {
      metadata: {},
    } as unknown as Entity;
    const labels = {
      metadata: { labels: { a: 'b' } },
    } as unknown as Entity;
    const annotations = {
      metadata: { annotations: { a: 'b' } },
    } as unknown as Entity;
    const links = {
      metadata: { links: [{}] },
    } as unknown as Entity;

    expect(run('has:labels,links')(empty)).toBe(false);
    expect(run('has:labels,links')(labels)).toBe(true);
    expect(run('has:labels,links')(links)).toBe(true);
    expect(run('has:labels,links')(annotations)).toBe(false);

    expect(() => run('has:labels,bar')).toThrowErrorMatchingInlineSnapshot(
      `"'bar' is not a valid parameter for 'has' filter expressions, expected one of 'labels','links'"`,
    );
  });

  it('recognizes negation key', () => {
    const component = { kind: 'Component' } as unknown as Entity;
    expect(run('not:kind:user')(component)).toBe(true);
  });

  it('supports negation and affirmative expressions', () => {
    const component = {
      kind: 'Component',
      spec: { type: 'service' },
    } as unknown as Entity;
    expect(run('not:kind:user type:service')(component)).toBe(true);
    expect(run('type:service not:kind:user')(component)).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(() => run('unknown:foo')).toThrowErrorMatchingInlineSnapshot(
      `"'unknown' is not a valid filter expression key, expected one of 'kind','type','is','has'"`,
    );
  });

  it('rejects malformed inputs', () => {
    expect(() => run(':')).toThrowErrorMatchingInlineSnapshot(
      `"':' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() => run(':a')).toThrowErrorMatchingInlineSnapshot(
      `"':a' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() => run('a:')).toThrowErrorMatchingInlineSnapshot(
      `"'a:' is not a valid filter expression, expected 'key:parameter' form"`,
    );
  });
});

describe('splitFilterExpression', () => {
  function run(expression: string) {
    return splitFilterExpression(expression, e => {
      throw e;
    });
  }

  it('properly splits into expression atoms', () => {
    expect(run('')).toEqual([]);
    expect(run('   ')).toEqual([]);
    expect(run('kind:component')).toEqual([
      { key: 'kind', parameters: ['component'], negation: false },
    ]);
    expect(run('kind:component,user')).toEqual([
      { key: 'kind', parameters: ['component', 'user'], negation: false },
    ]);
    expect(run('kind:component,user not:type:foo')).toEqual([
      { key: 'kind', parameters: ['component', 'user'], negation: false },
      { key: 'type', parameters: ['foo'], negation: true },
    ]);
    expect(run('not:type:foo kind:component,user')).toEqual([
      { key: 'type', parameters: ['foo'], negation: true },
      { key: 'kind', parameters: ['component', 'user'], negation: false },
    ]);
    expect(run('kind:component,user type:foo')).toEqual([
      { key: 'kind', parameters: ['component', 'user'], negation: false },
      { key: 'type', parameters: ['foo'], negation: false },
    ]);
    expect(run('with:multiple:colons')).toEqual([
      { key: 'with', parameters: ['multiple:colons'], negation: false },
    ]);
  });

  it('rejects malformed inputs', () => {
    expect(() => run(':')).toThrowErrorMatchingInlineSnapshot(
      `"':' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() => run(':a')).toThrowErrorMatchingInlineSnapshot(
      `"':a' is not a valid filter expression, expected 'key:parameter' form"`,
    );
    expect(() => run('a:')).toThrowErrorMatchingInlineSnapshot(
      `"'a:' is not a valid filter expression, expected 'key:parameter' form"`,
    );
  });
});
