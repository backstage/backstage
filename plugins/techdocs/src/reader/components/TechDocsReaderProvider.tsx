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
import { useTechDocsReaderPage } from '@backstage/plugin-techdocs-react';

import { useReaderState, ReaderState } from './useReaderState';

const TechDocsReaderContext = createContext<ReaderState>({} as ReaderState);

export const useTechDocsReader = () => useContext(TechDocsReaderContext);

/**
 * @public Render function for {@link TechDocsReaderProvider}
 */
export type TechDocsReaderProviderRenderFunction = (
  value: ReaderState,
) => JSX.Element;

/**
 * @public Props for {@link TechDocsReaderProvider}
 */
export type TechDocsReaderProviderProps = {
  children: TechDocsReaderProviderRenderFunction | ReactNode;
};

/**
 * Provides shared building process state to the reader page components.
 *
 * @public
 */
export const TechDocsReaderProvider = (props: TechDocsReaderProviderProps) => {
  const { children } = props;

  const { '*': path = '' } = useParams();
  const { entityRef } = useTechDocsReaderPage();
  const { kind, namespace, name } = entityRef;
  const value = useReaderState(kind, namespace, name, path);

  return (
    <TechDocsReaderContext.Provider value={value}>
      {children instanceof Function ? children(value) : children}
    </TechDocsReaderContext.Provider>
  );
};

export const withTechDocsReaderProvider =
  <T extends {}>(Component: ComponentType<T>) =>
  (props: T) => (
    <TechDocsReaderProvider>
      <Component {...props} />
    </TechDocsReaderProvider>
  );
