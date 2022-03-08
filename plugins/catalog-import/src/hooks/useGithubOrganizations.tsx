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
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

export type GithubOrganization = {
  login: string;
  avatar_url: string;
  description: string;
};

type GithubOrganizationsContextProps = {
  organizations: GithubOrganization[];
  loading: boolean;
};

const GithubOrganizationsContext =
  createContext<GithubOrganizationsContextProps>({
    organizations: [],
    loading: true,
  });

type GithubOrganizationsProviderProps = {
  host: string;
};

export function GithubOrganizationsProvider({
  children,
  host,
}: PropsWithChildren<GithubOrganizationsProviderProps>) {
  const fetchApi = useApi(fetchApiRef);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<GithubOrganization[]>([]);

  useEffect(() => {
    async function fetchOrgs() {
      const response = await fetchApi.fetch(
        `plugin://catalog-import/github/orgs/${host}`,
      );
      setOrganizations(await response.json());
      setLoading(false);
    }
    fetchOrgs();
  }, [fetchApi, host]);

  return (
    <GithubOrganizationsContext.Provider value={{ organizations, loading }}>
      {children}
    </GithubOrganizationsContext.Provider>
  );
}

export function useGithubOrganizations(): GithubOrganizationsContextProps {
  const value = useContext(GithubOrganizationsContext);
  if (!value) {
    throw new Error(
      'Cannot use useGithubOrganizations outside of GithubOrganizationsProvider',
    );
  }
  return value;
}
