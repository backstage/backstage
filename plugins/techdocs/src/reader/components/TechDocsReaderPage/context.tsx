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
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { useApi, useApp } from '@backstage/core-plugin-api';

import { techdocsApiRef } from '../../../api';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../../types';

type TechDocsReaderPageValue = {
  path: string;
  entityRef: CompoundEntityRef;
  entityMetadataValue?: TechDocsEntityMetadata | undefined;
  techdocsMetadataValue?: TechDocsMetadata | undefined;
};

const TechDocsReaderPageContext = createContext<TechDocsReaderPageValue>({
  path: '',
  entityRef: { kind: '', namespace: '', name: '' },
});

export const TechDocsReaderPageProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const { kind, name, namespace, '*': path } = useParams();
  const techdocsApi = useApi(techdocsApiRef);
  const { NotFoundErrorPage } = useApp().getComponents();

  const entityRef = useMemo(
    () => ({ kind, name, namespace }),
    [kind, name, namespace],
  );

  const { value: techdocsMetadataValue } = useAsync(async () => {
    return await techdocsApi.getTechDocsMetadata(entityRef);
  }, [entityRef, techdocsApi]);

  const { value: entityMetadataValue, error: entityMetadataError } =
    useAsync(async () => {
      return await techdocsApi.getEntityMetadata(entityRef);
    }, [entityRef, techdocsApi]);

  const value = {
    path,
    entityRef,
    entityMetadataValue,
    techdocsMetadataValue,
  };

  if (entityMetadataError) {
    return <NotFoundErrorPage />;
  }

  return (
    <TechDocsReaderPageContext.Provider value={value}>
      {children instanceof Function ? children(value) : children}
    </TechDocsReaderPageContext.Provider>
  );
};

export const useTechDocsReaderPage = () =>
  useContext(TechDocsReaderPageContext);
