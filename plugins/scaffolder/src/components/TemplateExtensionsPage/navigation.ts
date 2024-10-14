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
import { ListTemplateExtensionsResponse } from '@backstage/plugin-scaffolder-react';
import { keys } from 'lodash';

const kinds = ['filter', 'function', 'value'] as const;

export type ExtensionKind = (typeof kinds)[number];

export type Extension = {
  kind: ExtensionKind;
  name: string;
};

export const listExtensions = (
  data: Partial<Pick<ListTemplateExtensionsResponse, 'filters'>> &
    Partial<{ globals: Partial<ListTemplateExtensionsResponse['globals']> }>,
): Extension[] => {
  const exts = (
    kind: ExtensionKind,
    record: Record<string, any> | undefined,
  ): Extension[] =>
    record ? keys(record).map((name: string) => ({ kind, name })) : [];

  return [
    ...exts('filter', data.filters),
    ...exts('function', data.globals?.functions),
    ...exts('value', data.globals?.values),
  ];
};

export const renderLink = (e: Extension) => `${e.kind}_${e.name}`;

export const parseLink = (link: string): Extension => {
  const [k, name] = link.split('_', 2);
  const kind = k as ExtensionKind;
  if (kinds.includes(kind)) {
    return {
      kind,
      name,
    };
  }
  throw Error(link);
};
