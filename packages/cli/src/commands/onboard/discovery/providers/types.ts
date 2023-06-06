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

/**
 * Abstraction for a single repository.
 */
export interface Repository {
  url: string;

  name: string;

  owner: string;

  description?: string;

  file(filename: string): Promise<RepositoryFile | undefined>;
}

/**
 * Abstraction for a single repository file.
 */
export interface RepositoryFile {
  /**
   * The filepath of the data.
   */
  path: string;

  /**
   * The textual contents of the file.
   */
  text(): Promise<string>;
}

/**
 * One integration that supports discovery of repositories.
 */
export interface Provider {
  name(): string;
  discover(url: string): Promise<Repository[] | false>;
}
