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

import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';

export type GithubOrganization = {
  login: string;
  avatar_url: string;
  description: string;
};

type GithubOrganizationsContext = {
  organizations: GithubOrganization[];
  loading: boolean;
};

type GithubOrganizationsProps = {
  host: string;
};

export function useGithubOrganizations({
  host,
}: GithubOrganizationsProps): GithubOrganizationsContext {
  const fetchApi = useApi(fetchApiRef);
  const [context, setContext] = useState<GithubOrganizationsContext>({
    organizations: [],
    loading: true,
  });

  useEffect(() => {
    async function fetchOrgs() {
      const response = await fetchApi.fetch(
        `plugin://catalog-import/github/orgs/${host}`,
      );
      const organizations = (await response.json()) as GithubOrganization[];
      setContext({
        organizations: organizations.sort((a, b) =>
          a.login
            .toLocaleLowerCase('en-US')
            .localeCompare(b.login.toLocaleLowerCase('en-US')),
        ),
        loading: false,
      });
    }
    fetchOrgs();
  }, [fetchApi, host]);

  return context;
}
