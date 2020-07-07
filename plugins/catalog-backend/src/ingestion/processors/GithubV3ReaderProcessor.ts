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
import fetch from 'node-fetch';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

const privateToken = process.env.GITHUB_PRIVATE_TOKEN;

export class GithubV3ReaderProcessor implements LocationProcessor {
  getRequestOptions(): RequestInit {
    const requestOptions: RequestInit = {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      },
    };

    if (privateToken) {
      requestOptions.headers.Authorization = `token ${privateToken}`;
    }
    return requestOptions;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'github/v3') {
      return false;
    }

    try {
      const url = this.buildRawUrl(location.target);

      const response = await fetch(url.toString(), this.getRequestOptions());

      if (response.ok) {
        const buffer = await response.buffer();

        emit(result.data(location, buffer));
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
  // from: https://github.com/a/b/blob/master/path/to/c.yaml
  // to:   https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=master
  buildRawUrl(target: string): URL {
    try {
      const url = new URL(target);

      const [
        empty,
        userOrOrg,
        repoName,
        blobKeyword,
        ref,
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

      // transform to api
      url.pathname = [
        empty,
        'repos',
        userOrOrg,
        repoName,
        'contents',
        ...restOfPath,
      ].join('/');
      url.hostname = 'api.github.com';
      url.protocol = 'https';
      url.search = `ref=${ref}`;

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }
}
