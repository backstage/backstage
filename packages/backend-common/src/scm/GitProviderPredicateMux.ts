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
import { Git } from '@backstage/backend-common';
import { NotAllowedError } from '@backstage/errors';
import { GitProvider, GitProviderPredicateTuple } from './types';

/**
 * A GitProvider implementation that selects from a set of GitProviders
 */
export class GitProviderPredicateMux implements GitProvider {
  private readonly gitProviders: GitProviderPredicateTuple[] = [];
  async getGit(url: string): Promise<Git> {
    for (const { predicate, gitProvider } of this.gitProviders) {
      if (predicate(new URL(url))) {
        return gitProvider.getGit(url);
      }
    }
    throw new NotAllowedError('No git provider found for url');
  }

  register(tuple: GitProviderPredicateTuple): void {
    this.gitProviders.push(tuple);
  }
}
