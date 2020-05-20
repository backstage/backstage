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

import { ComponentDescriptorV1beta1 } from './descriptors/ComponentDescriptorV1beta1Parser';

export type ComponentDescriptor = ComponentDescriptorV1beta1;

export type ParserOutput = {
  kind: 'Component';
  component: ComponentDescriptor;
};

export type DescriptorParser = {
  /**
   * Parses and validates a single raw descriptor.
   *
   * @param descriptor A raw descriptor object
   * @returns A structure describing the parsed and validated descriptor
   * @throws An Error if the descriptor was malformed
   */
  parse(descriptor: object): Promise<ParserOutput>;
};

export class ParserError extends Error {
  constructor(message?: string, private _componentName?: string | undefined) {
    super(message);
  }
  get componentName() {
    return this._componentName;
  }
}

export type ReaderOutput =
  | { type: 'error'; error: Error }
  | { type: 'data'; data: object };

export type LocationReader = {
  /**
   * Reads the contents of a single location.
   *
   * @param type The type of location to read
   * @param target The location target (type-specific)
   * @returns The parsed contents, as an array of unverified descriptors or
   *          errors where the individual documents could not be parsed.
   * @throws An error if the location as a whole could not be read
   */
  read(type: string, target: string): Promise<ReaderOutput[]>;
};
