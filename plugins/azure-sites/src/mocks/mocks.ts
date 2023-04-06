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

import { AzureSite } from '@backstage/plugin-azure-sites-common';

export const entityMock = {
  metadata: {
    namespace: 'default',
    annotations: {
      'azure.com/microsoft-web-sites': 'func-mock',
    },
    name: 'sample-azure-service',
    description: 'A service for testing Backstage functionality.',
    uid: 'c009b513-d053-4b3f-9429-8433a145e943',
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'service',
    owner: 'dev_group@example.com',
    lifecycle: 'experimental',
  },
};

// https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Web/sites/{{functionsName}}?api-version=2022-03-01
export const siteMock: AzureSite = {
  name: 'func-mock',
  kind: 'functionapp',
  resourceGroup: 'mock-resourcegroup',
  subscription: '00000000-0000-0000-0000-000000000000',
  tags: {
    isMock: true,
  },
  location: 'West Europe',
  state: 'Running',
  href: 'https://mockurl.api.azurewebsites.windows.net:454/subscriptions/00000000-0000-0000-0000-000000000000/webspaces/rg_mock-WestEuropewebspace/sites/func-mock',
  logstreamHref:
    'https://mockurl.api.azurewebsites.windows.net:454/subscriptions/00000000-0000-0000-0000-000000000000/webspaces/rg_mock-WestEuropewebspace/sites/func-mock/logStream',
  usageState: 'Normal',
  lastModifiedDate: '2022-09-02T11:09:58.9033333',
  containerSize: 100,
};
