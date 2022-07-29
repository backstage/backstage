/*
 * Copyright 2020 The Backstage Authors
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
  ComponentType,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';
import { useTechDocsReaderPage } from '../TechDocsReaderPageContext';

import {
  useReaderPageContentState,
  TechDocsReaderPageContentState,
} from './useReaderPageContentState';

const TechDocsReaderPageContentContext =
  createContext<TechDocsReaderPageContentState>(
    {} as TechDocsReaderPageContentState,
  );

/**
 * Returns the context for {@link TechDocsReaderPageContentProvider}.
 * @public
 */
export const useTechDocsReaderPageContent = () => {
  return useContext(TechDocsReaderPageContentContext);
};

/**
 * @public Render function for {@link TechDocsReaderPageContentProvider}
 */
export type TechDocsReaderPageContentProviderRenderFunction = (
  value: TechDocsReaderPageContentState,
) => JSX.Element;

/**
 * @public Props for {@link TechDocsReaderPageContentProvider}
 */
export type TechDocsReaderPageContentProviderProps = {
  children: TechDocsReaderPageContentProviderRenderFunction | ReactNode;
};

/**
 * Provides shared building process state to the reader page components.
 *
 * @public
 */
export const TechDocsReaderPageContentProvider = ({
  children,
}: TechDocsReaderPageContentProviderProps) => {
  const { '*': path = '' } = useParams();
  const { entityRef } = useTechDocsReaderPage();
  const { kind, namespace, name } = entityRef;
  const value = useReaderPageContentState(kind, namespace, name, path);

  return (
    <TechDocsReaderPageContentContext.Provider value={value}>
      {children instanceof Function ? children(value) : children}
    </TechDocsReaderPageContentContext.Provider>
  );
};

/**
 * A HOC for {@link TechDocsReaderPageContentProvider}.
 * @param Component - The component type to wrap with {@link TechDocsReaderPageContentProvider}.
 * @public
 */
export const withTechDocsReaderPageContentProvider =
  <T extends {}>(Component: ComponentType<T>) =>
  (props: T) =>
    (
      <TechDocsReaderPageContentProvider>
        <Component {...props} />
      </TechDocsReaderPageContentProvider>
    );
