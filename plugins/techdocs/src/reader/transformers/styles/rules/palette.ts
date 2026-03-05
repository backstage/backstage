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

import { RuleOptions } from './types';
import { Theme } from '@material-ui/core/styles';

const themeHashes: Record<Theme['palette']['type'], ReadonlyArray<string>> = {
  dark: ['#only-light', '#gh-light-mode-only'],
  light: ['#only-dark', '#gh-dark-mode-only'],
};

export default ({ theme }: RuleOptions) => `
/*==================  Palette  ==================*/
/*
  When color palette toggle is enabled in material theme for Mkdocs, there is a possibility to show conditionally 
  images by adding #only-dark or #only-light to resource hash. Backstage doesn't use mkdocs color palette mechanism,
  so there is a need to add css rules from palette*.css manually.
*/

${themeHashes[theme.palette.type]
  .map(hash => `img[src$="${hash}"]`)
  .join(', ')} {
  display: none;
}
`;
