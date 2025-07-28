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

import { createComponentRef } from './createComponentRef';

describe('createComponentRef', () => {
  it('can be created and read', () => {
    const ref = createComponentRef({ id: 'foo', mode: 'sync' });
    expect(ref.id).toBe('foo');
    expect(String(ref)).toBe('ComponentRef{id=foo}');
  });

  it('should allow defining a default component implementation', () => {
    const Test = () => <div>test</div>;

    createComponentRef<{ foo: string }, { bar: string }>({
      id: 'foo',
      mode: 'sync',
      defaultComponent: ({ bar }) => <Test key={bar} />,
    });

    createComponentRef<{ foo: string }, { bar: string }>({
      id: 'foo',
      mode: 'async',
      defaultComponent: async () => <Test />,
    });

    // @ts-expect-error - this should be an error as mode is sync
    createComponentRef<{ foo: string }, { bar: string }>({
      id: 'foo',
      mode: 'sync',
      defaultComponent: async ({ bar }) => <Test key={bar} />,
    });

    // @ts-expect-error - this should be an error as mode is async
    createComponentRef<{ foo: string }, { bar: string }>({
      id: 'foo',
      mode: 'async',
      defaultComponent: ({ bar }) => <Test key={bar} />,
    });

    createComponentRef<{ foo: string }, { bar: string }>({
      id: 'foo',
      mode: 'sync',
    });

    expect(Test).toBeDefined();
  });

  it('should allow transformings props', () => {
    createComponentRef<{ foo: string }, { bar: string }>({
      id: 'foo',
      mode: 'sync',
      transformProps: props => ({ foo: props.bar }),
    });

    createComponentRef<{ foo: string }, { bar: string }>({
      id: 'foo',
      mode: 'sync',
      // @ts-expect-error - this should be an error as foo is not a string
      transformProps: props => ({ foo: 1 }),
    });

    expect(true).toBe(true);
  });
});
