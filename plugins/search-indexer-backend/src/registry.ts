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

import {
  IndexableDocumentCollator,
  IndexableDocumentDecorator,
  RegisterCollatorParameters,
  RegisterDecoratorParameters,
} from './types';

interface CollatorRegistryEntry {
  collate: IndexableDocumentCollator;
  refreshInterval: number;
}

export class Registry {
  private collators: Record<string, CollatorRegistryEntry>;
  private decorators: Record<string, IndexableDocumentDecorator[]>;

  private static instance: Registry;

  private constructor() {
    this.collators = {};
    this.decorators = {};
  }

  static getInstance(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }

  addCollator({
    type,
    collator,
    defaultRefreshIntervalSeconds,
  }: RegisterCollatorParameters): void {
    this.collators[type] = {
      refreshInterval: defaultRefreshIntervalSeconds,
      collate: collator,
    };
  }

  addDecorator({
    types = ['*'],
    decorator,
  }: RegisterDecoratorParameters): void {
    types.forEach(type => {
      if (this.decorators.hasOwnProperty(type)) {
        this.decorators[type].push(decorator);
      } else {
        this.decorators[type] = [decorator];
      }
    });
  }

  // @todo But like with coordination, timing, error handling, and what have you.
  execute() {
    Object.keys(this.collators).forEach(async type => {
      const decorators: IndexableDocumentDecorator[] = (
        this.decorators['*'] || []
      ).concat(this.decorators[type] || []);
      let documents = await this.collators[type].collate();

      for (let i = 0; i < decorators.length; i++) {
        documents = await decorators[i](documents);
      }

      // @todo: push documents to a configured search engine.
    });
  }
}
