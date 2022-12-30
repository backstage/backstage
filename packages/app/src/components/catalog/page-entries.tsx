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

import React from 'react';
import {
  EntityLayout,
  EntitySwitch,
} from '@internal/plugin-catalog-customized';
import { Entity } from '@backstage/catalog-model';
import { EntityLayoutWrapper } from './EntityLayoutWrapper';

export interface PageEntry {
  path: string;
  title: string;
  if?: (entity: Entity) => boolean;
  route: JSX.Element;
}

export type PageEntryOption = {
  path: string;
  title: string;
  content: JSX.Element;
  if?: (entity: Entity) => boolean;
};

export function makePageEntries<
  T extends Record<string, PageEntryOption | false>,
>(
  entries: T,
): {
  [P in keyof T as T[P] extends object ? P : never]: PageEntry;
} {
  return Object.fromEntries(
    Object.entries(entries)
      .filter(([, entry]) => entry && typeof entry === 'object')
      .map(([name, entry]) => [name, entry as PageEntryOption] as const)
      .map(([name, entry]) => [
        name,
        {
          path: entry.path,
          title: entry.title,
          if: entry.if,
          route: (
            <EntityLayout.Route
              key={entry.path + entry.title}
              path={entry.path}
              title={entry.title}
              if={entry.if}
            >
              {entry.content}
            </EntityLayout.Route>
          ),
        },
      ]),
  ) as any;
}

export type PageSwitchCase = {
  if?: (entity: Entity) => boolean;
  entries: PageEntry[];
};

export function makePageSwitch(cases: PageSwitchCase[]) {
  return cases.map((switchCase, i) => ({
    ...switchCase,
    entitySwitchCase: (
      <EntitySwitch.Case key={i} if={switchCase.if}>
        <EntityLayoutWrapper>
          {switchCase.entries.map(({ route }) => route)}
        </EntityLayoutWrapper>
      </EntitySwitch.Case>
    ),
  }));
}
