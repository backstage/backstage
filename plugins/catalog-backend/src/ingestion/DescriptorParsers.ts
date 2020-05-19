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

import { ComponentDescriptorV1Parser } from './descriptors/ComponentDescriptorV1Parser';
import { parseDescriptorEnvelope } from './descriptors/DescriptorEnvelope';
import { EnvelopeParser } from './descriptors/types';
import { DescriptorParser, ParserOutput } from './types';

export class DescriptorParsers implements DescriptorParser {
  static create(): DescriptorParser {
    return new DescriptorParsers([new ComponentDescriptorV1Parser()]);
  }

  constructor(private readonly parsers: EnvelopeParser[]) {}

  async parse(descriptor: object): Promise<ParserOutput> {
    const envelope = await parseDescriptorEnvelope(descriptor);

    for (const parser of this.parsers) {
      const parsed = await parser.tryParse(envelope);
      if (parsed) {
        return parsed;
      }
    }

    throw new Error(
      `Unsupported object ${envelope.apiVersion}, ${envelope.kind}`,
    );
  }
}
