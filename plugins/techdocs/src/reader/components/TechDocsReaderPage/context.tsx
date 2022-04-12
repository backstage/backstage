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

import React, { ReactNode, memo, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';

import { useApi } from '@backstage/core-plugin-api';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  TechDocsReaderPageValue,
  defaultTechDocsReaderPageValue,
  TechDocsReaderPageContext,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';
import { createVersionedValueMap } from '@backstage/version-bridge';

import { techdocsApiRef } from '../../../api';

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

/**
 * render function for {@link TechDocsReaderPageProvider}
 *
 * @public
 */
export type TechDocsReaderPageProviderRenderFunction = (
  value: TechDocsReaderPageValue,
) => JSX.Element;

/**
 * Props for {@link TechDocsReaderPageProvider}
 *
 * @public
 */
export type TechDocsReaderPageProviderProps = {
  entityName: CompoundEntityRef;
  children: TechDocsReaderPageProviderRenderFunction | ReactNode;
};

/**
 * A context to store the reader page state
 * @public
 */
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
    const versionedValue = createVersionedValueMap({ 1: value });

    return (
      <TechDocsReaderPageContext.Provider value={versionedValue}>
        {children instanceof Function ? children(value) : children}
      </TechDocsReaderPageContext.Provider>
    );
  },
  (prevProps, nextProps) => {
    return areEntityNamesEqual(prevProps.entityName, nextProps.entityName);
  },
);

/**
 * Hook for sub-components to retrieve Entity Metadata for the current TechDocs
 * site.
 * @internal
 */
export const useEntityMetadata = () => {
  const { entityMetadata } = useTechDocsReaderPage();
  return entityMetadata;
};

/**
 * Hook for sub-components to retrieve TechDocs Metadata for the current
 * TechDocs site.
 * @internal
 */
export const useTechDocsMetadata = () => {
  const { metadata } = useTechDocsReaderPage();
  return metadata;
};
