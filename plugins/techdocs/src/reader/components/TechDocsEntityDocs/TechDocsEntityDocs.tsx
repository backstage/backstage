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

import React, { PropsWithChildren, createContext, useContext } from 'react';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';

import { useTechDocsReaderPage } from '../TechDocsReaderPage';

import { techdocsStorageApiRef } from '../../../api';

export type EntityDocs = {
  loading: boolean;
  value?: string;
  error?: Error;
  retry: () => void;
};

const EntityDocsContext = createContext<EntityDocs>({
  loading: true,
  retry: () => {},
});

type EntityDocsProviderProps = PropsWithChildren<{
  entityRef: CompoundEntityRef;
}>;

export const EntityDocsProvider = ({
  entityRef,
  children,
}: EntityDocsProviderProps) => {
  const { path } = useTechDocsReaderPage();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  const value = useAsyncRetry(async () => {
    return await techdocsStorageApi.getEntityDocs(entityRef, path);
  }, [path, entityRef]);

  return (
    <EntityDocsContext.Provider value={value}>
      {children}
    </EntityDocsContext.Provider>
  );
};

export const useEntityDocs = () => useContext(EntityDocsContext);
