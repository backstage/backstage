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
import { ReaderOutput } from '../types';
import { LocationSource } from './types';
import { readDescriptorYaml } from './util';
import { URL } from 'url';

// Pointing to raw.githubusercontent.com for now
// to be changed in the future, after auth and tokens are done
export class GitHubLocationSource implements LocationSource {
  async read(target: string): Promise<ReaderOutput[]> {
    let url: URL;

    try {
      url = new URL(target);

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
        throw new Error();
      }

      // Removing the "blob" part
      url.pathname = [empty, userOrOrg, repoName, ...restOfPath].join('/');
      url.hostname = 'raw.githubusercontent.com';
      url.protocol = 'https';
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }

    let rawYaml;
    try {
      rawYaml = await fetch(url.toString()).then(x => {
        return x.text();
      });
    } catch (e) {
      throw new Error(`Unable to read "${target}", ${e}`);
    }

    try {
      return readDescriptorYaml(rawYaml);
    } catch (e) {
      throw new Error(`Malformed descriptor at "${target}", ${e}`);
    }
  }
}
