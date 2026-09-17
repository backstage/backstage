/*
 * Copyright 2020 The Backstage Authors
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

import { Entity, stringifyLocationRef } from '@backstage/catalog-model';
import lodash from 'lodash';
import yaml from 'yaml';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { CatalogProcessorResult } from '../api/processor';
import { processingResult } from '../api/processingResult';

/**
 * Options for parsing entity YAML files.
 *
 * @public
 */
export interface ParseEntityYamlOptions {
  enableYamlMerge?: boolean;
}

/**
 * A helper function that parses a YAML file, properly handling multiple
 * documents in a single file.
 *
 * @public
 * @remarks
 *
 * Each document is expected to be a valid Backstage entity. Each item in the
 * iterable is in the form of an entity result if the document seemed like a
 * valid object, or in the form of an error result if it seemed incorrect. This
 * way, you can choose to retain a partial result if you want.
 *
 * Note that this function does NOT perform any validation of the entities. No
 * assumptions whatsoever can be made on the emnitted entities except that they
 * are valid JSON objects.
 */
export function* parseEntityYaml(
  data: string | Buffer,
  location: LocationSpec,
  options?: ParseEntityYamlOptions,
): Iterable<CatalogProcessorResult> {
  const parseOptions = { merge: options?.enableYamlMerge ?? false };

  let documents: yaml.Document.Parsed[];
  try {
    documents = yaml
      .parseAllDocuments(
        typeof data === 'string' ? data : data.toString('utf8'),
        parseOptions,
      )
      .filter(d => d);
  } catch (e) {
    const loc = stringifyLocationRef(location);
    const message = `Failed to parse YAML at ${loc}, ${e}`;
    yield processingResult.generalError(location, message);
    return;
  }

  for (const document of documents) {
    if (document.errors?.length) {
      const loc = stringifyLocationRef(location);
      const message = `YAML error at ${loc}, ${document.errors[0]}`;
      yield processingResult.generalError(location, message);
    } else {
      const json = document.toJSON();
      if (lodash.isPlainObject(json)) {
        yield processingResult.entity(location, json as Entity);
      } else if (json === null) {
        // Ignore null values, these happen if there is an empty document in the
        // YAML file, for example if --- is added to the end of the file.
      } else {
        const message = `Expected object at root, got ${typeof json}`;
        yield processingResult.generalError(location, message);
      }
    }
  }
}
