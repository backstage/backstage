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

import { Config } from '@backstage/config';

/**
 * The configuration parameters for a multi-org GitHub processor.
 * @public
 */
export type GithubMultiOrgConfig = Array<{
  /**
   * The name of the GitHub org to process.
   */
  name: string;
  /**
   * The namespace of the group created for this org.
   */
  groupNamespace: string;
  /**
   * The namespace of the users created for this org. If not specified defaults to undefined.
   */
  userNamespace: string | undefined;
}>;

export function readGithubMultiOrgConfig(config: Config): GithubMultiOrgConfig {
  const orgConfigs = config.getOptionalConfigArray('orgs') ?? [];
  return orgConfigs.map(c => ({
    name: c.getString('name'),
    groupNamespace: (
      c.getOptionalString('groupNamespace') ?? c.getString('name')
    ).toLowerCase(),
    userNamespace: c.getOptionalString('userNamespace') ?? undefined,
  }));
}
