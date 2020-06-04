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

import { NotFoundError } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import fetch from 'node-fetch';
import { LocationProcessor, LocationProcessorResult } from './types';

export class GithubReaderProcessor implements LocationProcessor {
  async readLocation(
    location: LocationSpec,
  ): Promise<LocationProcessorResult[] | undefined> {
    if (location.type !== 'github') {
      return undefined;
    }

    const url = this.buildRawUrl(location.target);
    const response = await fetch(url.toString()); // May also throw

    if (!response.ok) {
      const message = `${location.target} could not be read as ${url}, ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        throw new NotFoundError(message);
      } else {
        throw new Error(message);
      }
    }

    try {
      return [{ type: 'data', location, data: await response.buffer() }];
    } catch (e) {
      throw new Error(`Unable to read body of ${location.target}, ${e}`);
    }
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
