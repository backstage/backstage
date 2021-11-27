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

import { Contexts } from './Contexts';
import { RootContext } from './RootContext';
import { ValueContext } from './ValueContext';

const s = Symbol();

describe('ValueContext', () => {
  it('returns its own values, or delegates to the parent', async () => {
    const root = new RootContext();
    const a = ValueContext.forConstantValue(root, 'a', 1);
    const b = ValueContext.forConstantValue(a, s, 2);
    const c = ValueContext.forConstantValue(b, 'a', 3);
    const d = ValueContext.forConstantValue(c, 'b', 4);

    expect(a.value('a')).toBe(1);
    expect(a.value('b')).toBeUndefined();
    expect(a.value(s)).toBeUndefined();

    expect(b.value('a')).toBe(1);
    expect(b.value('b')).toBeUndefined();
    expect(b.value(s)).toBe(2);

    expect(c.value('a')).toBe(3);
    expect(c.value('b')).toBeUndefined();
    expect(c.value(s)).toBe(2);

    expect(d.value('a')).toBe(3);
    expect(d.value('b')).toBe(4);
    expect(d.value(s)).toBe(2);
  });

  it('can decorate', () => {
    const root = new RootContext();
    const parent = ValueContext.forConstantValue(root, 'a', 1);
    const child = parent.use(
      Contexts.setValue('a', 2),
      Contexts.setValue('a', 3),
    );
    expect(child.value('a')).toBe(3);
  });
});
