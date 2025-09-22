/*
 * Copyright 2025 The Backstage Authors
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

import { RequestDetails } from '@backstage/plugin-events-node';
import { OctokitProviderService } from './octokitProviderService';
import lodash from 'lodash';

export type AppIdResolver = (
  request: RequestDetails,
) => Promise<number | undefined>;

/**
 * Helps with resolving what app ID (if any) that sent a webhook event.
 */
export function createAppIdResolver(
  octokitProvider: OctokitProviderService,
): AppIdResolver {
  const installationIdToAppId = new Map<number, Promise<number | undefined>>();

  return async (request: RequestDetails) => {
    const installationId = lodash.get(
      request.body,
      'installation.id',
    ) as unknown;

    if (!installationId || typeof installationId !== 'number') {
      return undefined;
    }

    let appIdPromsie = installationIdToAppId.get(installationId);
    if (appIdPromsie) {
      return await appIdPromsie;
    }

    const repositoryUrl = lodash.get(
      request.body,
      'repository.html_url',
    ) as unknown;

    if (!repositoryUrl || typeof repositoryUrl !== 'string') {
      return undefined;
    }

    const octokit = await octokitProvider.getOctokit(repositoryUrl);
    appIdPromsie = octokit.rest.apps
      .getInstallation({ installation_id: installationId })
      .then(response => Number(response.data.app_id))
      .catch(() => undefined);

    installationIdToAppId.set(installationId, appIdPromsie);
    return await appIdPromsie;
  };
}
