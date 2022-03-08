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
import { ScmIntegration } from '@backstage/integration';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type IntegrationsContextProps = {
  integrations: ScmIntegration[];
  loading: boolean;
};

const IntegrationsContext = createContext<IntegrationsContextProps>({
  integrations: [],
  loading: true,
});

export function ScmIntegrationsProvider({ children }: PropsWithChildren<{}>) {
  const fetchApi = useApi(fetchApiRef);
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<ScmIntegration[]>([]);

  useEffect(() => {
    async function fetchIntegrations() {
      const response = await fetchApi.fetch(
        'plugin://catalog-import/integrations',
      );
      setIntegrations((await response.json()) as ScmIntegration[]);
      setLoading(false);
    }
    fetchIntegrations();
  }, [fetchApi]);

  return (
    <IntegrationsContext.Provider value={{ integrations, loading }}>
      {children}
    </IntegrationsContext.Provider>
  );
}

export function useScmIntegrations(): IntegrationsContextProps {
  const value = useContext(IntegrationsContext);
  if (!value) {
    throw new Error(
      'Cannot use useScmIntegrations outside of ScmIntegrationsProvider',
    );
  }
  return value;
}
