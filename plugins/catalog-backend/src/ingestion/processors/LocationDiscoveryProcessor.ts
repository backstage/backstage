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

import { UrlReader } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import { Logger } from 'winston';
import * as result from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import parseGitUri, { stringify } from 'git-url-parse';

type Options = {
  reader: UrlReader;
  logger: Logger;
  pattern?: RegExp;
};

// TODO: This regex is wrong as ADR008 states its only "catalog-info.yaml"
const defaultPattern = /catalog-info\.ya?ml$/;

// TODO: This name is subject to change
export class LocationDiscoveryProcessor implements CatalogProcessor {
  constructor(private readonly options: Options) {}

  async readLocation(
    location: LocationSpec,
    _: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'url') {
      return false;
    }

    const pattern = this.options.pattern ?? defaultPattern;
    const { filepath } = parseGitUri(location.target);

    // TODO: Maybe find a better way to detect whether discovery is necessary
    //  (e.g. by trying to download it, or by reading the tree first?)
    if (pattern.test(filepath ?? '')) {
      return false;
    }

    try {
      // TODO: This approach is using readTree to access the file (names) in the repository.
      //  This can be quite slow in case the repository is very big. Especially as we don't need
      //  the contents but only the file names! Alternatives would be
      //  tree API from github (https://docs.github.com/en/free-pro-team@latest/rest/reference/git#get-a-tree)
      //  however, even the recrusive mode there has limits. This could be a separate API.
      //  This additional (for example listTree()) API could also be used in the catalog-import
      //  plugin to check whether the repository already contains a catalog-info.yaml before
      //  creating a PR for it.

      // TODO: readTree doesn't work for a missing ref, so target has to look like
      //  https://github.com/backstage/backstage/tree/master for now. On the other side
      //  this is good, as it allows to work around the catalog-import plugin.
      const tree = await this.options.reader.readTree(location.target, {
        filter(path: string): boolean {
          return pattern.test(path);
        },
      });
      const files = await tree.files();

      for (const file of files) {
        emit({
          type: 'location',
          location: {
            type: 'url',
            target: await this.generateUrl(location.target, file.path),
          },
          optional: false,
        });
      }
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;

      emit(result.generalError(location, message));
    }

    return true;
  }

  // TODO: This is provider specific! We need a way to generate the full
  //  path to a file in a repository. It would be appealing if the return
  //  value of readTree (or more specific of files() so part of ReadTreeResponseFile)
  //  contains a url property with this url. A UrlReader should have all
  //  details to generate it. However this feels like a breaking change
  //  that all existing readers have to fill.
  private async generateUrl(target: string, file: string): Promise<string> {
    const gitUrl = parseGitUri(target);
    const baseUrl = stringify(gitUrl);
    // TODO: The GitHubReader doesn't know the ref yet if it's missing.
    //  We could extend it by using the github API to retrieve the default
    //  branch. On the other hand I'm not sure where the "..archive/${ref}.tar.gz"
    //  url is comming from. The official endpoint says that REF is optional:
    //  https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#download-a-repository-archive-tar
    const ref = 'master';

    return `${baseUrl}/blob/${ref}/${file}`;
  }
}
