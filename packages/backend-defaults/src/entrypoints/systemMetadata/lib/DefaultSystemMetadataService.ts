/*
 * Copyright 2024 The Backstage Authors
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
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  BackstageInstance,
  SystemMetadataService,
} from '@backstage/backend-plugin-api/alpha';

/**
 * @alpha
 */
export class DefaultSystemMetadataService implements SystemMetadataService {
  constructor(
    private options: { logger: LoggerService; config: RootConfigService },
  ) {}

  public static create(pluginEnv: {
    logger: LoggerService;
    config: RootConfigService;
  }) {
    return new DefaultSystemMetadataService(pluginEnv);
  }

  async listInstances() {
    const endpoints =
      this.options.config.getOptionalConfigArray('discovery.instances') ?? [];
    const instances: BackstageInstance[] = [];
    for (const endpoint of endpoints) {
      const baseUrl = endpoint.getOptionalString('baseUrl');
      if (baseUrl) {
        instances.push({ url: baseUrl });
      }
    }
    return instances;
  }
}
