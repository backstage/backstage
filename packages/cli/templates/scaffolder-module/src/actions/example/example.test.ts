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

import { PassThrough } from 'stream';
import { createAcmeExampleAction } from './example';
import { getVoidLogger } from '@backstage/backend-common';

describe('acme:example', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call action', async () => {
    const action = createAcmeExampleAction();

    const logger = getVoidLogger();
    jest.spyOn(logger, 'info');

    await action.handler({
      input: {
        myParameter: 'test',
      },
      workspacePath: '/tmp',
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        // Usage of mock-fs is recommended for testing of filesystem operations
        throw new Error('Not implemented');
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'Running example template with parameters: test',
    );
  });
});
