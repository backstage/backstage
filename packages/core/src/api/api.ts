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

import ApiRef, { ApiRefConfig } from './apis/ApiRef';
import AppBuilder from './app/AppBuilder';
import BackstagePlugin, { PluginConfig } from './plugin/Plugin';

export function createApp() {
  return new AppBuilder();
}

export function createApiRef<T>(config: ApiRefConfig) {
  return new ApiRef<T>(config);
}

export function createPlugin(config: PluginConfig): BackstagePlugin {
  return new BackstagePlugin(config);
}
