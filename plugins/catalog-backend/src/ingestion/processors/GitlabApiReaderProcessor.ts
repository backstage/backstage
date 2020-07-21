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
import fetch, { RequestInit, HeadersInit } from 'node-fetch';
import lodash from 'lodash';
import yaml from 'yaml';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

export class GitlabApiReaderProcessor implements LocationProcessor {
  private privateToken: string = process.env.GITLAB_PRIVATE_TOKEN || '';

  getRequestOptions(): RequestInit {
    const headers: HeadersInit = { 'PRIVATE-TOKEN': '' };
    if (this.privateToken !== '') {
      headers['PRIVATE-TOKEN'] = this.privateToken;
    }

    const requestOptions: RequestInit = {
      headers,
    };

    return requestOptions;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'gitlab/api') {
      return false;
    }

    try {
      // const url = this.buildRawUrl(location.target);
      const url = new URL(location.target);
      const response = await fetch(url.toString(), this.getRequestOptions());
      if (response.ok) {
        const data = await response.buffer();
        emit(result.data(location, data));
      } else {
        const message = `${location.target} could not be read as ${url}, ${response.status} ${response.statusText}`;
        if (response.status === 404) {
          if (!optional) {
            emit(result.notFoundError(location, message));
          }
        } else {
          emit(result.generalError(location, message));
        }
      }
    } catch (e) {
      const message = `Unable to read ${location.type} ${location.target}, ${e}`;
      emit(result.generalError(location, message));
    }
    return true;
  }

  // We need our own parseData because the gitlab api url has `/raw?ref=branch`
  // on the end which doesn't match the regex in YamlProcessor (.ya?ml$)
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
