/*
 * Copyright 2024 The Backstage Authors
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

import { AppConfig } from '@backstage/config';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export class ConfigInjectingHtmlWebpackPlugin extends HtmlWebpackPlugin {
  readonly name = 'ConfigInjectingHtmlWebpackPlugin';
  readonly #getFrontendAppConfigs: () => AppConfig[];

  constructor(
    options: HtmlWebpackPlugin.Options,
    getFrontendAppConfigs: () => AppConfig[],
  ) {
    super(options);
    this.#getFrontendAppConfigs = getFrontendAppConfigs;
  }

  apply: HtmlWebpackPlugin['apply'] = compiler => {
    super.apply(compiler);

    compiler.hooks.compilation.tap(this.name, compilation => {
      const hooks = HtmlWebpackPlugin.getCompilationHooks(compilation);
      hooks.alterAssetTagGroups.tap(this.name, ctx => {
        if (ctx.plugin !== this) {
          return ctx;
        }
        return {
          ...ctx,
          headTags: [
            ...ctx.headTags,
            HtmlWebpackPlugin.createHtmlTagObject(
              'script',
              { type: 'backstage.io/config' },
              `\n${JSON.stringify(this.#getFrontendAppConfigs(), null, 2)}\n`,
            ),
          ],
        };
      });
    });
  };
}
