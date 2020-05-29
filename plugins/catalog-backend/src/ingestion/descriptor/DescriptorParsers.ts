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

import { DescriptorParser, ReaderOutput } from './parsers/types';
import { YamlDescriptorParser } from './parsers/YamlDescriptorParser';

/**
 * Parses raw descriptor data (e.g. from a file or stream) into entities.
 */
export class DescriptorParsers implements DescriptorParser {
  private readonly parsers: DescriptorParser[];

  static defaultParsers(): DescriptorParser[] {
    return [new YamlDescriptorParser()];
  }

  constructor(
    parsers: DescriptorParser[] = DescriptorParsers.defaultParsers(),
  ) {
    this.parsers = parsers;
  }

  async tryParse(data: Buffer): Promise<ReaderOutput[] | undefined> {
    for (const parser of this.parsers) {
      const result = await parser.tryParse(data);
      if (result) {
        return result;
      }
    }
    throw new Error(`Unsupported descriptor format`);
  }
}
