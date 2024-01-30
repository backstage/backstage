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

import { Isolate } from 'isolated-vm';
import { resolvePackagePath } from '@backstage/backend-common';
import {
  TemplateFilter as _TemplateFilter,
  TemplateGlobal as _TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { JsonValue } from '@backstage/types';
import { getMajorNodeVersion, isNoNodeSnapshotOptionProvided } from './helpers';

// language=JavaScript
const mkScript = (nunjucksSource: string) => `
const { render, renderCompat } = (() => {
  const module = {};
  const process = { env: {} };
  const require = (pkg) => { if (pkg === 'events') { return function (){}; }};

  ${nunjucksSource}

  const env = module.exports.configure({
    autoescape: false,
    ...JSON.parse(nunjucksConfigs),
    tags: {
      variableStart: '\${{',
      variableEnd: '}}',
    },
  });

  const compatEnv = module.exports.configure({
    autoescape: false,
    ...JSON.parse(nunjucksConfigs),
    tags: {
      variableStart: '{{',
      variableEnd: '}}',
    },
  });
  compatEnv.addFilter('jsonify', compatEnv.getFilter('dump'));

  for (const name of JSON.parse(availableTemplateFilters)) {
    env.addFilter(name, (...args) => JSON.parse(callFilter(name, args)));
  }
  for (const [name, value] of Object.entries(JSON.parse(availableTemplateGlobals))) {
    env.addGlobal(name, value);
  }
  for (const name of JSON.parse(availableTemplateCallbacks)) {
    env.addGlobal(name, (...args) => JSON.parse(callGlobal(name, args)));
  }

  let uninstallCompat = undefined;

  function render(str, values) {
    try {
      if (uninstallCompat) {
        uninstallCompat();
        uninstallCompat = undefined;
      }
      return env.renderString(str, JSON.parse(values));
    } catch (error) {
      // Make sure errors don't leak anything
      throw new Error(String(error.message));
    }
  }

  function renderCompat(str, values) {
    try {
      if (!uninstallCompat) {
        uninstallCompat = module.exports.installJinjaCompat();
      }
      return compatEnv.renderString(str, JSON.parse(values));
    } catch (error) {
      // Make sure errors don't leak anything
      throw new Error(String(error.message));
    }
  }

  return { render, renderCompat };
})();
`;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-scaffolder-node` instead.
 */
export type TemplateFilter = _TemplateFilter;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-scaffolder-node` instead.
 */
export type TemplateGlobal = _TemplateGlobal;

interface SecureTemplaterOptions {
  /* Enables jinja compatibility and the "jsonify" filter */
  cookiecutterCompat?: boolean;
  /* Extra user-provided nunjucks filters */
  templateFilters?: Record<string, TemplateFilter>;
  /* Extra user-provided nunjucks globals */
  templateGlobals?: Record<string, TemplateGlobal>;
  nunjucksConfigs?: { trimBlocks?: boolean; lstripBlocks?: boolean };
}

export type SecureTemplateRenderer = (
  template: string,
  values: unknown,
) => string;

export class SecureTemplater {
  static async loadRenderer(options: SecureTemplaterOptions = {}) {
    const {
      cookiecutterCompat,
      templateFilters = {},
      templateGlobals = {},
      nunjucksConfigs = {},
    } = options;

    const nodeVersion = getMajorNodeVersion();
    if (nodeVersion >= 20 && !isNoNodeSnapshotOptionProvided()) {
      throw new Error(
        `When using Node.js version 20 or newer, the scaffolder backend plugin requires that it be started with the --no-node-snapshot option. 
        Please make sure that you have NODE_OPTIONS=--no-node-snapshot in your environment.`,
      );
    }

    const isolate = new Isolate({ memoryLimit: 128 });
    const context = await isolate.createContext();
    const contextGlobal = context.global;

    const nunjucksSource = await fs.readFile(
      resolvePackagePath(
        '@backstage/plugin-scaffolder-backend',
        'assets/nunjucks.js.txt',
      ),
      'utf-8',
    );

    const nunjucksScript = await isolate.compileScript(
      mkScript(nunjucksSource),
    );

    await contextGlobal.set('nunjucksConfigs', JSON.stringify(nunjucksConfigs));

    const availableFilters = Object.keys(templateFilters);

    await contextGlobal.set(
      'availableTemplateFilters',
      JSON.stringify(availableFilters),
    );

    const globalCallbacks = [];
    const globalValues: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(templateGlobals)) {
      if (typeof value === 'function') {
        globalCallbacks.push(name);
      } else {
        globalValues[name] = value;
      }
    }

    await contextGlobal.set(
      'availableTemplateGlobals',
      JSON.stringify(globalValues),
    );
    await contextGlobal.set(
      'availableTemplateCallbacks',
      JSON.stringify(globalCallbacks),
    );

    await contextGlobal.set(
      'callFilter',
      (filterName: string, args: JsonValue[]) => {
        if (!Object.hasOwn(templateFilters, filterName)) {
          return '';
        }
        return JSON.stringify(templateFilters[filterName](...args));
      },
    );

    await contextGlobal.set(
      'callGlobal',
      (globalName: string, args: JsonValue[]) => {
        if (!Object.hasOwn(templateGlobals, globalName)) {
          return '';
        }
        const global = templateGlobals[globalName];
        if (typeof global !== 'function') {
          return '';
        }
        return JSON.stringify(global(...args));
      },
    );

    await nunjucksScript.run(context);

    const render: SecureTemplateRenderer = (template, values) => {
      if (!context) {
        throw new Error('SecureTemplater has not been initialized');
      }

      contextGlobal.setSync('templateStr', String(template));
      contextGlobal.setSync('templateValues', JSON.stringify(values));

      if (cookiecutterCompat) {
        return context.evalSync(`renderCompat(templateStr, templateValues)`);
      }

      return context.evalSync(`render(templateStr, templateValues)`);
    };
    return render;
  }
}
