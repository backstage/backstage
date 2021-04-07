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
  SearchQuery,
  IndexableDocument,
  SearchResultSet,
} from '@backstage/search-common';
import lunr from 'lunr';
import { Logger } from 'winston';
import { SearchEngine, QueryTranslator } from './types';

type ConcreteLunrQuery = {
  lunrQueryString: string;
  documentTypes: string[];
};

export class LunrSearchEngine implements SearchEngine {
  protected lunrIndices: Record<string, lunr.Index> = {};
  protected logger: Logger;

  constructor({ logger }) {
    this.logger = logger;
  }

  protected translator: QueryTranslator = (
    query: SearchQuery,
  ): ConcreteLunrQuery => {
    return {
      lunrQueryString: query.term,
      documentTypes: ['*'],
    };
  };

  index(documentType: string, documents: IndexableDocument[]): void {
    const lunrBuilder = new lunr.Builder();
    documents.forEach(document => lunrBuilder.add(document));
    this.lunrIndices[documentType] = lunrBuilder.build();
  }

  query(query: SearchQuery): Promise<SearchResultSet> {
    const { lunrQueryString, documentTypes } = this.translator(query);
    const results: lunr.Index.Result[] = [];

    if (documentTypes.length === 1 && documentTypes[0] === '*') {
      // Iterate over all this.lunrIndex keys.
      Object.keys(this.lunrIndices).forEach(d => {
        results.concat(this.lunrIndices[d].search(lunrQueryString));
      });
    } else {
      // Iterate over the filtered list of this.lunrIndex keys.
      Object.keys(this.lunrIndices)
        .filter(d => documentTypes.includes(d))
        .forEach(d => {
          results.concat(this.lunrIndices[d].search(lunrQueryString));
        });
    }

    // Sort results.
    results.sort((doc1, doc2) => {
      return doc1.score - doc2.score;
    });

    // Translate results into SearchResultSet

    this.lunrIndices['*'].search(lunrQueryString);
    throw new Error('Method not implemented.');
  }
}
