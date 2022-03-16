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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { Page } from '@backstage/core-components';
// todo(backstage/techdocs-core): Export these from @backstage/plugin-techdocs
import {
  withTechDocsReaderProvider,
  // @ts-ignore
  TechDocsStateIndicator as TechDocReaderPageIndicator,
} from '@backstage/plugin-techdocs';
import React from 'react';

import {
  TechDocsMetadataProvider,
  TechDocsEntityProvider,
  TechDocsReaderPageProvider,
} from '../../context';
import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';

/**
 * @public
 */
export type TechDocsReaderPageProps = { entityName: CompoundEntityRef };

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const { entityName } = props;
  const Component = withTechDocsReaderProvider(() => {
    return (
      <TechDocsMetadataProvider entityName={entityName}>
        <TechDocsEntityProvider entityName={entityName}>
          <TechDocsReaderPageProvider entityName={entityName}>
            <Page themeId="documentation">
              <TechDocsReaderPageHeader />
              <TechDocsReaderPageSubheader />
              <TechDocReaderPageIndicator />
              <TechDocsReaderPageContent />
            </Page>
          </TechDocsReaderPageProvider>
        </TechDocsEntityProvider>
      </TechDocsMetadataProvider>
    );
  }, entityName);
  return <Component />;
};
