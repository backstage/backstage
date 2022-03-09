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

import { useEffect, useState } from 'react';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';

export type GithubRepository = {
  name: string;
  description: string;
  visibility: 'public' | 'private' | 'internal';
  fork: boolean;
  url: string;
  default_branch: string;
  updated_at: string; // ISO-8601; 2011-01-26T19:14:43Z
  descriptor_paths: string[];
};

type GithubRepositoriesContext = {
  repositories: GithubRepository[];
  loading: boolean;
};

type GithubRepositoriesProps = {
  host: string;
  org: string;
};

export function useGithubRepositories({
  host,
  org,
}: GithubRepositoriesProps): GithubRepositoriesContext {
  const fetchApi = useApi(fetchApiRef);
  const [context, setContext] = useState<GithubRepositoriesContext>({
    repositories: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchOrgs() {
      const response = await fetchApi.fetch(
        `plugin://catalog-import/github/repos/${host}/${org}`,
      );
      const repositories = (await response.json()) as GithubRepository[];
      setContext({
        repositories: repositories.sort((a, b) => {
          if (a.descriptor_paths.length !== b.descriptor_paths.length) {
            return b.descriptor_paths.length - a.descriptor_paths.length;
          }
          return a.name
            .toLocaleLowerCase('en-US')
            .localeCompare(b.name.toLocaleLowerCase('en-US'));
        }),
        loading: false,
      });
    }
    fetchOrgs();
  }, [fetchApi, host, org]);

  return context;
}
