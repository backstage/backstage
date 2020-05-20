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

import { ParserOutput } from '../types';
import { DescriptorEnvelope } from './DescriptorEnvelopeParser';

export type KindParser = {
  /**
   * Parses and validates a single envelope into its materialized kind.
   *
   * These parsers may assume that the envelope is already validated and
   * well formed.
   *
   * @param envelope A valid descriptor envelope
   * @returns A materialized type, or undefined if the given version/kind is
   *          not handled by this parser
   * @throws An Error if the type was handled and found to not be properly
   *         formatted
   */
  tryParse(envelope: DescriptorEnvelope): Promise<ParserOutput | undefined>;
};
