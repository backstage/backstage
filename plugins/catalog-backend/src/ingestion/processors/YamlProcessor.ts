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

import { Entity, LocationSpec } from '@backstage/catalog-model';
import lodash from 'lodash';
import yaml from 'yaml';
import { LocationProcessor, LocationProcessorResult } from './types';

export class YamlProcessor implements LocationProcessor {
  async parseData(
    data: Buffer,
    location: LocationSpec,
  ): Promise<LocationProcessorResult[] | undefined> {
    if (!location.target.match(/\.ya?ml$/)) {
      return undefined;
    }

    let documents: yaml.Document.Parsed[];
    try {
      documents = yaml.parseAllDocuments(data.toString('utf8')).filter(d => d);
    } catch (e) {
      const error = new Error(`Failed to parse YAML, ${e}`);
      return [{ type: 'error', location, error }];
    }

    return documents.map(document => {
      if (document.errors?.length) {
        const error = new Error(`YAML error, ${document.errors[0]}`);
        return { type: 'error', location, error };
      }

      const json = document.toJSON();
      if (lodash.isPlainObject(json)) {
        return { type: 'entity', location, entity: json as Entity };
      }

      const error = new Error(`Expected object at root, got ${typeof json}`);
      return { type: 'error', location, error };
    });
  }
}
