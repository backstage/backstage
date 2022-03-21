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

import { Page } from '@backstage/core-components';
import React from 'react';
import { useParams } from 'react-router-dom';
import { AsyncState } from 'react-use/lib/useAsyncFn';

import {
  TechDocsMetadataProvider,
  TechDocsEntityProvider,
  TechDocsReaderPageProvider,
} from '../../context';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../types';
import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  dom: Element | null;
  asyncEntityMetadata: AsyncState<TechDocsEntityMetadata>;
  asyncTechDocsMetadata: AsyncState<TechDocsMetadata>;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const { asyncEntityMetadata, asyncTechDocsMetadata, dom } = props;
  const { namespace, kind, name } = useParams();
  const entityName = { namespace, kind, name };
  return (
    <TechDocsMetadataProvider asyncValue={asyncTechDocsMetadata}>
      <TechDocsEntityProvider asyncValue={asyncEntityMetadata}>
        <TechDocsReaderPageProvider entityName={entityName}>
          <Page themeId="documentation">
            <TechDocsReaderPageHeader />
            <TechDocsReaderPageSubheader />
            {/* todo(backstage/techdocs-core): handle state indicator */}
            {/* <TechDocReaderPageIndicator /> */}
            <TechDocsReaderPageContent dom={dom} />
          </Page>
        </TechDocsReaderPageProvider>
      </TechDocsEntityProvider>
    </TechDocsMetadataProvider>
  );
};
