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

import { LocationSpec } from '@backstage/catalog-model';
import fetch, { RequestInit, HeadersInit } from 'node-fetch';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';
import { Config } from '@backstage/config';

export class GithubReaderProcessor implements LocationProcessor {
  private privateToken: string;

  constructor(config?: Config) {
    this.privateToken =
      config?.getOptionalString('catalog.processors.github.privateToken') ?? '';
  }

  getRequestOptions(): RequestInit {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3.raw',
    };

    if (this.privateToken !== '') {
      headers.Authorization = `token ${this.privateToken}`;
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
    if (location.type !== 'github') {
      return false;
    }

    try {
      const url = this.buildRawUrl(location.target);

      // TODO(freben): Should "hard" errors thrown by this line be treated as
      // notFound instead of fatal?
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

  // Converts
  // from: https://github.com/a/b/blob/master/c.yaml
  // to:   https://raw.githubusercontent.com/a/b/master/c.yaml
  private buildRawUrl(target: string): URL {
    try {
      const url = new URL(target);

      const [
        empty,
        userOrOrg,
        repoName,
        blobKeyword,
        ...restOfPath
      ] = url.pathname.split('/');

      if (
        url.hostname !== 'github.com' ||
        empty !== '' ||
        userOrOrg === '' ||
        repoName === '' ||
        blobKeyword !== 'blob' ||
        !restOfPath.join('/').match(/\.yaml$/)
      ) {
        throw new Error('Wrong GitHub URL');
      }

      // Removing the "blob" part
      url.pathname = [empty, userOrOrg, repoName, ...restOfPath].join('/');
      url.hostname = 'raw.githubusercontent.com';
      url.protocol = 'https';

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }
}
