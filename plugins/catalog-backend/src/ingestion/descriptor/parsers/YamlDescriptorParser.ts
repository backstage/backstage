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
import yaml from 'yaml';
import { DescriptorParser, ReaderOutput } from './types';

/**
 * Parses descriptors on YAML format
 */
export class YamlDescriptorParser implements DescriptorParser {
  async tryParse(data: Buffer): Promise<ReaderOutput[] | undefined> {
    // TODO(freben): Should perhaps first do format detection, so the parse
    // failure can be emitted as a proper error instead of just as if we
    // weren't handling the format at all.
    let documents;
    try {
      documents = yaml.parseAllDocuments(data.toString('utf8'));
    } catch (e) {
      return undefined;
    }

    const result: ReaderOutput[] = [];

    for (const document of documents) {
      if (document.contents) {
        if (document.errors?.length) {
          result.push({
            type: 'error',
            error: new Error(`Malformed YAML document, ${document.errors[0]}`),
          });
        } else {
          const json = document.toJSON();
          if (typeof json !== 'object' || Array.isArray(json)) {
            result.push({
              type: 'error',
              error: new Error(`Malformed descriptor, expected object at root`),
            });
          } else {
            result.push({
              type: 'data',
              data: json as Entity,
            });
          }
        }
      }
    }

    return result;
  }
}
