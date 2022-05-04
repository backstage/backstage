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

import { IndexableDocument } from '@backstage/plugin-search-common';
import lunr from 'lunr';
import { BatchSearchEngineIndexer } from '../indexing';

/**
 * @beta
 */
export class LunrSearchEngineIndexer extends BatchSearchEngineIndexer {
  private schemaInitialized = false;
  private builder: lunr.Builder;
  private docStore: Record<string, IndexableDocument> = {};

  constructor() {
    super({ batchSize: 1000 });

    this.builder = new lunr.Builder();
    this.builder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);
    this.builder.searchPipeline.add(lunr.stemmer);
  }

  // No async initialization required.
  async initialize(): Promise<void> {}
  async finalize(): Promise<void> {}

  async index(documents: IndexableDocument[]): Promise<void> {
    if (!this.schemaInitialized) {
      // Make this lunr index aware of all relevant fields.
      Object.keys(documents[0]).forEach(field => {
        this.builder.field(field);
      });

      // Set "location" field as reference field
      this.builder.ref('location');

      this.schemaInitialized = true;
    }

    documents.forEach(document => {
      // Add document to Lunar index
      this.builder.add(document);

      // Store documents in memory to be able to look up document using the ref during query time
      // This is not how you should implement your SearchEngine implementation! Do not copy!
      this.docStore[document.location] = document;
    });
  }

  buildIndex() {
    return this.builder.build();
  }

  getDocumentStore() {
    return this.docStore;
  }
}
