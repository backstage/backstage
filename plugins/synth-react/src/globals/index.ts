/*
 * Copyright 2022 The Backstage Authors
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
import type { PlatformScript } from 'platformscript';
import * as ps from 'platformscript';
import { Component } from './Component';
import { Fragment } from './Fragment';

type ModuleResolvers = Record<string, () => Promise<Record<string, unknown>>>;

function createModuleResolver(resolvers: ModuleResolvers) {
  return ps.fn(function* ({ arg, env }) {
    const $arg = yield* env.eval(arg);

    if ($arg.type !== 'string') {
      throw new TypeError(`Backstage.resolve expects string as an argument`);
    }

    if (!($arg.value in resolvers)) {
      throw new Error(`Unknown module: ${$arg.value}`);
    }

    const jsMod: Record<string, unknown> = yield {
      type: 'action',
      *operation(resolve, reject) {
        resolvers[$arg.value]().then(resolve, reject);
        yield {
          type: 'suspend',
        };
      },
    };

    return ps.external(jsMod, ([key]) => ps.external(jsMod[key]));
  });
}

export function globals(interpreter: PlatformScript) {
  return ps.map({
    Backstage: ps.map({
      '<>': Fragment,
      Component: Component,
      resolve: createModuleResolver({
        '@material-ui/core/Card': () => import('@material-ui/core/Card'),
        '@material-ui/core/Typography': () =>
          import('@material-ui/core/Typography'),
      }),
    }),
  });
}
