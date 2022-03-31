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

import React, {
  ReactNode,
  memo,
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import useAsync, { AsyncState } from 'react-use/lib/useAsync';

import { useApi } from '@backstage/core-plugin-api';
import { CompoundEntityRef } from '@backstage/catalog-model';

import { techdocsApiRef } from '../../../api';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../../types';

const areEntityNamesEqual = (
  prevEntityName: CompoundEntityRef,
  nextEntityName: CompoundEntityRef,
) => {
  if (prevEntityName.kind !== nextEntityName.kind) {
    return false;
  }
  if (prevEntityName.name !== nextEntityName.name) {
    return false;
  }
  if (prevEntityName.namespace !== nextEntityName.namespace) {
    return false;
  }
  return true;
};

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
};

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

export const TechDocsReaderPageContext = createContext<TechDocsReaderPageValue>(
  defaultTechDocsReaderPageValue,
);

export const useTechDocsReaderPage = () => {
  return useContext(TechDocsReaderPageContext);
};

type TechDocsReaderPageProviderRenderFunction = (
  value: TechDocsReaderPageValue,
) => JSX.Element;

type TechDocsReaderPageProviderProps = {
  entityName: CompoundEntityRef;
  children: TechDocsReaderPageProviderRenderFunction | ReactNode;
};

export const TechDocsReaderPageProvider = memo(
  ({ entityName, children }: TechDocsReaderPageProviderProps) => {
    const techdocsApi = useApi(techdocsApiRef);

    const metadata = useAsync(async () => {
      return techdocsApi.getTechDocsMetadata(entityName);
    }, [entityName]);

    const entityMetadata = useAsync(async () => {
      return techdocsApi.getEntityMetadata(entityName);
    }, [entityName]);

    const [title, setTitle] = useState(defaultTechDocsReaderPageValue.title);
    const [subtitle, setSubtitle] = useState(
      defaultTechDocsReaderPageValue.subtitle,
    );
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | undefined>(
      defaultTechDocsReaderPageValue.shadowRoot,
    );

    const value = {
      metadata,
      entityName,
      entityMetadata,
      shadowRoot,
      setShadowRoot,
      title,
      setTitle,
      subtitle,
      setSubtitle,
    };

    return (
      <TechDocsReaderPageContext.Provider value={value}>
        {children instanceof Function ? children(value) : children}
      </TechDocsReaderPageContext.Provider>
    );
  },
  (prevProps, nextProps) => {
    return areEntityNamesEqual(prevProps.entityName, nextProps.entityName);
  },
);

/**
 * Hook for use within TechDocs addons to retrieve Entity Metadata for the
 * current TechDocs site.
 * @public
 */
export const useEntityMetadata = () => {
  const { entityMetadata } = useTechDocsReaderPage();
  return entityMetadata;
};

/**
 * Hook for use within TechDocs addons to retrieve TechDocs Metadata for the
 * current TechDocs site.
 * @public
 */
export const useTechDocsMetadata = () => {
  const { metadata } = useTechDocsReaderPage();
  return metadata;
};
