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

import { RootHttpRouterService } from '@backstage/backend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  DefaultRootHttpRouter as _DefaultRootHttpRouter,
  DefaultRootHttpRouterOptions as _DefaultRootHttpRouterOptions,
} from '../../../../../backend-defaults/src/entrypoints/rootHttpRouter/DefaultRootHttpRouter';
import { Handler } from 'express';

/**
 * Options for the {@link DefaultRootHttpRouter} class.
 *
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export type DefaultRootHttpRouterOptions = _DefaultRootHttpRouterOptions;

/**
 * The default implementation of the {@link @backstage/backend-plugin-api#RootHttpRouterService} interface for
 * {@link @backstage/backend-plugin-api#coreServices.rootHttpRouter}.
 *
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export class DefaultRootHttpRouter implements RootHttpRouterService {
  static create(options?: DefaultRootHttpRouterOptions) {
    return new DefaultRootHttpRouter(_DefaultRootHttpRouter.create(options));
  }

  private constructor(private readonly impl: RootHttpRouterService) {}

  use(path: string, handler: Handler) {
    this.impl.use(path, handler);
  }

  handler(): Handler {
    return (this.impl as any).handler();
  }
}
