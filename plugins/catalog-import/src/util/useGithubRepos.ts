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
import { useApi, githubAuthApiRef } from '@backstage/core';
import { catalogImportApiRef } from '../api/CatalogImportApi';
import { ConfigSpec } from '../components/ImportComponentPage';

export function useGithubRepos() {
  const api = useApi(catalogImportApiRef);
  const auth = useApi(githubAuthApiRef);

  const submitPRToRepo = async (selectedRepo: ConfigSpec) => {
    const token = await auth.getAccessToken(['repo']);

    const [ownerName, repoName] = [
      selectedRepo.repo.split('/')[0],
      selectedRepo.repo.split('/')[1],
    ];
    const submitPRResponse = await api.submitPRToRepo({
      token,
      owner: ownerName,
      repo: repoName,
      fileContent: selectedRepo.config
        .map(entity => `---\n${YAML.stringify(entity)}`)
        .join('\n'),
    });

    await api.createRepositoryLocation({
      token,
      owner: selectedRepo.repo.split('/')[0],
      repo: selectedRepo.repo.split('/')[1],
    });

    return submitPRResponse;
  };

  return {
    submitPRToRepo,
    generateEntityDefinitions: (repo: string) =>
      api.generateEntityDefinitions({ repo }),
  };
}
