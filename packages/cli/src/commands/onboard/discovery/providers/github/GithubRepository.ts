/*
 * Copyright 2023 The Backstage Authors
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

import { graphql } from '@octokit/graphql';
import {
  Repository as GraphqlRepository,
  Blob as GraphqlBlob,
} from '@octokit/graphql-schema';
import { Repository, RepositoryFile } from '../types';
import { GithubFile } from './GithubFile';

export class GithubRepository implements Repository {
  readonly #client: typeof graphql;
  readonly #repo: GraphqlRepository;
  readonly #org: string;

  constructor(client: typeof graphql, repo: GraphqlRepository, org: string) {
    this.#client = client;
    this.#repo = repo;
    this.#org = org;
  }

  get url(): string {
    return this.#repo.url;
  }

  get name(): string {
    return this.#repo.name;
  }

  get owner(): string {
    return this.#org;
  }

  get description(): string | undefined {
    return this.#repo.description ?? undefined;
  }

  async file(filename: string): Promise<RepositoryFile | undefined> {
    const content = await this.#getFileContent(filename);
    if (!content || content.isBinary || !content.text) {
      return undefined;
    }

    return new GithubFile(filename, content.text ?? '');
  }

  async #getFileContent(filename: string) {
    const query = `query RepoFiles($owner: String!, $name: String!, $expr: String!) {
      repository(owner: $owner, name: $name) {
        object(expression: $expr) {
          ...on Blob {
            text
            isBinary
          }
        }
      }
    }`;

    const response = await this.#client<{ repository: GraphqlRepository }>(
      query,
      {
        name: this.#repo.name,
        owner: this.#org,
        expr: `HEAD:${filename}`,
      },
    );

    return response.repository.object as GraphqlBlob;
  }
}
