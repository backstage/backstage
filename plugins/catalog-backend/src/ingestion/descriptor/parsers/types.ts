/*
 * Copyright 2020 Spotify AB
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

import { Entity } from '@backstage/catalog-model';

export type ReaderOutput =
  | { type: 'error'; error: Error }
  | { type: 'data'; data: Entity };

/**
 * Parses raw descriptor data (e.g. from a file) into entities.
 */
export type DescriptorParser = {
  /**
   * Try to parse some raw data into an entity.
   *
   * Note that this is only the low level operation of parsing the raw file
   * format, e.g. reading JSON or YAML or similar and emitting as structured
   * but unvalidated data. The actual validation is performed by EntityPolicy
   * and KindParser.
   *
   * @param data Raw descriptor data
   * @returns A list of raw unvalidated entities / errors, or undefined if the
   *          given data is not meant to be handled by this parser
   * @throws An Error if the format was handled and found to not be properly
   *         formed
   */
  tryParse(data: Buffer): Promise<ReaderOutput[] | undefined>;
};
