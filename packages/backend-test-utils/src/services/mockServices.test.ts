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

import { coreServices } from '@backstage/backend-plugin-api';
import { mockServices } from './mockServices';

describe('mockServices', () => {
  const coreServiceKeys = Object.keys(coreServices).filter(
    key => key !== 'pluginMetadata',
  ) as Array<keyof typeof mockServices>;

  it.each(coreServiceKeys)('should have mock implementations for %s', key => {
    expect(mockServices[key]).toBeDefined();
    expect(mockServices[key].mock).toEqual(expect.any(Function));
    expect(mockServices[key].mock()).toEqual(expect.any(Object));
    expect(mockServices[key].factory).toEqual(expect.any(Function));
    expect(mockServices[key].factory()).toEqual(expect.any(Object));
  });
});

describe('mockServices.rootConfig()', () => {
  it('should notify about updates', async () => {
    const config = mockServices.rootConfig();

    const fooConfig = config.getConfig('foo');

    const rootListener = jest.fn();
    const fooListener = jest.fn();

    config.subscribe?.(rootListener);
    fooConfig.subscribe?.(fooListener);

    expect(rootListener).toHaveBeenCalledTimes(0);
    expect(fooListener).toHaveBeenCalledTimes(0);

    config.update({ data: { foo: { bar: 1, baz: 2 } } });

    expect(rootListener).toHaveBeenCalledTimes(1);
    expect(fooListener).toHaveBeenCalledTimes(1);

    config.update({ data: { foo: { baz: 2, bar: 1 } } });

    // Doesn't notify, no changes
    expect(rootListener).toHaveBeenCalledTimes(1);
    expect(fooListener).toHaveBeenCalledTimes(1);

    config.update({ data: { foo: { bar: 1, baz: 2 }, unrelated: 'key' } });

    // Notifies all listeners, even if an unrelated key was changed
    expect(rootListener).toHaveBeenCalledTimes(2);
    expect(fooListener).toHaveBeenCalledTimes(2);
  });
});
