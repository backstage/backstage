/*
 * Copyright 2020 Spotify AB
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

import * as YAML from 'yaml';
import { useApi, configApiRef } from '@backstage/core';
import { catalogImportApiRef } from '../api/CatalogImportApi';
import { ConfigSpec } from '../components/ImportComponentPage';
import parseGitUri from 'git-url-parse';

// TODO: (O5ten) Refactor into a core API instead of direct usage like this
// https://github.com/backstage/backstage/pull/3613#issuecomment-7408929430
import { readGitHubIntegrationConfigs } from '@backstage/integration';

export function useGithubRepos() {
  const api = useApi(catalogImportApiRef);
  const config = useApi(configApiRef);

  const submitPrToRepo = async (selectedRepo: ConfigSpec) => {
    const {
      name: repoName,
      owner: ownerName,
      resource: hostname,
    } = parseGitUri(selectedRepo.location);

    const configs = readGitHubIntegrationConfigs(
      config.getOptionalConfigArray('integrations.github') ?? [],
    );
    const githubIntegrationConfig = configs.find(v => v.host === hostname);
    if (!githubIntegrationConfig) {
      throw new Error(
        `Unable to locate github-integration for repo-location: ${selectedRepo.location}`,
      );
    }
    const submitPRResponse = await api
      .submitPrToRepo({
        owner: ownerName,
        repo: repoName,
        fileContent: selectedRepo.config
          .map(entity => `---\n${YAML.stringify(entity)}`)
          .join('\n'),
        githubIntegrationConfig,
      })
      .catch(e => {
        throw new Error(`Failed to submit PR to repo:\n${e.message}`);
      });

    await api
      .createRepositoryLocation({
        location: submitPRResponse.location,
      })
      .catch(e => {
        throw new Error(`Failed to create repository location:\n${e.message}`);
      });

    return submitPRResponse;
  };

  return {
    submitPrToRepo,
    generateEntityDefinitions: (repo: string) =>
      api.generateEntityDefinitions({ repo }),
    addLocation: (location: string) =>
      api.createRepositoryLocation({ location }),
  };
}
