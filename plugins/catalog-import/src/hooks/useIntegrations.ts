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
import { useEffect, useState } from 'react';

type IntegrationsContext = {
  integrations: ScmIntegration[];
  loading: boolean;
};

export function useScmIntegrations(): IntegrationsContext {
  const fetchApi = useApi(fetchApiRef);
  const [context, setContext] = useState<IntegrationsContext>({
    loading: true,
    integrations: [],
  });

  useEffect(() => {
    async function fetchIntegrations() {
      const response = await fetchApi.fetch(
        'plugin://catalog-import/integrations',
      );
      setContext({
        integrations: await response.json(),
        loading: false,
      });
    }
    fetchIntegrations();
  }, [fetchApi]);

  return context;
}
