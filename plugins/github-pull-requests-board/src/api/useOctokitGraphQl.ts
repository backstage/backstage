/*
 * Copyright 2022 The Backstage Authors
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
import { Octokit } from '@octokit/rest';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { readGithubIntegrationConfigs } from '@backstage/integration';
import { ScmAuthApi, scmAuthApiRef } from '@backstage/integration-react';

let octokit: any;

export const useOctokitGraphQl = <T>(hostname: string) => {
  const scmAuthApi = useApi(scmAuthApiRef);
  const config = useApi(configApiRef);

  const configs = readGithubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  );
  const githubIntegrationConfig = configs.find(v => v.host === hostname);
  const baseUrl = githubIntegrationConfig?.apiBaseUrl;

  return (path: string, options?: any): Promise<T> =>
    getAccessToken(scmAuthApi, hostname)
      .then((token: string) => {
        if (!octokit) {
          octokit = new Octokit({ auth: token, baseUrl });
        }

        return octokit;
      })
      .then(octokitInstance => {
        return octokitInstance.graphql(path, options);
      });
};

function getAccessToken(
  scmAuthApi: ScmAuthApi,
  hostname: string,
): Promise<string> {
  return scmAuthApi
    .getCredentials({
      url: `https://${hostname}/`,
      additionalScope: {
        customScopes: {
          github: ['repo'],
        },
      },
    })
    .then((response: any) => {
      return response.token;
    });
}
