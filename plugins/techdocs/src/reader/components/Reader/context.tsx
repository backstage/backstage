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
  PropsWithChildren,
  ComponentType,
  createContext,
  useContext,
} from 'react';
import { useParams } from 'react-router-dom';

import { CompoundEntityRef } from '@backstage/catalog-model';

import { useReaderState } from '../useReaderState';

type TechDocsReaderValue = ReturnType<typeof useReaderState>;

const TechDocsReaderContext = createContext<TechDocsReaderValue>(
  {} as TechDocsReaderValue,
);

export const TechDocsReaderProvider = ({
  children,
  entityRef,
}: PropsWithChildren<{ entityRef: CompoundEntityRef }>) => {
  const { '*': path } = useParams();
  const { kind, namespace, name } = entityRef;
  const value = useReaderState(kind, namespace, name, path);
  return (
    <TechDocsReaderContext.Provider value={value}>
      {children}
    </TechDocsReaderContext.Provider>
  );
};

/**
 * Note: this HOC is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this HOC will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export const withTechDocsReaderProvider =
  <T extends {}>(Component: ComponentType<T>, entityRef: CompoundEntityRef) =>
  (props: T) =>
    (
      <TechDocsReaderProvider entityRef={entityRef}>
        <Component {...props} />
      </TechDocsReaderProvider>
    );

/**
 * Note: this hook is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this hook will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export const useTechDocsReader = () => useContext(TechDocsReaderContext);
