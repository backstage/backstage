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

import { CompoundEntityRef } from '@backstage/catalog-model';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';
import { AsyncState } from 'react-use/lib/useAsync';
import {
  TechDocsAddonAsyncMetadata,
  TechDocsEntityMetadata,
  TechDocsMetadata,
} from './types';

type PropsWithAsyncMetadata<TMetadata> = PropsWithChildren<{
  asyncValue: AsyncState<TMetadata>;
}>;
type PropsWithEntityName = PropsWithChildren<{ entityName: CompoundEntityRef }>;

const initialContextValue = {
  loading: true,
  error: undefined,
  value: undefined,
};

const TechDocsMetadataContext =
  createContext<TechDocsAddonAsyncMetadata<TechDocsMetadata>>(
    initialContextValue,
  );

export const TechDocsMetadataProvider = ({
  asyncValue,
  children,
}: PropsWithAsyncMetadata<TechDocsMetadata>) => {
  return (
    <TechDocsMetadataContext.Provider value={asyncValue}>
      {children}
    </TechDocsMetadataContext.Provider>
  );
};

/**
 * Hook for use within TechDocs addons to retrieve TechDocs Metadata for the
 * current TechDocs site.
 * @public
 */
export const useTechDocsMetadata = () => {
  return useContext(TechDocsMetadataContext);
};

const TechDocsEntityContext =
  createContext<TechDocsAddonAsyncMetadata<TechDocsEntityMetadata>>(
    initialContextValue,
  );

export const TechDocsEntityProvider = ({
  asyncValue,
  children,
}: PropsWithAsyncMetadata<TechDocsEntityMetadata>) => {
  return (
    <TechDocsEntityContext.Provider value={asyncValue}>
      {children}
    </TechDocsEntityContext.Provider>
  );
};

/**
 * Hook for use within TechDocs addons to retrieve Entity Metadata for the
 * current TechDocs site.
 * @public
 */
export const useEntityMetadata = () => {
  return useContext(TechDocsEntityContext);
};

export type TechDocsReaderPageValue = {
  entityName: CompoundEntityRef;
  shadowRoot?: ShadowRoot;
  setShadowRoot: Dispatch<SetStateAction<ShadowRoot | undefined>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  subtitle: string;
  setSubtitle: Dispatch<SetStateAction<string>>;
};

export const defaultTechDocsReaderPageValue: TechDocsReaderPageValue = {
  title: '',
  setTitle: () => {},
  subtitle: '',
  setSubtitle: () => {},
  setShadowRoot: () => {},
  entityName: { kind: '', name: '', namespace: '' },
};

export const TechDocsReaderPageContext = createContext<TechDocsReaderPageValue>(
  defaultTechDocsReaderPageValue,
);

export const useTechDocsReaderPage = () => {
  return useContext(TechDocsReaderPageContext);
};

export const TechDocsReaderPageProvider = ({
  entityName,
  children,
}: PropsWithEntityName) => {
  const [title, setTitle] = useState(defaultTechDocsReaderPageValue.title);
  const [subtitle, setSubtitle] = useState(
    defaultTechDocsReaderPageValue.subtitle,
  );
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | undefined>(
    defaultTechDocsReaderPageValue.shadowRoot,
  );

  const value = {
    entityName,
    shadowRoot,
    setShadowRoot,
    title,
    setTitle,
    subtitle,
    setSubtitle,
  };

  return (
    <TechDocsReaderPageContext.Provider value={value}>
      {children}
    </TechDocsReaderPageContext.Provider>
  );
};
