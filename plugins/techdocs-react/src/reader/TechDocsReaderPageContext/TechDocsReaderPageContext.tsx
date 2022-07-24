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
} from 'react';
import useAsync, { AsyncState } from 'react-use/lib/useAsync';

import {
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useMkDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs-react';

import { techdocsApiRef } from '../../api';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../types';

import { toLowercaseEntityRefMaybe } from '../../helpers';

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
  /**
   * @deprecated Was extracted to `@backstage/plugin-tecgdocs-mkdocs-react` package.
   * @remarks
   * Use `useMkDocsReaderPage` as in the example below to get `shadowRoot`.
   * @example
   * ```
   * import { useMkDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs-react';
   * const { shadowRoot } = useMkDocsReaderPage();
   * ```
   */
  shadowRoot?: ShadowRoot;
  /**
   * @deprecated Was extracted to `@backstage/plugin-tecgdocs-mkdocs-react` package.
   * @remarks
   * Use `useMkDocsReaderPage` as in the example below to set `shadowRoot`.
   * @example
   * ```
   * import { useMkDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs-react';
   * const { setShadowRoot } = useMkDocsReaderPage();
   * ```
   */
  setShadowRoot: Dispatch<SetStateAction<ShadowRoot | undefined>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  subtitle: string;
  setSubtitle: Dispatch<SetStateAction<string>>;
  ready: boolean;
  setReady: Dispatch<SetStateAction<boolean>>;
  /**
   * @deprecated use `setReady` instead.
   */
  onReady?: () => void;
};

const defaultTechDocsReaderPageValue: TechDocsReaderPageValue = {
  ready: false,
  title: '',
  subtitle: '',
  setReady: () => {},
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
  ({ entityRef, children }: TechDocsReaderPageProviderProps) => {
    const techdocsApi = useApi(techdocsApiRef);
    const config = useApi(configApiRef);

    const metadata = useAsync(async () => {
      return techdocsApi.getTechDocsMetadata(entityRef);
    }, [entityRef]);

    const entityMetadata = useAsync(async () => {
      return techdocsApi.getEntityMetadata(entityRef);
    }, [entityRef]);

    const { shadowRoot, setShadowRoot } = useMkDocsReaderPage();
    // Metadata is undefined when documentation has never been built before
    // So, this "ready" state exists to re-request metadata after first build.
    // Maybe it could be replaced by a useAsyncRetry function in the future...
    const [ready, setReady] = useState(defaultTechDocsReaderPageValue.ready);
    const [title, setTitle] = useState(defaultTechDocsReaderPageValue.title);
    const [subtitle, setSubtitle] = useState(
      defaultTechDocsReaderPageValue.subtitle,
    );

    const value = {
      metadata,
      entityRef: toLowercaseEntityRefMaybe(entityRef, config),
      entityMetadata,
      title,
      setTitle,
      subtitle,
      setSubtitle,
      ready,
      setReady,
      shadowRoot,
      setShadowRoot,
    };
    const versionedValue = createVersionedValueMap({ 1: value });

    return (
      <TechDocsReaderPageContext.Provider value={versionedValue}>
        {children instanceof Function ? children(value) : children}
      </TechDocsReaderPageContext.Provider>
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
