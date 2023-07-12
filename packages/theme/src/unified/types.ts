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

import { Theme as Mui4Theme } from '@material-ui/core/styles';
import { Theme as Mui5Theme } from '@mui/material/styles';

/**
 * Supported Material UI Versions
 *
 * Currently: 'v4' and 'v5'.
 *
 * @public
 */
export type SupportedVersions = 'v4' | 'v5';

/**
 * Supported Material UI Theme Types for `SupportedVersions`
 *
 * @public
 */
export type SupportedThemes = Mui4Theme | Mui5Theme;

/**
 * A container of one theme for multiple different Material UI versions.
 *
 * Currently known keys are 'v4' and 'v5'.
 *
 * @public
 */
export interface UnifiedTheme {
  getTheme(version: SupportedVersions): SupportedThemes | undefined;
}
