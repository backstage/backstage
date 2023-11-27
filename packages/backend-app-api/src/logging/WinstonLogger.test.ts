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

import { TransformableInfo } from 'logform';
import { WinstonLogger } from './WinstonLogger';

function msg(info: TransformableInfo): TransformableInfo {
  return { message: info.message, level: info.level, stack: info.stack };
}

describe('WinstonLogger', () => {
  it('redacter should redact and escape regex', () => {
    const redacter = WinstonLogger.redacter();
    const log = {
      level: 'error',
      message: 'hello (world)',
      stack: 'hello (world) from this file',
    };
    expect(redacter.format.transform(msg(log))).toEqual(msg(log));
    redacter.add(['hello\n']);
    expect(redacter.format.transform(msg(log))).toEqual(
      msg({
        ...log,
        message: '[REDACTED] (world)',
        stack: '[REDACTED] (world) from this file',
      }),
    );
    redacter.add(['(world']);
    expect(redacter.format.transform(msg(log))).toEqual(
      msg({
        ...log,
        message: '[REDACTED] [REDACTED])',
        stack: '[REDACTED] [REDACTED]) from this file',
      }),
    );
  });
});
