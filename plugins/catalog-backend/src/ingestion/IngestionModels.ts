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

import { EntityPolicy, EntityPolicies } from '@backstage/catalog-model';
import { DescriptorParser, ReaderOutput } from './descriptor/parsers/types';
import { LocationReader, LocationReaders } from './source';
import { IngestionModel } from './types';
import { DescriptorParsers } from './descriptor';

export class IngestionModels implements IngestionModel {
  private readonly reader: LocationReader;
  private readonly parser: DescriptorParser;
  private readonly entityPolicy: EntityPolicy;

  static default(): IngestionModel {
    return new IngestionModels(
      new LocationReaders(),
      new DescriptorParsers(),
      new EntityPolicies(),
    );
  }

  constructor(
    reader: LocationReader,
    parser: DescriptorParser,
    entityPolicy: EntityPolicy,
  ) {
    this.reader = reader;
    this.parser = parser;
    this.entityPolicy = entityPolicy;
  }

  async readLocation(type: string, target: string): Promise<ReaderOutput[]> {
    const buffer = await this.reader.tryRead(type, target);
    if (!buffer) {
      throw new Error(`No reader could handle location ${type} ${target}`);
    }

    const items = await this.parser.tryParse(buffer);
    if (!items) {
      throw new Error(`No parser could handle location ${type} ${target}`);
    }

    const result: ReaderOutput[] = [];
    for (const item of items) {
      if (item.type === 'error') {
        result.push(item);
      } else {
        try {
          const output = await this.entityPolicy.enforce(item.data);
          result.push({ type: 'data', data: output });
        } catch (e) {
          result.push({ type: 'error', error: e });
        }
      }
    }

    return result;
  }
}
