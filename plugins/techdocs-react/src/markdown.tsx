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

import { ComponentType, ReactNode, useContext } from 'react';
import { createApiRef } from '@backstage/core-plugin-api';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  TechDocsHeading,
  TechDocsMarkdownNode,
  TechDocsMarkdownTransform,
  TechDocsNavigation,
} from '@backstage/plugin-techdocs-common/alpha';

/** @alpha */
export type TechDocsDocument = {
  entityRef: CompoundEntityRef;
  path: string;
  title: string;
  headings: TechDocsHeading[];
  navigation: TechDocsNavigation[];
  sourceUrl?: string;
};
/** Selection offsets refer to Markdown source lines when available. @alpha */
export type TechDocsSelection = {
  text: string;
  startLine?: number;
  endLine?: number;
};
/** @alpha */
export type TechDocsMarkdownComponentProps = {
  node: TechDocsMarkdownNode;
  children?: ReactNode;
  defaultComponent: ReactNode;
};
/** @alpha */
export type TechDocsCodeBlockProps = { code: string; language: string };
/** @alpha */
export type TechDocsMarkdownAddon = {
  slots?: Array<{
    location:
      | 'toolbar'
      | 'settings'
      | 'before-content'
      | 'after-content'
      | 'navigation'
      | 'toc';
    component: ComponentType;
  }>;
  components?: Partial<
    Record<
      'a' | 'img' | 'pre' | 'table' | 'code',
      ComponentType<TechDocsMarkdownComponentProps>
    >
  >;
  codeBlocks?: Array<{
    language: string;
    loader: () => Promise<{ default: ComponentType<TechDocsCodeBlockProps> }>;
  }>;
  /** Register the same transforms in source generation if they affect search or navigation. */
  transforms?: TechDocsMarkdownTransform[];
};
/** @alpha */
export const techdocsMarkdownAddonsApiRef = createApiRef<{
  getAddons(): TechDocsMarkdownAddon[];
}>({ id: 'plugin.techdocs.markdown-addons' });
const addonDataRef = createExtensionDataRef<TechDocsMarkdownAddon>().with({
  id: 'techdocs.markdown-addon',
});
/** Contributes trusted application code to the source reader. Documents cannot install addons. @alpha */
export const MarkdownAddonBlueprint = createExtensionBlueprint({
  kind: 'markdown-addon',
  attachTo: { id: 'api:techdocs/markdown-addons', input: 'addons' },
  output: [addonDataRef],
  factory: (params: TechDocsMarkdownAddon) => [addonDataRef(params)],
  dataRefs: { addon: addonDataRef },
});
const context = createVersionedContext<{
  1: { document: TechDocsDocument; selection: TechDocsSelection };
}>('techdocs-markdown-document');
/** Provides structured reader data to trusted Markdown addons. @alpha */
export function TechDocsDocumentProvider(props: {
  document: TechDocsDocument;
  selection: TechDocsSelection;
  children: ReactNode;
}) {
  return (
    <context.Provider
      value={createVersionedValueMap({
        1: { document: props.document, selection: props.selection },
      })}
    >
      {props.children}
    </context.Provider>
  );
}
/** @alpha */
export function useTechDocsDocument(): TechDocsDocument {
  const value = useContext(context)?.atVersion(1);
  if (!value)
    throw new Error(
      'useTechDocsDocument must be used inside the Markdown reader',
    );
  return value.document;
}
/** @alpha */
export function useTechDocsSelection(): TechDocsSelection {
  const value = useContext(context)?.atVersion(1);
  if (!value)
    throw new Error(
      'useTechDocsSelection must be used inside the Markdown reader',
    );
  return value.selection;
}
