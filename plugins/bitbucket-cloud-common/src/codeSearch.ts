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
 * Types for the workspace code search endpoint
 * `POST /2.0/workspaces/{workspace}/codesearch`.
 *
 * The OpenAPI specification of Bitbucket Cloud has no schemas for this
 * endpoint, so these types are written by hand from its description. They
 * only hold the fields that the description says a client can rely on.
 *
 * @public
 */
export namespace CodeSearch {
  /**
   * A filter that matches one attribute, such as `repository`, `path`,
   * `project`, `language` or `extension`.
   *
   * `eq` works with every attribute. `wildcard` works only with `path` and
   * `repository` and must match the whole value.
   *
   * @public
   */
  export type AttributeFilter =
    | { attribute: string; eq: string }
    | { attribute: string; wildcard: string };

  /** @public */
  export type Filter =
    | AttributeFilter
    | { and: Filter[] }
    | { or: Filter[] }
    | { not: Filter };

  /** @public */
  export interface Query {
    search_term: string;
    filters?: Filter;
  }

  /** @public */
  export interface Repository {
    url: string;
    host: string;
    ns: string;
    name: string;
  }

  /** @public */
  export interface MatchedFile {
    path: string;
    name: string;
    language?: string | null;
    url: string;
    repositoryId: string;
    /** The commit hash. */
    version: string;
    branch_or_tag_name?: string;
    is_default_branch?: boolean;
  }

  /** @public */
  export interface ResultPage {
    id: string;
    repositories?: Repository[];
    matched_files?: MatchedFile[];
    pagination?: {
      next_cursor?: string;
      has_more?: boolean;
    };
  }
}
