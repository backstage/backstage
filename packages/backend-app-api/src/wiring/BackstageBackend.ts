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

import { ServiceFactory, BackendFeature } from '@backstage/backend-plugin-api';
import { BackendInitializer } from './BackendInitializer';
import { ServiceRegistry } from './ServiceRegistry';
import { Backend } from './types';

export class BackstageBackend implements Backend {
  #services: ServiceRegistry;
  #initializer: BackendInitializer;

  constructor(apiFactories: ServiceFactory[]) {
    this.#services = new ServiceRegistry(apiFactories);
    this.#initializer = new BackendInitializer(this.#services);
  }

  add(feature: BackendFeature): void {
    this.#initializer.add(feature);
  }

  async start(): Promise<void> {
    await this.#initializer.start();
  }

  async stop(): Promise<void> {
    await this.#initializer.stop();
  }
}
