/*
 * Copyright 2026 The Backstage Authors
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
  AnyFilterPredicate,
  FilterPredicate,
  FilterPredicatePrimitive,
  UnknownFilterPredicateOperator,
  UnknownFilterPredicateValueMatcher,
} from './types';

// The shape of FilterPredicate before it was narrowed to only allow objects at
// the root. These tests verify how older code that was written against this
// shape interacts with the current types, in both directions.
type OldFilterPredicate =
  | OldFilterPredicateExpression
  | FilterPredicatePrimitive
  | { $all: OldFilterPredicate[] }
  | { $any: OldFilterPredicate[] }
  | { $not: OldFilterPredicate }
  | UnknownFilterPredicateOperator;

type OldFilterPredicateExpression = {
  [KPath in string]: OldFilterPredicateValue;
} & {
  [KPath in `$${string}`]: never;
};

type OldFilterPredicateValue =
  | FilterPredicatePrimitive
  | { $exists: boolean }
  | { $in: FilterPredicatePrimitive[] }
  | { $contains: OldFilterPredicate }
  | { $hasPrefix: string }
  | UnknownFilterPredicateValueMatcher;

type IsAssignable<TFrom, TTo> = [TFrom] extends [TTo] ? true : false;

function expectType<T extends true>(_value?: T) {}

describe('FilterPredicate types', () => {
  it('can pass new predicates to code written against the old type', () => {
    // A newer plugin calling into an older framework, or newer framework
    // code handing predicates to an older plugin
    expectType<IsAssignable<FilterPredicate, OldFilterPredicate>>();

    const predicate: FilterPredicate = {
      kind: 'component',
      'metadata.tags': { $contains: { $any: ['java', 'go'] } },
    };
    const old: OldFilterPredicate = predicate;
    expect(old).toBe(predicate);
  });

  it('cannot pass old predicates where only objects are accepted', () => {
    // An older plugin calling into a newer framework with a value typed as
    // the old FilterPredicate fails to compile, since it may be a primitive
    expectType<
      IsAssignable<OldFilterPredicate, FilterPredicate> extends false
        ? true
        : false
    >();

    const old: OldFilterPredicate = 'component';
    // @ts-expect-error - primitives are not allowed at the root
    const predicate: FilterPredicate = old;
    expect(predicate).toBe(old);

    // Object literals that were valid before are still accepted, so only
    // values that are explicitly typed as the old type are affected
    const literal: FilterPredicate = {
      $all: [{ kind: 'component' }, { $not: { 'spec.type': 'service' } }],
    };
    expect(literal).toBeDefined();
  });

  it('treats AnyFilterPredicate as equivalent to the old type', () => {
    // Code that needs the old behavior can switch to AnyFilterPredicate
    // without any other changes
    expectType<IsAssignable<OldFilterPredicate, AnyFilterPredicate>>();
    expectType<IsAssignable<AnyFilterPredicate, OldFilterPredicate>>();
    expectType<IsAssignable<FilterPredicate, AnyFilterPredicate>>();

    const primitives: AnyFilterPredicate[] = [
      'component',
      1,
      true,
      { $any: ['java', 'go'] },
      { $not: 'java' },
    ];
    expect(primitives).toHaveLength(5);
  });

  it('rejects primitives under the logical operators at the root', () => {
    // @ts-expect-error - primitives are not allowed at the root
    const all: FilterPredicate = { $all: ['component'] };
    // @ts-expect-error - primitives are not allowed at the root
    const not: FilterPredicate = { $not: 'component' };
    expect([all, not]).toHaveLength(2);
  });
});
