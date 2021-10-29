/*
 * Copyright 2020 The Backstage Authors
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

import { Logger } from 'winston';
import { ConfigReader } from '@backstage/config';
import { ObservableConfigProxy } from './config';

describe('ObservableConfigProxy', () => {
  const errLogger = {
    error: (message: string) => {
      throw new Error(message);
    },
  } as unknown as Logger;

  it('should notify subscribers', () => {
    const config = new ObservableConfigProxy(errLogger);

    const fn = jest.fn();
    const sub = config.subscribe(fn);
    expect(config.getOptionalNumber('x')).toBe(undefined);

    config.setConfig(new ConfigReader({}));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(config.getOptionalNumber('x')).toBe(undefined);

    config.setConfig(new ConfigReader({ x: 1 }));
    expect(fn).toHaveBeenCalledTimes(2);
    expect(config.getOptionalNumber('x')).toBe(1);

    config.setConfig(new ConfigReader({ x: 3 }));
    expect(fn).toHaveBeenCalledTimes(3);
    sub.unsubscribe();
    expect(config.getOptionalNumber('x')).toBe(3);

    config.setConfig(new ConfigReader({ x: 5 }));
    expect(fn).toHaveBeenCalledTimes(3);
    expect(config.getOptionalNumber('x')).toBe(5);
  });

  it('should forward subscriptions', () => {
    const config1 = new ObservableConfigProxy(errLogger);

    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fn3 = jest.fn();
    const config2 = config1.getConfig('a');
    const config3 = config2.getConfig('b');
    const sub1 = config1.subscribe(fn1);
    const sub2 = config2.subscribe!(fn2);
    const sub3 = config3.subscribe!(fn3);
    expect(config1.getOptionalNumber('x')).toBe(undefined);
    expect(config2.getOptionalNumber('x')).toBe(undefined);
    expect(config3.getOptionalNumber('x')).toBe(undefined);

    config1.setConfig(new ConfigReader({}));
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);
    expect(config1.getOptionalNumber('x')).toBe(undefined);
    expect(config2.getOptionalNumber('x')).toBe(undefined);
    expect(config3.getOptionalNumber('x')).toBe(undefined);

    config1.setConfig(new ConfigReader({ x: 1, a: { x: 2, b: { x: 3 } } }));
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);
    expect(config1.getNumber('x')).toBe(1);
    expect(config2.getNumber('x')).toBe(2);
    expect(config3.getNumber('x')).toBe(3);

    sub1.unsubscribe();
    sub2.unsubscribe();
    sub3.unsubscribe();

    config1.setConfig(new ConfigReader({ x: 4, a: { x: 5, b: { x: 6 } } }));
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
    expect(fn3).toHaveBeenCalledTimes(2);
    expect(config1.getNumber('x')).toBe(4);
    expect(config2.getNumber('x')).toBe(5);
    expect(config3.getNumber('x')).toBe(6);

    config1.setConfig(new ConfigReader({}));
    expect(() => config1.getNumber('x')).toThrow(
      "Missing required config value at 'x'",
    );
    expect(() => config2.getNumber('x')).toThrow(
      "Missing required config value at 'a'",
    );
    expect(() => config3.getNumber('x')).toThrow(
      "Missing required config value at 'a'",
    );

    config1.setConfig(
      new ConfigReader({ x: 's', a: { x: 's', b: { x: 's' } } }),
    );
    expect(() => config1.getNumber('x')).toThrow(
      "Unable to convert config value for key 'x' in 'mock-config' to a number",
    );
    expect(() => config2.getNumber('x')).toThrow(
      "Unable to convert config value for key 'a.x' in 'mock-config' to a number",
    );
    expect(() => config3.getNumber('x')).toThrow(
      "Unable to convert config value for key 'a.b.x' in 'mock-config' to a number",
    );
  });

  it('should make sub configs available as expected', () => {
    const config = new ObservableConfigProxy(errLogger);

    config.setConfig(new ConfigReader({ a: { x: 1 } }));

    expect(config.getConfig('a')).toBeDefined();
    expect(config.getConfig('a').getNumber('x')).toBe(1);
    expect(config.getConfig('a').getOptionalNumber('x')).toBe(1);
    expect(config.getOptionalConfig('a')?.getNumber('x')).toBe(1);
    expect(config.getOptionalConfig('a')?.getOptionalNumber('x')).toBe(1);
    expect(config.getOptionalConfig('b')).toBeUndefined();
    expect(() => config.getConfig('b')).toBeDefined();
    expect(() => config.getConfig('b').get()).toThrow();
  });
});
