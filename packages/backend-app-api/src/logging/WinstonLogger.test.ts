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

import { WinstonLogger } from './WinstonLogger';

function msg(message: string) {
  return { message, level: 'info' };
}

describe('WinstonLogger', () => {
  it('redacter should redact and escape regex', () => {
    const redacter = WinstonLogger.redacter();
    expect(redacter.format.transform(msg('hello (world)'))).toEqual(
      msg('hello (world)'),
    );
    redacter.add(['hello']);
    expect(redacter.format.transform(msg('hello (world)'))).toEqual(
      msg('[REDACTED] (world)'),
    );
    redacter.add(['(world)']);
    expect(redacter.format.transform(msg('hello (world)'))).toEqual(
      msg('[REDACTED] [REDACTED]'),
    );
  });
});
