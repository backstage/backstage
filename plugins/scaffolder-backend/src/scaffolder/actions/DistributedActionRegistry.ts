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

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

/**
 * DistributedActionRegistry is responsible for aggregating both built-in and
 * remotely registered actions into a single registry that can be used by the
 * Scaffolder.
 * @public
 */
export interface DistributedActionRegistry {
  list(options?: {
    credentials?: BackstageCredentials;
  }): Promise<Map<string, TemplateAction<any, any, any>>>;
}
