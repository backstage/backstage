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
  IndexableDocument,
  SearchQuery,
  SearchResultSet,
  QueryTranslator,
  SearchEngine,
} from '@backstage/search-common';
import lunr from 'lunr';
import { Logger } from 'winston';

export type ConcreteLunrQuery = {
  lunrQueryBuilder: lunr.Index.QueryBuilder;
  documentTypes?: string[];
  pageSize: number;
};

type LunrResultEnvelope = {
  result: lunr.Index.Result;
  type: string;
};

type LunrQueryTranslator = (query: SearchQuery) => ConcreteLunrQuery;

export class LunrSearchEngine implements SearchEngine {
  protected lunrIndices: Record<string, lunr.Index> = {};
  protected docStore: Record<string, IndexableDocument>;
  protected logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
    this.docStore = {};
  }

  protected translator: QueryTranslator = ({
    term,
    filters,
    types,
  }: SearchQuery): ConcreteLunrQuery => {
    const pageSize = 25;

    return {
      lunrQueryBuilder: q => {
        const termToken = lunr.tokenizer(term);

        // Support for typeahead seach is based on https://github.com/olivernn/lunr.js/issues/256#issuecomment-295407852
        // look for an exact match and apply a large positive boost
        q.term(termToken, {
          usePipeline: true,
          boost: 100,
        });
        // look for terms that match the beginning of this term and apply a
        // medium boost
        q.term(termToken, {
          usePipeline: false,
          boost: 10,
          wildcard: lunr.Query.wildcard.TRAILING,
        });
        // look for terms that match with an edit distance of 2 and apply a
        // small boost
        q.term(termToken, {
          usePipeline: false,
          editDistance: 2,
          boost: 1,
        });

        if (filters) {
          Object.entries(filters).forEach(([field, fieldValue]) => {
            if (!q.allFields.includes(field)) {
              // Throw for unknown field, as this will be a non match
              throw new Error(`unrecognised field ${field}`);
            }
            // Arrays are poorly supported, but we can make it better for single-item arrays,
            // which should be a common case
            const value =
              Array.isArray(fieldValue) && fieldValue.length === 1
                ? fieldValue[0]
                : fieldValue;

            // Require that the given field has the given value
            if (['string', 'number', 'boolean'].includes(typeof value)) {
              q.term(lunr.tokenizer(value?.toString()), {
                presence: lunr.Query.presence.REQUIRED,
                fields: [field],
              });
            } else if (Array.isArray(value)) {
              // Illustrate how multi-value filters could work.
              // But warn that Lurn supports this poorly.
              this.logger.warn(
                `Non-scalar filter value used for field ${field}. Consider using a different Search Engine for better results.`,
              );
              q.term(lunr.tokenizer(value), {
                presence: lunr.Query.presence.OPTIONAL,
                fields: [field],
              });
            } else {
              // Log a warning or something about unknown filter value
              this.logger.warn(`Unknown filter type used on field ${field}`);
            }
          });
        }
      },
      documentTypes: types,
      pageSize,
    };
  };

  setTranslator(translator: LunrQueryTranslator) {
    this.translator = translator;
  }

  async index(type: string, documents: IndexableDocument[]): Promise<void> {
    const lunrBuilder = new lunr.Builder();

    lunrBuilder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);
    lunrBuilder.searchPipeline.add(lunr.stemmer);

    // Make this lunr index aware of all relevant fields.
    Object.keys(documents[0]).forEach(field => {
      lunrBuilder.field(field);
    });

    // Set "location" field as reference field
    lunrBuilder.ref('location');

    documents.forEach((document: IndexableDocument) => {
      // Add document to Lunar index
      lunrBuilder.add(document);
      // Store documents in memory to be able to look up document using the ref during query time
      // This is not how you should implement your SearchEngine implementation! Do not copy!
      this.docStore[document.location] = document;
    });

    // "Rotate" the index by simply overwriting any existing index of the same name.
    this.lunrIndices[type] = lunrBuilder.build();
  }

  async query(query: SearchQuery): Promise<SearchResultSet> {
    const { lunrQueryBuilder, documentTypes, pageSize } = this.translator(
      query,
    ) as ConcreteLunrQuery;

    const results: LunrResultEnvelope[] = [];

    // Iterate over the filtered list of this.lunrIndex keys.
    Object.keys(this.lunrIndices)
      .filter(type => !documentTypes || documentTypes.includes(type))
      .forEach(type => {
        try {
          results.push(
            ...this.lunrIndices[type].query(lunrQueryBuilder).map(result => {
              return {
                result: result,
                type: type,
              };
            }),
          );
        } catch (err) {
          // if a field does not exist on a index, we can see that as a no-match
          if (
            err instanceof Error &&
            err.message.startsWith('unrecognised field')
          ) {
            return;
          }
          throw err;
        }
      });

    // Sort results.
    results.sort((doc1, doc2) => {
      return doc2.result.score - doc1.result.score;
    });

    // Perform paging
    const { page } = decodePageCursor(query.pageCursor);
    const offset = page * pageSize;
    const hasPreviousPage = page > 0;
    const hasNextPage = results.length > offset + pageSize;
    const nextPageCursor = hasNextPage
      ? encodePageCursor({ page: page + 1 })
      : undefined;
    const previousPageCursor = hasPreviousPage
      ? encodePageCursor({ page: page - 1 })
      : undefined;

    // Translate results into SearchResultSet
    const realResultSet: SearchResultSet = {
      results: results.slice(offset, offset + pageSize).map(d => {
        return { type: d.type, document: this.docStore[d.result.ref] };
      }),
      nextPageCursor,
      previousPageCursor,
    };

    return realResultSet;
  }
}

export function decodePageCursor(pageCursor?: string): { page: number } {
  if (!pageCursor) {
    return { page: 0 };
  }

  return {
    page: Number(Buffer.from(pageCursor, 'base64').toString('utf-8')),
  };
}

export function encodePageCursor({ page }: { page: number }): string {
  return Buffer.from(`${page}`, 'utf-8').toString('base64');
}
