/*
 * Copyright 2025 The Backstage Authors
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
  getLoggerMetaContext,
  runWithLoggerMetaContext,
} from './RootLoggerService';

describe('logger meta contsxt', () => {
  it('logger meta should be carried through async contexts', async () => {
    expect.assertions(6);

    expect(getLoggerMetaContext()).toEqual({});

    const result = runWithLoggerMetaContext({ foo: 1 }, async () => {
      expect(getLoggerMetaContext()).toEqual({ foo: 1 });

      await runWithLoggerMetaContext({ bar: 2 }, async () => {
        await new Promise<void>(resolve => {
          expect(getLoggerMetaContext()).toEqual({ foo: 1, bar: 2 });
          resolve();
        });
      });

      expect(getLoggerMetaContext()).toEqual({ foo: 1 });
      return 'ok';
    });

    await expect(result).resolves.toEqual('ok');
    expect(getLoggerMetaContext()).toEqual({});
  });
});
