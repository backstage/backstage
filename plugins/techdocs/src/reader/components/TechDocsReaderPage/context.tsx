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
import useAsync from 'react-use/lib/useAsync';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';

import { useApi } from '@backstage/core-plugin-api';
import { CompoundEntityRef } from '@backstage/catalog-model';

import { techdocsApiRef } from '../../../api';
import { TechDocsMetadata, TechDocsEntityMetadata } from '../../../types';

type TechDocsReaderPageValue = {
  path: string;
  metadata: {
    loading: boolean;
    value?: TechDocsMetadata;
    error?: Error;
    retry: () => void;
  };
  entityRef: CompoundEntityRef;
  entityMetadata: {
    loading: boolean;
    value?: TechDocsEntityMetadata;
    error?: Error;
  };
};

const TechDocsReaderPageContext = createContext<TechDocsReaderPageValue>({
  path: '',
  metadata: { loading: true, retry: () => {} },
  entityRef: { kind: '', namespace: '', name: '' },
  entityMetadata: { loading: true },
});

export const useTechDocsReaderPage = () =>
  useContext(TechDocsReaderPageContext);

export const TechDocsReaderPageProvider = ({
  path = '',
  entityRef,
  children,
}: PropsWithChildren<{
  path?: string;
  onReady?: () => void;
  entityRef: CompoundEntityRef;
}>) => {
  const techdocsApi = useApi(techdocsApiRef);

  const metadata = useAsyncRetry(async () => {
    return await techdocsApi.getTechDocsMetadata(entityRef);
  }, [entityRef, techdocsApi]);

  const entityMetadata = useAsync(async () => {
    return await techdocsApi.getEntityMetadata(entityRef);
  }, [entityRef, techdocsApi]);

  const value = {
    path,
    metadata,
    entityRef,
    entityMetadata,
  };

  return (
    <TechDocsReaderPageContext.Provider value={value}>
      {children instanceof Function
        ? children({
            entityRef,
            techdocsMetadataValue: metadata.value,
            entityMetadataValue: entityMetadata.value,
          })
        : children}
    </TechDocsReaderPageContext.Provider>
  );
};
