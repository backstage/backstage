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

import { DescriptorEnvelopeParser } from './descriptors/DescriptorEnvelopeParser';
import { ComponentDescriptorV1beta1Parser } from './descriptors/ComponentDescriptorV1beta1Parser';
import { KindParser } from './descriptors/types';
import { DescriptorParser, ParserOutput } from './types';
import { makeValidator } from '../validation';

export class DescriptorParsers implements DescriptorParser {
  static create(): DescriptorParser {
    const validators = makeValidator();
    return new DescriptorParsers(new DescriptorEnvelopeParser(validators), [
      new ComponentDescriptorV1beta1Parser(),
    ]);
  }

  constructor(
    private readonly envelopeParser: DescriptorEnvelopeParser,
    private readonly kindParsers: KindParser[],
  ) {}

  async parse(descriptor: object): Promise<ParserOutput> {
    const envelope = await this.envelopeParser.parse(descriptor);
    for (const parser of this.kindParsers) {
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
