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

import React, { ReactNode, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { CompoundEntityRef } from '@backstage/catalog-model';

import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';

import { TechDocsReaderPageRenderFunction } from '../../../types';

import {
  TechDocsEntityProvider,
  TechDocsMetadataProvider,
  TechDocsReaderPageProvider,
} from './context';

export type TechDocsReaderLayoutProps = {
  hideHeader?: boolean;
};

export const TechDocsReaderLayout = ({
  hideHeader = false,
}: TechDocsReaderLayoutProps) => (
  <>
    {!hideHeader && <TechDocsReaderPageHeader />}
    <TechDocsReaderPageSubheader />
    <TechDocsReaderPageContent />
  </>
);

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  path?: string;
  entityName?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = ({
  path: defaultPath,
  entityName: defaultEntityName,
  children = <TechDocsReaderLayout />,
}: TechDocsReaderPageProps) => {
  const params = useParams();

  const path = useMemo(() => {
    if (defaultPath) {
      return defaultPath;
    }
    return params['*'] ?? '';
  }, [params, defaultPath]);

  const entityName = useMemo(() => {
    if (defaultEntityName) {
      return defaultEntityName;
    }
    return {
      kind: params.kind,
      name: params.name,
      namespace: params.namespace,
    };
  }, [params, defaultEntityName]);

  return (
    <TechDocsMetadataProvider entityName={entityName}>
      <TechDocsEntityProvider entityName={entityName}>
        <TechDocsReaderPageProvider path={path} entityName={entityName}>
          {children}
        </TechDocsReaderPageProvider>
      </TechDocsEntityProvider>
    </TechDocsMetadataProvider>
  );
};
