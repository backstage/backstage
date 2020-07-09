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

import { AppConfig } from '@backstage/config';

export function getDocumentationStorageUrlFromAppConfig(): string | undefined {
  const appConfigs = (process.env.APP_CONFIG as unknown) as AppConfig[];
  const envAppConfigs = appConfigs.filter(config => config.context === 'env');
  if (envAppConfigs.length === 0) {
    return undefined;
  }

  const getBaseUrl = (appConfig: any) => appConfig?.data?.techdocs?.baseurl;
  return getBaseUrl(envAppConfigs.find(getBaseUrl));
}

export function getDocumentationStorageUrl(): string {
  return (
    getDocumentationStorageUrlFromAppConfig() ||
    'https://techdocs-mock-sites.storage.googleapis.com'
  );
}

export const docStorageUrl = getDocumentationStorageUrl();
