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

export const pageNames = ['apis', 'api-graph', 'plugins', 'routes'] as const;
export type PageName = typeof pageNames[number];

export interface Page {
  name: PageName;
  title: string;
  subtitle: string;
}

export const pages: Array<Page> = [
  {
    name: 'apis',
    title: 'APIs',
    subtitle: 'All registered APIs',
  },
  {
    name: 'api-graph',
    title: 'API graph',
    subtitle: 'Dependency graph of APIs (and the plugins providing them)',
  },
  {
    name: 'plugins',
    title: 'Plugins',
    subtitle: '',
  },
  {
    name: 'routes',
    title: 'Routes',
    subtitle: '',
  },
];

export const pageMap = Object.fromEntries(
  pages.map(page => [page.name, page]),
) as Record<PageName, Page>;
