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
  IndexableResultSet,
  SearchQuery,
} from '@backstage/plugin-search-common';
import { QueryTranslator, SearchEngine } from '../types';
import { MissingIndexError } from '../errors';
import lunr from 'lunr';
import { v4 as uuid } from 'uuid';
import { LunrSearchEngineIndexer } from './LunrSearchEngineIndexer';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Type of translated query for the Lunr Search Engine.
 * @public
 */
export type ConcreteLunrQuery = {
  lunrQueryBuilder: lunr.Index.QueryBuilder;
  documentTypes?: string[];
  pageSize: number;
};

type LunrResultEnvelope = {
  result: lunr.Index.Result;
  type: string;
};

/**
 * Translator responsible for translating search term and filters to a query that the Lunr Search Engine understands.
 * @public
 */
export type LunrQueryTranslator = (query: SearchQuery) => ConcreteLunrQuery;

/**
 * Lunr specific search engine implementation.
 * @public
 */
export class LunrSearchEngine implements SearchEngine {
  protected lunrIndices: Record<string, lunr.Index> = {};
  protected docStore: Record<string, IndexableDocument>;
  protected logger: LoggerService;
  protected highlightPreTag: string;
  protected highlightPostTag: string;

  constructor(options: { logger: LoggerService }) {
    this.logger = options.logger;
    this.docStore = {};
    const uuidTag = uuid();
    this.highlightPreTag = `<${uuidTag}>`;
    this.highlightPostTag = `</${uuidTag}>`;
  }

  protected translator: QueryTranslator = ({
    term,
    filters,
    types,
    pageLimit,
  }: SearchQuery): ConcreteLunrQuery => {
    const pageSize = pageLimit || 25;

    return {
      lunrQueryBuilder: q => {
        const termToken = lunr.tokenizer(term);

        // Support for typeahead search is based on https://github.com/olivernn/lunr.js/issues/256#issuecomment-295407852
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
              q.term(
                lunr
                  .tokenizer(value?.toString())
                  .map(lunr.stopWordFilter)
                  .filter(element => element !== undefined),
                {
                  presence: lunr.Query.presence.REQUIRED,
                  fields: [field],
                },
              );
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

  async getIndexer(type: string) {
    const indexer = new LunrSearchEngineIndexer();
    const indexerLogger = this.logger.child({ documentType: type });
    let errorThrown: Error | undefined;

    indexer.on('error', err => {
      errorThrown = err;
    });

    indexer.on('close', () => {
      // Once the stream is closed, build the index and store the documents in
      // memory for later retrieval.
      const newDocuments = indexer.getDocumentStore();
      const docStoreExists = this.lunrIndices[type] !== undefined;
      const documentsIndexed = Object.keys(newDocuments).length;

      // Do not set the index if there was an error or if no documents were
      // indexed. This ensures search continues to work for an index, even in
      // case of transient issues in underlying collators.
      if (!errorThrown && documentsIndexed > 0) {
        this.lunrIndices[type] = indexer.buildIndex();
        this.docStore = { ...this.docStore, ...newDocuments };
      } else {
        indexerLogger.warn(
          `Index for ${type} was not ${
            docStoreExists ? 'replaced' : 'created'
          }: ${
            errorThrown
              ? 'an error was encountered'
              : 'indexer received 0 documents'
          }`,
        );
      }
    });

    return indexer;
  }

  async query(query: SearchQuery): Promise<IndexableResultSet> {
    const { lunrQueryBuilder, documentTypes, pageSize } = this.translator(
      query,
    ) as ConcreteLunrQuery;

    const results: LunrResultEnvelope[] = [];

    const indexKeys = Object.keys(this.lunrIndices).filter(
      type => !documentTypes || documentTypes.includes(type),
    );

    if (documentTypes?.length && !indexKeys.length) {
      throw new MissingIndexError(
        `Missing index for ${documentTypes?.toString()}. This could be because the index hasn't been created yet or there was a problem during index creation.`,
      );
    }

    // Iterate over the filtered list of this.lunrIndex keys.
    indexKeys.forEach(type => {
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

    // Translate results into IndexableResultSet
    const realResultSet: IndexableResultSet = {
      results: results.slice(offset, offset + pageSize).map((d, index) => ({
        type: d.type,
        document: this.docStore[d.result.ref],
        rank: page * pageSize + index + 1,
        highlight: {
          preTag: this.highlightPreTag,
          postTag: this.highlightPostTag,
          fields: parseHighlightFields({
            preTag: this.highlightPreTag,
            postTag: this.highlightPostTag,
            doc: this.docStore[d.result.ref],
            positionMetadata: d.result.matchData.metadata as any,
          }),
        },
      })),
      numberOfResults: results.length,
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

type ParseHighlightFieldsProps = {
  preTag: string;
  postTag: string;
  doc: any;
  positionMetadata: {
    [term: string]: {
      [field: string]: {
        position: number[][];
      };
    };
  };
};

export function parseHighlightFields({
  preTag,
  postTag,
  doc,
  positionMetadata,
}: ParseHighlightFieldsProps): { [field: string]: string } {
  // Merge the field positions across all query terms
  const highlightFieldPositions = Object.values(positionMetadata).reduce(
    (fieldPositions, metadata) => {
      Object.keys(metadata).map(fieldKey => {
        const validFieldMetadataPositions = metadata[
          fieldKey
        ]?.position?.filter(position => Array.isArray(position));
        if (validFieldMetadataPositions.length) {
          fieldPositions[fieldKey] = fieldPositions[fieldKey] ?? [];
          fieldPositions[fieldKey].push(...validFieldMetadataPositions);
        }
      });

      return fieldPositions;
    },
    {} as { [field: string]: number[][] },
  );

  return Object.fromEntries(
    Object.entries(highlightFieldPositions).map(([field, positions]) => {
      positions.sort((a, b) => b[0] - a[0]);

      const highlightedField = positions.reduce((content, pos) => {
        return (
          `${String(content).substring(0, pos[0])}${preTag}` +
          `${String(content).substring(pos[0], pos[0] + pos[1])}` +
          `${postTag}${String(content).substring(pos[0] + pos[1])}`
        );
      }, doc[field] ?? '');

      return [field, highlightedField];
    }),
  );
}
