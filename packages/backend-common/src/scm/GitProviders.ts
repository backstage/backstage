/*
 * Copyright 2023 The Backstage Authors
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
import { Config } from '@backstage/config';
import { GitProviderPredicateMux } from './GitProviderPredicateMux';
import { GithubGitProvider } from './GithubGitProvider';
import { BitbucketCloudGitProvider } from './BitbucketCloudGitProvider';
import { GitProvider, GitProviderPredicateTuple } from './types';

/**
 *
 * @public
 */
export type GitProviderFactory = (options: {
  config: Config;
}) => GitProviderPredicateTuple[];

/**
 *
 * @public
 */
export type GitProviderOptions = {
  config: Config;
  factories?: GitProviderFactory[];
};
/**
 * A factory for gettting authenticated Git clients for specific VCS services (github, bitbucket etc.)
 *
 * @public
 */
export class GitProviders {
  static create(options: GitProviderOptions): GitProvider {
    const { config } = options;
    const mux = new GitProviderPredicateMux();
    for (const factory of options.factories ?? []) {
      const tuples = factory({ config });
      for (const tuple of tuples) {
        mux.register(tuple);
      }
    }
    return mux;
  }

  static default(options: GitProviderOptions) {
    const { config, factories = [] } = options;
    return GitProviders.create({
      config,
      factories: factories.concat([
        GithubGitProvider.factory,
        BitbucketCloudGitProvider.factory,
      ]),
    });
  }
}
