/*
 * Copyright 2026 The Backstage Authors
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

import browserslist from 'browserslist';
import { BundlingPaths } from './paths';
import { BundlingOptions } from './types';

/**
 * Rspack targets the app's browserslist config when there is one, and picks
 * its environment by NODE_ENV, which can change during the process, for
 * example when postcss-load-config sets it in package builds. Name the
 * environment for production builds, so they always minify JavaScript and CSS
 * for the same browsers.
 */
export function resolveBrowserslistTarget(
  paths: BundlingPaths,
  options: Pick<BundlingOptions, 'isDev' | 'webpack'>,
): { target?: `browserslist:${string}` } {
  return !options.isDev &&
    !options.webpack &&
    browserslist.findConfig(paths.targetPath)
    ? { target: `browserslist:${process.env.BROWSERSLIST_ENV || 'production'}` }
    : {};
}
