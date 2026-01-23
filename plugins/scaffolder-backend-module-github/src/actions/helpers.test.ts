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

import { ConfigReader } from '@backstage/config';
import { getGitCommitMessage } from './helpers';

describe('getGitCommitMessage', () => {
  it('should return gitCommitMessage when provided', () => {
    const mockConfig = new ConfigReader({});
    const gitCommitMessage = 'Custom commit message';

    const result = getGitCommitMessage(gitCommitMessage, mockConfig);

    expect(result).toEqual('Custom commit message');
  });

  it('should return default commit message from config when gitCommitMessage is undefined', () => {
    const mockConfig = new ConfigReader({
      scaffolder: {
        defaultCommitMessage: 'Default commit message',
      },
    });
    const result = getGitCommitMessage(undefined, mockConfig);

    expect(result).toEqual('Default commit message');
  });

  it('should return undefined when both gitCommitMessage and default commit message are undefined', () => {
    const mockConfig = new ConfigReader({});
    const result = getGitCommitMessage(undefined, mockConfig);

    expect(result).toBeUndefined();
  });
});
