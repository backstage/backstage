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
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  memo,
  ReactNode,
  useEffect,
} from 'react';
import useAsync, { AsyncState } from 'react-use/esm/useAsync';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';

import {
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

import {
  AnalyticsContext,
  configApiRef,
  useApi,
} from '@backstage/core-plugin-api';

import { techdocsApiRef } from './api';
import { TechDocsEntityMetadata, TechDocsMetadata } from './types';

import { toLowercaseEntityRefMaybe } from './helpers';

const areEntityRefsEqual = (
  prevEntityRef: CompoundEntityRef,
  nextEntityRef: CompoundEntityRef,
) => {
  return (
    stringifyEntityRef(prevEntityRef) === stringifyEntityRef(nextEntityRef)
  );
};

/**
 * @public type for the value of the TechDocsReaderPageContext
 */
export type TechDocsReaderPageValue = {
  metadata: AsyncState<TechDocsMetadata>;
  entityRef: CompoundEntityRef;
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

const defaultTechDocsReaderPageValue: TechDocsReaderPageValue = {
  title: '',
  subtitle: '',
  setTitle: () => {},
  setSubtitle: () => {},
  setShadowRoot: () => {},
  metadata: { loading: true },
  entityMetadata: { loading: true },
  entityRef: { kind: '', name: '', namespace: '' },
};

const TechDocsReaderPageContext = createVersionedContext<{
  1: TechDocsReaderPageValue;
}>('techdocs-reader-page-context');

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
  entityRef: CompoundEntityRef;
  children: TechDocsReaderPageProviderRenderFunction | ReactNode;
};

/**
 * A context to store the reader page state
 * @public
 */
export const TechDocsReaderPageProvider = memo(
  (props: TechDocsReaderPageProviderProps) => {
    const { entityRef, children } = props;

    const techdocsApi = useApi(techdocsApiRef);
    const config = useApi(configApiRef);

    const entityMetadata = useAsync(async () => {
      return techdocsApi.getEntityMetadata(entityRef);
    }, [entityRef]);

    const metadata = useAsyncRetry(async () => {
      return techdocsApi.getTechDocsMetadata(entityRef);
    }, [entityRef]);

    const [title, setTitle] = useState(defaultTechDocsReaderPageValue.title);
    const [subtitle, setSubtitle] = useState(
      defaultTechDocsReaderPageValue.subtitle,
    );
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | undefined>(
      defaultTechDocsReaderPageValue.shadowRoot,
    );

    useEffect(() => {
      if (shadowRoot && !metadata.value && !metadata.loading) {
        metadata.retry();
      }
    }, [
      metadata.value,
      metadata.loading,
      shadowRoot,
      metadata.retry,
      metadata,
    ]);

    const value: TechDocsReaderPageValue = {
      metadata,
      entityRef: toLowercaseEntityRefMaybe(entityRef, config),
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
      <AnalyticsContext
        attributes={{ entityRef: stringifyEntityRef(entityRef) }}
      >
        <TechDocsReaderPageContext.Provider value={versionedValue}>
          {children instanceof Function ? children(value) : children}
        </TechDocsReaderPageContext.Provider>
      </AnalyticsContext>
    );
  },
  (prevProps, nextProps) => {
    return areEntityRefsEqual(prevProps.entityRef, nextProps.entityRef);
  },
);

/**
 * Hook used to get access to shared state between reader page components.
 * @public
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
