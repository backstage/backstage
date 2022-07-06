/*
 * Copyright 2021 The Backstage Authors
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
  FactRetriever,
  FactRetrieverRegistration,
  FactSchema,
} from '@backstage/plugin-tech-insights-node';
import { ConflictError, NotFoundError } from '@backstage/errors';

/**
 * @public
 *
 */
export interface FactRetrieverRegistry {
  register(registration: FactRetrieverRegistration): Promise<void>;
  get(retrieverReference: string): Promise<FactRetrieverRegistration>;
  listRetrievers(): Promise<FactRetriever[]>;
  listRegistrations(): Promise<FactRetrieverRegistration[]>;
  getSchemas(): Promise<FactSchema[]>;
}

/**
 * A basic in memory fact retriever registry.
 *
 * You can replace this with a persistance based version using the FactRetrieverRegistry interface.
 *
 */
export class DefaultFactRetrieverRegistry implements FactRetrieverRegistry {
  private readonly retrievers = new Map<string, FactRetrieverRegistration>();

  static create(
    retrievers: FactRetrieverRegistration[],
  ): FactRetrieverRegistry {
    const registry = new DefaultFactRetrieverRegistry();
    retrievers.forEach(it => {
      registry.register(it);
    });
    return registry;
  }

  async register(registration: FactRetrieverRegistration) {
    if (this.retrievers.has(registration.factRetriever.id)) {
      throw new ConflictError(
        `Tech insight fact retriever with identifier '${registration.factRetriever.id}' has already been registered`,
      );
    }
    this.retrievers.set(registration.factRetriever.id, registration);
    return Promise.resolve();
  }

  async get(retrieverReference: string): Promise<FactRetrieverRegistration> {
    const registration = this.retrievers.get(retrieverReference);
    if (!registration) {
      throw new NotFoundError(
        `Tech insight fact retriever with identifier '${retrieverReference}' is not registered.`,
      );
    }
    return Promise.resolve(registration);
  }

  async listRetrievers(): Promise<FactRetriever[]> {
    return Promise.resolve(
      [...this.retrievers.values()].map(it => it.factRetriever),
    );
  }

  async listRegistrations(): Promise<FactRetrieverRegistration[]> {
    return Promise.resolve([...this.retrievers.values()]);
  }

  async getSchemas(): Promise<FactSchema[]> {
    const retrievers = await this.listRetrievers();
    return Promise.resolve(retrievers.map(it => it.schema));
  }
}
