/*
 * Copyright 2020 Spotify AB
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

import { createTheme } from 'baseTheme';

export const lightTheme = createTheme('light', {
  TEXT_COLOR: '#000',
  PAGE_BACKGROUND: '#F8F8F8',
  DEFAULT_PAGE_THEME_COLOR: '#7C3699',
  DEFAULT_PAGE_THEME_LIGHT_COLOR: '#ECDBF2',
  SIDEBAR_BACKGROUND_COLOR: '#171717',
  ERROR_BACKGROUND_COLOR: '#FFEBEE',
  ERROR_TEXT_COLOR: '#CA001B',
  INFO_TEXT_COLOR: '#004e8a',
  LINK_TEXT: '#0A6EBE',
  LINK_TEXT_HOVER: '#2196F3',
  NAMED_WHITE: '#FEFEFE',
  STATUS_OK: '#1db855',
  STATUS_WARNING: '#f49b20',
  STATUS_ERROR: '#CA001B',
});

export const darkTheme = createTheme('dark', {
  TEXT_COLOR: '#fff',
  PAGE_BACKGROUND: '#282828',
  DEFAULT_PAGE_THEME_COLOR: '#7C3699',
  DEFAULT_PAGE_THEME_LIGHT_COLOR: '#ECDBF2',
  SIDEBAR_BACKGROUND_COLOR: '#424242',
  ERROR_BACKGROUND_COLOR: '#FFEBEE',
  ERROR_TEXT_COLOR: '#CA001B',
  INFO_TEXT_COLOR: '#004e8a',
  LINK_TEXT: '#0A6EBE',
  LINK_TEXT_HOVER: '#2196F3',
  NAMED_WHITE: '#FEFEFE',
  STATUS_OK: '#1db855',
  STATUS_WARNING: '#f49b20',
  STATUS_ERROR: '#CA001B',
});
