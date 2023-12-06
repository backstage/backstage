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

import { createSpecializedApp } from '@backstage/frontend-app-api';
import {
  ExtensionDefinition,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import { MockConfigApi } from '@backstage/test-utils';
import { JsonArray, JsonObject, JsonValue } from '@backstage/types';
import { RenderResult, render } from '@testing-library/react';

/** @public */
export class ExtensionTester {
  /** @internal */
  static forSubject<TConfig>(
    subject: ExtensionDefinition<TConfig>,
    options?: { config?: TConfig },
  ): ExtensionTester {
    const tester = new ExtensionTester();
    tester.add(subject, options);
    return tester;
  }

  readonly #extensions = new Array<{
    id: string;
    extension: ExtensionDefinition<any>;
    config?: JsonValue;
  }>();

  add<TConfig>(
    extension: ExtensionDefinition<TConfig>,
    options?: { config?: TConfig },
  ): ExtensionTester {
    const withNamespace = {
      ...extension,
      name: !extension.namespace && !extension.name ? 'test' : extension.name,
    };
    this.#extensions.push({
      id: resolveExtensionDefinition(withNamespace).id,
      extension: withNamespace,
      config: options?.config as JsonValue,
    });

    return this;
  }

  render(options?: { config?: JsonObject }): RenderResult {
    const { config = {} } = options ?? {};

    const [subject, ...rest] = this.#extensions;
    if (!subject) {
      throw new Error(
        'No subject found. At least one extension should be added to the tester.',
      );
    }

    const extensionsConfig: JsonArray = [
      ...rest.map(entry => ({
        [entry.id]: {
          config: entry.config,
        },
      })),
      {
        [subject.id]: {
          attachTo: { id: 'core/router', input: 'children' },
          config: subject.config,
          disabled: false,
        },
      },
      {
        'core/layout': false,
      },
      {
        'core/nav': false,
      },
      {
        'core/routes': false,
      },
    ];

    const finalConfig = {
      ...config,
      app: {
        ...(typeof config.app === 'object' ? config.app : undefined),
        extensions: extensionsConfig,
      },
    };

    const app = createSpecializedApp({
      features: [
        createExtensionOverrides({
          extensions: this.#extensions.map(entry => entry.extension),
        }),
      ],
      config: new MockConfigApi(finalConfig),
    });

    return render(app.createRoot());
  }
}

/** @public */
export function createExtensionTester<TConfig>(
  subject: ExtensionDefinition<TConfig>,
  options?: { config?: TConfig },
): ExtensionTester {
  return ExtensionTester.forSubject(subject, options);
}
