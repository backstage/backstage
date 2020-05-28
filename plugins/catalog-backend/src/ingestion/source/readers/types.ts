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

export type LocationReader = {
  /**
   * Reads the contents of a single location.
   *
   * @param type The type of location to read
   * @param target The location target (type-specific)
   * @returns The target contents, as a raw Buffer, or undefined if this type
   *          was not meant to be consumed by this reader
   * @throws An error if the type was meant for this reader, but could not be
   *         read
   */
  tryRead(type: string, target: string): Promise<Buffer | undefined>;
};
