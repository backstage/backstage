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

export class BitbucketApiReaderProcessor implements LocationProcessor {
  private username: string;
  private password: string;

  constructor(config: Config) {
    this.username =
      (config.getOptional(
        'catalog.processors.bitbucketApi.userName',
      ) as string) ?? '';
    this.password =
      (config.getOptional(
        'catalog.processors.bitbucketApi.appPassword',
      ) as string) ?? '';
  }

  getRequestOptions(): RequestInit {
    const headers: HeadersInit = {};

    if (this.username !== '' && this.password !== '') {
      headers.Authorization = `Basic ${Buffer.from(
        `${this.username}:${this.password}`,
        'utf8',
      ).toString('base64')}`;
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
    if (location.type !== 'bitbucket/api') {
      return false;
    }

    try {
      const url = this.buildRawUrl(location.target);

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
  // from: https://bitbucket.org/orgname/reponame/src/master/file.yaml
  // to:   https://api.bitbucket.org/2.0/repositories/orgname/reponame/src/master/file.yaml

  buildRawUrl(target: string): URL {
    try {
      const url = new URL(target);

      const [
        empty,
        userOrOrg,
        repoName,
        srcKeyword,
        ref,
        ...restOfPath
      ] = url.pathname.split('/');

      if (
        url.hostname !== 'bitbucket.org' ||
        empty !== '' ||
        userOrOrg === '' ||
        repoName === '' ||
        srcKeyword !== 'src' ||
        !restOfPath.join('/').match(/\.yaml$/)
      ) {
        throw new Error('Wrong Bitbucket URL or Invalid file path');
      }

      // transform to api
      url.pathname = [
        empty,
        '2.0',
        'repositories',
        userOrOrg,
        repoName,
        'src',
        ref,
        ...restOfPath,
      ].join('/');
      url.hostname = 'api.bitbucket.org';
      url.protocol = 'https';

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }
}
