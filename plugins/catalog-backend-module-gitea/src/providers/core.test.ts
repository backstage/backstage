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

import { getGiteaApiUrl } from './core';
import { GiteaIntegrationConfig } from '@backstage/integration';

describe('getGiteaApiUrl', () => {
  it('should return the correct Gitea API base URL', () => {
    const config: GiteaIntegrationConfig = {
      host: 'gitea.example.com',
      baseUrl: 'https://gitea.example.com',
    };

    const result = getGiteaApiUrl(config);

    expect(result).toBe('https://gitea.example.com/api/v1/');
  });

  it('should handle trailing slash in baseUrl correctly', () => {
    const config: GiteaIntegrationConfig = {
      host: 'gitea.example.com',
      baseUrl: 'https://gitea.example.com/',
    };

    const result = getGiteaApiUrl(config);

    expect(result).toBe('https://gitea.example.com//api/v1/');
  });
});
