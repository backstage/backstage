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

import { Dispatch, SetStateAction, useContext } from 'react';
import { AsyncState } from 'react-use/lib/useAsync';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { createVersionedContext } from '@backstage/version-bridge';

import { TechDocsEntityMetadata, TechDocsMetadata } from './types';

/**
 * @alpha type for the value of the TechDocsReaderPageContext
 */
export type TechDocsReaderPageValue = {
  metadata: AsyncState<TechDocsMetadata>;
  entityName: CompoundEntityRef;
  entityMetadata: AsyncState<TechDocsEntityMetadata>;
  shadowRoot?: ShadowRoot;
  setShadowRoot: Dispatch<SetStateAction<ShadowRoot | undefined>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  subtitle: string;
  setSubtitle: Dispatch<SetStateAction<string>>;
  /**
   * @deprecated property can be passed down directly to the `TechDocsReaderPageContent` instead.
   */
  onReady?: () => void;
};

/**
 * @alpha
 */
export const defaultTechDocsReaderPageValue: TechDocsReaderPageValue = {
  title: '',
  subtitle: '',
  setTitle: () => {},
  setSubtitle: () => {},
  setShadowRoot: () => {},
  metadata: { loading: true },
  entityMetadata: { loading: true },
  entityName: { kind: '', name: '', namespace: '' },
};

/**
 * @alpha
 */
export const TechDocsReaderPageContext = createVersionedContext<{
  1: TechDocsReaderPageValue;
}>('techdocs-reader-page-context');
/**
 * Hook used to get access to shared state between reader page components.
 * @alpha
 */
export const useTechDocsReaderPage = () => {
  const versionedContext = useContext(TechDocsReaderPageContext);

  if (versionedContext === undefined) {
    return defaultTechDocsReaderPageValue;
  }

  const context = versionedContext.atVersion(1);
  if (context === undefined) {
    throw new Error('No context found for version 1.');
  }

  return context;
};
