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
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

export class YamlProcessor implements LocationProcessor {
  async parseData(
    data: Buffer,
    location: LocationSpec,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (!location.target.match(/\.ya?ml/)) {
      return false;
    }

    let documents: yaml.Document.Parsed[];
    try {
      documents = yaml.parseAllDocuments(data.toString('utf8')).filter(d => d);
    } catch (e) {
      emit(result.generalError(location, `Failed to parse YAML, ${e}`));
      return true;
    }

    for (const document of documents) {
      if (document.errors?.length) {
        const message = `YAML error, ${document.errors[0]}`;
        emit(result.generalError(location, message));
      } else {
        const json = document.toJSON();
        if (lodash.isPlainObject(json)) {
          emit(result.entity(location, json as Entity));
        } else {
          const message = `Expected object at root, got ${typeof json}`;
          emit(result.generalError(location, message));
        }
      }
    }

    return true;
  }
}
