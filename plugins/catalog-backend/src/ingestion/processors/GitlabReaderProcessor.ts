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

export class GitlabReaderProcessor implements LocationProcessor {
  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'gitlab') {
      return false;
    }

    try {
      const url = this.buildRawUrl(location.target);

      const response = await fetch(url.toString());

      if (response.ok) {
        const data = await response.buffer();
        emit(result.data(location, data));
      } else {
        const message = `${location.target} could not be read as ${url}, ${response.status} ${response.statusText}`;
        if (response.status === 404) {
          if (!optional) {
            throw result.notFoundError(location, message);
          }
        } else {
          throw result.generalError(location, message);
        }
      }
    } catch (e) {
      const message = `Unable to read ${location.type} ${location.target}, ${e}`;
      emit(result.generalError(location, message));
    }

    return true;
  }

  // Converts
  // from: https://gitlab.example.com/a/b/blob/master/c.yaml
  // to:   https://gitlab.example.com/a/b/raw/master/c.yaml
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
        empty !== '' ||
        userOrOrg === '' ||
        repoName === '' ||
        blobKeyword !== 'blob' ||
        !restOfPath.join('/').match(/\.yaml$/)
      ) {
        throw new Error('Wrong Gitlab URL');
      }

      // Replace 'blob' with 'raw'
      url.pathname = [empty, userOrOrg, repoName, 'raw', ...restOfPath].join(
        '/',
      );

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }
}
