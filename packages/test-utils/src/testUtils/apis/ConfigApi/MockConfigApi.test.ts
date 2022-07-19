/*
 * Copyright 2022 The Backstage Authors
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

import { MockConfigApi } from './MockConfigApi';

describe('MockConfigApi', () => {
  it('is able to read some basic config', () => {
    const mock = new MockConfigApi({
      app: {
        title: 'Hello',
      },
      x: 1,
      y: false,
      z: [{ a: 3 }],
    });

    expect(mock.getString('app.title')).toEqual('Hello');
    expect(mock.getNumber('x')).toEqual(1);
    expect(mock.getBoolean('y')).toEqual(false);
    expect(mock.getConfigArray('z')[0].getOptionalNumber('a')).toEqual(3);

    expect(() => mock.getString('x')).toThrow(
      "Invalid type in config for key 'x' in 'mock-config', got number, wanted string",
    );
    expect(() => mock.getString('missing')).toThrow(
      "Missing required config value at 'missing'",
    );
  });
});
