/*
 * Copyright 2022 The Backstage Authors
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
 * A service that redacts sensitive information from strings.
 *
 * @public
 */
export interface RedactionsService {
  /**
   * Redacts sensitive information from the given input string.
   */
  redact(input: string): string;

  /**
   * Adds a new set of sensitive information to redact.
   */
  addRedactions(redactions: Iterable<string>): void;
}
