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

/**
 * {@link https://mui.com | material-ui} theme for use with Backstage
 *
 * @packageDocumentation
 */

export * from './compat';
export * from './base';
export * from './v4';
export * from './v5';

import {
  createV4Theme,
  createV4ThemeOptions,
  createV4ThemeOverrides,
} from './v4';
import type { SimpleV4ThemeOptions } from './v4';

/**
 * @public
 * @deprecated Use {@link createV4Theme} instead.
 */
export const createTheme = createV4Theme;
/**
 * @public
 * @deprecated Use {@link createV4ThemeOptions} instead.
 */
export const createThemeOptions = createV4ThemeOptions;
/**
 * @public
 * @deprecated Use {@link createV4ThemeOverrides} instead.
 */
export const createThemeOverrides = createV4ThemeOverrides;
/**
 * @public
 * @deprecated Use {@link SimpleV4ThemeOptions} instead.
 */
export type SimpleThemeOptions = SimpleV4ThemeOptions;
