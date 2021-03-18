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

import { DocumentCollator, DocumentDecorator } from '@backstage/search-common';
import {
  RegisterCollatorParameters,
  RegisterDecoratorParameters,
} from './types';

interface CollatorEnvelope {
  collate: DocumentCollator;
  refreshInterval: number;
}

export class IndexBuilder {
  private collators: Record<string, CollatorEnvelope>;
  private decorators: Record<string, DocumentDecorator[]>;

  constructor() {
    this.collators = {};
    this.decorators = {};
  }

  /**
   * Makes the index builder aware of a collator that should be executed at the
   * given refresh interval.
   */
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

  /**
   * Makes the index builder aware of a decorator. If no types are provided, it
   * will be applied to documents from all known collators, otherwise it will
   * only be applied to documents of the given types.
   */
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

  /**
   * Starts the process of executing collators and decorators and building the
   * search index.
   *
   * TODO: But like with coordination, timing, error handling, and what have you.
   */
  async build() {
    return Promise.all(
      Object.keys(this.collators).map(async type => {
        const decorators: DocumentDecorator[] = (
          this.decorators['*'] || []
        ).concat(this.decorators[type] || []);

        let documents = await this.collators[type].collate.execute();
        for (let i = 0; i < decorators.length; i++) {
          documents = await decorators[i].execute(documents);
        }

        // TODO: push documents to a configured search engine.
      }),
    );
  }
}
