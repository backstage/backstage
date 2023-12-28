/*
 * Copyright 2020 The Backstage Authors
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

import { PullRequestColumnConfig } from './src/components/PullRequestsPage/lib/types';

export interface Config {
  /**
   * Configuration options for the azure-devops plugin
   */
  azureDevOps?: {
    /**
     * Section for Azure Repos settings
     */
    repos?: {
      /**
       * Default limit for the number of pull requests to load (optional), default is 10
       * @visibility frontend
       */
      defaultLimit?: number;
      /**
       * Sets the maximum screen size of the README card, if not set it will default to 100%
       * @visibility frontend
       */
      maxHeight?: number;
      /**
       * Project Name to use for the Pull Request Dashboard
       * @visibility frontend
       */
      projectName?: string;
      /**
       * Polling interval milliseconds to use when checking for new Pull Requests
       * on the Pull Request Dashboard, default is 10000
       * @visibility frontend
       */
      pollingInterval?: number;
      /**
       * Column configuration for the Pull Request Dashboard
       * @visibility frontend
       */
      defaultColumnConfigs?: PullRequestColumnConfig[];
    };
    /**
     * Section for Azure Pipelines settings
     */
    pipelines?: {
      /**
       * Default limit for the number of builds to load (optional), default is 10
       * @visibility frontend
       */
      defaultLimit?: number;
    };
  };
}
