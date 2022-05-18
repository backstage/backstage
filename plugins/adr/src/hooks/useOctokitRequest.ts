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

import parseGitUrl from 'git-url-parse';
import useAsync from 'react-use/lib/useAsync';
import { Octokit } from 'octokit';
import { useApi } from '@backstage/core-plugin-api';
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';

/**
 * Hook for triggering authenticated Octokit requests against the GitHub Content API
 * @public
 */
export const useOctokitRequest = (request: string): any => {
  const authApi = useApi(scmAuthApiRef);
  const scmIntegrations = useApi(scmIntegrationsApiRef);

  const { owner, name, ref, filepath } = parseGitUrl(request);
  const path = filepath.replace(/^\//, '');
  const baseUrl = scmIntegrations.github.byUrl(request)?.config.apiBaseUrl;

  return useAsync<any>(async () => {
    const { token } = await authApi.getCredentials({
      url: request,
      additionalScope: {
        customScopes: {
          github: ['repo'],
        },
      },
    });
    const octokit = new Octokit({
      auth: token,
      baseUrl,
    });

    return octokit.request(
      `GET /repos/${owner}/${name}/contents/${path}?ref=${ref}`,
      {
        headers: { Accept: 'application/vnd.github.v3.raw' },
      },
    );
  }, [request]);
};
