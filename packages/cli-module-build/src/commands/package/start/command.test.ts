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

import { startPackage } from './startPackage';
import start from './command';

jest.mock('./startPackage', () => ({
  startPackage: jest.fn(),
}));

describe('node preload flags', () => {
  it('should pass --require flags along', async () => {
    await start({
      args: ['--role=backend', '--require', './a.js', '--require=./b.js'],
      info: { name: 'test', usage: 'test' },
    });
    expect(startPackage).toHaveBeenCalledWith(
      expect.objectContaining({
        require: ['./a.js', './b.js'],
      }),
    );
  });

  it('should pass --import flags along', async () => {
    await start({
      args: ['--role=backend', '--import', './a.js', '--import=./b.js'],
      info: { name: 'test', usage: 'test' },
    });
    expect(startPackage).toHaveBeenCalledWith(
      expect.objectContaining({
        import: ['./a.js', './b.js'],
      }),
    );
  });
});
