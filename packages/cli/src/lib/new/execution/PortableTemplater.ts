/*
 * Copyright 2025 The Backstage Authors
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

import handlebars, { HelperDeclareSpec } from 'handlebars';
import { PortableTemplateParams } from '../types';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import lowerCase from 'lodash/lowerCase';
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';
import upperCase from 'lodash/upperCase';
import upperFirst from 'lodash/upperFirst';
import lowerFirst from 'lodash/lowerFirst';
import { Lockfile } from '../../versioning';
import { paths } from '../../paths';
import { createPackageVersionProvider } from '../../version';

const builtInHelpers = {
  camelCase,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
  lowerFirst,
};

type CreateTemplaterOptions = {
  helpers?: HelperDeclareSpec;
};

export class PortableTemplater {
  static async create() {
    let lockfile: Lockfile | undefined;
    try {
      lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
    } catch {
      /* ignored */
    }

    const versionProvider = createPackageVersionProvider(lockfile);

    return new PortableTemplater({
      helpers: {
        versionQuery(name: string, versionHint: string | unknown) {
          return versionProvider(
            name,
            typeof versionHint === 'string' ? versionHint : undefined,
          );
        },
      },
    });
  }

  readonly #templater: typeof handlebars;

  private constructor(options: CreateTemplaterOptions = {}) {
    this.#templater = handlebars.create();

    this.#templater.registerHelper(builtInHelpers);

    if (options.helpers) {
      this.#templater.registerHelper(options.helpers);
    }
  }

  template(content: string, values: PortableTemplateParams): string {
    return this.#templater.compile(content, {
      strict: true,
    })(values);
  }

  templateRecord(
    record: Record<string, string>,
    values: PortableTemplateParams,
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(record).map(([key, value]) => [
        key,
        this.template(value, values),
      ]),
    );
  }
}
