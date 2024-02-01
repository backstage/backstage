import { Entity } from '@backstage/catalog-model';
import { Build, CiClient } from './CiClient';

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
export class AggregateCiClient {
  #clients: CiClient[] = [];

  addClients(...client: CiClient[]) {
    this.#clients.push(...client);
  }

  getBuilds(
    contextualEntity: Entity,
    branch: string,
    limit: number,
  ): Promise<Build[]> {
    const matchingClient = this.#clients.find(e => e.matcher(contextualEntity));
    if (!matchingClient) {
      throw new Error('Cannot find a matching client.');
    }
    return matchingClient.getBuilds(branch, limit);
  }
}
