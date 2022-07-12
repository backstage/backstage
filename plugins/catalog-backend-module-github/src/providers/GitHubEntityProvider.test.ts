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

import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { TaskInvocationDefinition, TaskRunner } from '@backstage/backend-tasks';
import {
  GitHubEntityProvider,
  GitHubEntityProviderOptions,
} from '../index';

class PersistingTaskRunner implements TaskRunner {
  private tasks: TaskInvocationDefinition[] = [];

  getTasks() {
    return this.tasks;
  }

  run(task: TaskInvocationDefinition): Promise<void> {
    this.tasks.push(task);
    return Promise.resolve(undefined);
  }
}

describe('GitHubEntityProvider', () => {
  const backendConfig = {
    integrations: {
      github: [
        {
          host: 'github.com',
        },
      ],
    },
  };

  const options: GitHubEntityProviderOptions = {
    id: 'mockId',
    target: 'http://mockUrl',
    schedule: new PersistingTaskRunner(),
    logger: getVoidLogger(),
  };

  it('should return the instance providerName', () => {
    const config = new ConfigReader(backendConfig);
    const provider = GitHubEntityProvider.fromConfig(config, options);
    expect(provider.getProviderName()).toBe('github-entity-provider:mockId');
  });
});
