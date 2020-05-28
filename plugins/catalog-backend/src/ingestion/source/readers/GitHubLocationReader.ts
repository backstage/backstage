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

import fetch from 'node-fetch';
import { URL } from 'url';
import { LocationReader } from './types';

/**
 * Reads a file whose target is a GitHub URL.
 *
 * Uses raw.githubusercontent.com for now, but this will probably change in the
 * future when token auth is implemented.
 */
export class GitHubLocationReader implements LocationReader {
  async tryRead(type: string, target: string): Promise<Buffer | undefined> {
    if (type !== 'github') {
      return undefined;
    }

    const url = this.buildRawUrl(target);
    try {
      return await fetch(url.toString()).then(x => x.buffer());
    } catch (e) {
      throw new Error(`Unable to read "${target}", ${e}`);
    }
  }

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
