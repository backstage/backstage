/*
 * Copyright 2024 The Backstage Authors
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
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { coreCliServices } from '../services';
import { Command } from 'commander';

/** @public */
export const commanderServiceFactory = createServiceFactory({
  service: coreCliServices.commander,
  deps: {
    rootCommander: coreCliServices.rootCommander,
    plugin: coreServices.pluginMetadata,
  },
  factory({ plugin, rootCommander }) {
    return rootCommander.command(plugin.getId()).exitOverride();
  },
});

export const rootCommanderServiceFactory = createServiceFactory({
  service: coreCliServices.rootCommander,
  deps: {},
  async factory() {
    return new Command().version('0.0.0');
  },
});
