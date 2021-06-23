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
import MDX from '@mdx-js/runtime';
import React, { ReactNode } from 'react';

const nestNavigation = (baseUrl: string, nav: object, level = 0): ReactNode => {
  if (Array.isArray(nav)) {
    return nav.map(item => nestNavigation(baseUrl, item, level + 1)).join('\n');
  }

  const [key, value] = Object.entries(nav)[0];
  if (Array.isArray(value)) {
    return `${'  '.repeat(level)}- ${key}\n${nestNavigation(
      baseUrl,
      value,
      level + 1,
    )}`;
  }
  return `${'  '.repeat(level)}- [${key}](${baseUrl}${value.split('.')[0]})`;
};

export default ({ toc, baseUrl }: { baseUrl: string; toc: object }) => (
  <MDX>{nestNavigation(baseUrl, toc)}</MDX>
);
