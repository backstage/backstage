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

import yaml from 'yaml';
import { ReaderOutput } from '../types';

export function readDescriptorYaml(data: string): ReaderOutput[] {
  let documents;
  try {
    documents = yaml.parseAllDocuments(data);
  } catch (e) {
    throw new Error(`Could not parse YAML data, ${e}`);
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
            data: json,
          });
        }
      }
    }
  }

  return result;
}
