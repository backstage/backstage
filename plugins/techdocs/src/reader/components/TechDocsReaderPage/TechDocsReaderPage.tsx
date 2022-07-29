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

import React, { ReactNode, ReactChild, Children } from 'react';
import { useOutlet, useParams } from 'react-router-dom';

import { Page } from '@backstage/core-components';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  TECHDOCS_ADDONS_WRAPPER_KEY,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import { MkDocsReaderContent } from '@backstage/plugin-techdocs-mkdocs-react';

import { TechDocsReaderPageLayout } from '../TechDocsReaderPageLayout';
import { TechDocsReaderPageRenderFunction } from '../../../types';

const DefaultTechDocsReaderPage = () => (
  <TechDocsReaderPageLayout>
    <MkDocsReaderContent />
  </TechDocsReaderPageLayout>
);

type Extension = ReactChild & {
  type: {
    __backstage_data: {
      map: Map<string, boolean>;
    };
  };
};

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  entityRef?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const { kind, name, namespace } = useParams();
  const { children, entityRef = { kind, name, namespace } } = props;

  const outlet = useOutlet();

  if (!children) {
    const childrenList = outlet ? Children.toArray(outlet.props.children) : [];

    const page = childrenList.find(child => {
      const { type } = child as Extension;
      return !type?.__backstage_data?.map?.get(TECHDOCS_ADDONS_WRAPPER_KEY);
    });

    return (
      <TechDocsReaderPageProvider entityRef={entityRef}>
        {(page as JSX.Element) || <DefaultTechDocsReaderPage />}
      </TechDocsReaderPageProvider>
    );
  }

  return (
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {({ metadata, entityMetadata }) => (
        <div className="techdocs-reader-page">
          <Page themeId="documentation">
            {children instanceof Function
              ? children({
                  entityRef,
                  techdocsMetadataValue: metadata.value,
                  entityMetadataValue: entityMetadata.value,
                })
              : children}
          </Page>
        </div>
      )}
    </TechDocsReaderPageProvider>
  );
};
