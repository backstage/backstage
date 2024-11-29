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

import { createWaitAction } from './wait';
import { Writable } from 'stream';
import { examples } from './wait.examples';
import yaml from 'yaml';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

describe('debug:wait examples', () => {
  const action = createWaitAction();

  const logStream = {
    write: jest.fn(),
  } as jest.Mocked<Partial<Writable>> as jest.Mocked<Writable>;

  const mockContext = createMockActionContext({
    logStream,
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should wait for specified period of seconds', async () => {
    const context = {
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    };
    const start = new Date().getTime();
    await action.handler(context);
    const end = new Date().getTime();
    expect(end - start).toBeGreaterThanOrEqual(45); // should rarely by markedly less
    expect(end - start).toBeLessThanOrEqual(500); // can get delayed a bit in CI
  });
});
