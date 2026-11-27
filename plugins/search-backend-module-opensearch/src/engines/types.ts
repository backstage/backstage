/*
 * Copyright 2026 The Backstage Authors
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

/**
 * An index template to install in OpenSearch before indexing starts.
 *
 * @public
 */
export type OpenSearchIndexTemplate = {
  name: string;
  body: {
    index_patterns: string[];
    composed_of?: string[];
    template?: Record<string, unknown>;
  };
};

/**
 * An action accepted by the OpenSearch aliases API.
 *
 * @public
 */
export type OpenSearchAliasAction =
  | {
      remove: { index: any; alias: any };
      add?: undefined;
    }
  | {
      add: { index: any; alias: any; indices?: undefined };
      remove?: undefined;
    }
  | undefined;

/**
 * The document operation used by the bulk helper.
 *
 * @public
 */
export type OpenSearchIndexAction = {
  index: {
    _index: string;
    [key: string]: any;
  };
};

/**
 * The normalized response shape returned by the wrapped client methods.
 *
 * @public
 */
export type OpenSearchClientResponse<TBody = any> = {
  body: TBody;
  headers: Record<string, any> | null;
  statusCode: number | null;
  warnings: string[] | null;
};

/**
 * The promise returned by the wrapped client methods.
 *
 * @public
 */
export type OpenSearchClientResponsePromise<TBody = any> = Promise<
  OpenSearchClientResponse<TBody>
> & {
  abort?: () => void;
};
