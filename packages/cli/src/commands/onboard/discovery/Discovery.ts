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

import chalk from 'chalk';
import { Entity } from '@backstage/catalog-model';
import { Analyzer } from './analyzers/types';
import { Provider } from './providers/types';
import { DefaultAnalysisOutputs } from './analyzers/DefaultAnalysisOutputs';
import { Task } from '../../../lib/tasks';

export class Discovery {
  readonly #providers: Provider[] = [];
  readonly #analyzers: Analyzer[] = [];

  addProvider(provider: Provider) {
    this.#providers.push(provider);
  }

  addAnalyzer(analyzer: Analyzer) {
    this.#analyzers.push(analyzer);
  }

  async run(url: string): Promise<{ entities: Entity[] }> {
    Task.log(`Running discovery for ${chalk.cyan(url)}`);
    const result: Entity[] = [];

    for (const provider of this.#providers) {
      const repositories = await provider.discover(url);
      if (repositories && repositories.length) {
        Task.log(
          `Discovered ${chalk.cyan(
            repositories.length,
          )} repositories for ${chalk.cyan(provider.name())}`,
        );

        for (const repository of repositories) {
          await Task.forItem('Analyzing', repository.name, async () => {
            const output = new DefaultAnalysisOutputs();
            for (const analyzer of this.#analyzers) {
              await analyzer.analyzeRepository({ repository, output });
            }

            output
              .list()
              .filter(entry => entry.type === 'entity')
              .forEach(({ entity }) => result.push(entity));
          });
        }

        Task.log(`Produced ${chalk.cyan(result.length || 'no')} entities`);
      }
    }

    return {
      entities: result,
    };
  }
}
