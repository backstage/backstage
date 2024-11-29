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

export interface Codemod {
  name: string;
  description: string;
}

export const codemods: Codemod[] = [
  {
    name: 'core-imports',
    description:
      'Updates @backstage/core imports to use @backstage/core-* imports instead.',
  },
  {
    name: 'extension-names',
    description:
      'Adds a "name" property to all core extensions provided by plugins.',
  },
];
