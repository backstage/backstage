/*
 * Copyright 2021 The Backstage Authors
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

import { VM } from 'vm2';
import { resolvePackagePath } from '@backstage/backend-common';
import fs from 'fs-extra';
import { RepoSpec } from '../../scaffolder/actions/builtin/publish/util';

const mkScript = (nunjucksSource: string) => `
const render = (() => {
  const module = {};
  const require = (pkg) => { if (pkg === 'events') { return function (){}; }};

  ${nunjucksSource}

  const env = module.exports.configure({
    autoescape: false,
    tags: {
      variableStart: '\${{',
      variableEnd: '}}',
    },
  });

  if (typeof jsonify !== 'undefined' && jsonify) {
    env.addFilter('jsonify', env.getFilter('dump'));
  }

  if (typeof parseRepoUrl !== 'undefined') {
    env.addFilter('parseRepoUrl', repoUrl => {
      return JSON.parse(parseRepoUrl(repoUrl))
    });
    env.addFilter('projectSlug', repoUrl => {
      const { owner, repo } = JSON.parse(parseRepoUrl(repoUrl));
      return owner + '/' + repo;
    });
  }

  return function render(str, values) {
    try {
      return env.renderString(str, JSON.parse(values));
    } catch (error) {
      // Make sure errors don't leak anything
      throw new Error(String(error.message));
    }
  }
})();
`;

export interface SecureTemplaterOptions {
  jsonify?: true;
  parseRepoUrl?(repoUrl: string): RepoSpec;
}

export class SecureTemplater {
  #vm?: VM;

  #jsonify?: true;
  #parseRepoUrl?: (repoUrl: string) => RepoSpec;

  constructor(options?: SecureTemplaterOptions) {
    this.#jsonify = options?.jsonify;
    this.#parseRepoUrl = options?.parseRepoUrl;
  }

  async render(template: string, values: unknown) {
    const vm = await this.getVm();
    vm.setGlobal('templateStr', template);
    vm.setGlobal('templateValues', JSON.stringify(values));
    const result = vm.run(`render(templateStr, templateValues)`);
    return result;
  }

  private async getVm() {
    if (!this.#vm) {
      let sandbox = undefined;
      if (this.#jsonify) {
        sandbox = { jsonify: true };
      }
      if (this.#parseRepoUrl) {
        const parseRepoUrl = this.#parseRepoUrl;
        sandbox = {
          ...sandbox,
          parseRepoUrl: (url: string) => JSON.stringify(parseRepoUrl(url)),
        };
      }

      this.#vm = new VM({ timeout: 1000, sandbox });

      const nunjucksSource = await fs.readFile(
        resolvePackagePath(
          '@backstage/plugin-scaffolder-backend',
          'assets/nunjucks.js.txt',
        ),
        'utf-8',
      );

      this.#vm.run(mkScript(nunjucksSource));
    }
    return this.#vm;
  }
}
