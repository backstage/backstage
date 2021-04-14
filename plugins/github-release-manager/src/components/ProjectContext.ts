/*
 * Copyright 2021 Spotify AB
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

import { createContext, useContext } from 'react';

import { PluginApiClient } from '../api/PluginApiClient';
import { GitHubReleaseManagerError } from '../errors/GitHubReleaseManagerError';

export const PluginApiClientContext = createContext<
  PluginApiClient | undefined
>(undefined);

export const usePluginApiClientContext = () => {
  const pluginApiClient = useContext(PluginApiClientContext);

  if (!pluginApiClient) {
    throw new GitHubReleaseManagerError('pluginApiClient not found');
  }

  return pluginApiClient;
};
