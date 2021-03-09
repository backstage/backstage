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

export type TodoItem = {
  text: string;
  author?: string;
  viewUrl?: string;
  editUrl?: string;
};

export type ReadTodosOptions = {
  /**
   * Base URLs defining the root at which to search for TODOs
   */
  url: string;
};

export type ReadTodosResult = {
  /**
   * TODO items found at the given locations
   */
  items: TodoItem[];
};

export interface TodoReader {
  /**
   * Searches for TODO items in code at a given location
   */
  readTodos(options: ReadTodosOptions): Promise<ReadTodosResult>;
}
