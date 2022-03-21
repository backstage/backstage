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

import React, { useCallback, useState } from 'react';
import { useOutlet } from 'react-router';
import { useParams } from 'react-router-dom';
import useAsync, { AsyncState } from 'react-use/lib/useAsync';
import { techdocsApiRef } from '../../api';
import { LegacyTechDocsPage } from './LegacyTechDocsPage';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../types';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { getComponentData, useApi, useApp } from '@backstage/core-plugin-api';
import { Page } from '@backstage/core-components';
import {
  TechDocsReaderPage as AddonAwareReaderPage,
  TECHDOCS_ADDONS_WRAPPER_KEY,
} from '@backstage/plugin-techdocs-addons';
import { useTechDocsReaderDom, withTechDocsReaderProvider } from './Reader';

/**
 * Helper function that gives the children of {@link TechDocsReaderPage} access to techdocs and entity metadata
 *
 * @public
 */
export type TechDocsReaderPageRenderFunction = ({
  techdocsMetadataValue,
  entityMetadataValue,
  entityRef,
}: {
  techdocsMetadataValue?: TechDocsMetadata | undefined;
  entityMetadataValue?: TechDocsEntityMetadata | undefined;
  entityRef: CompoundEntityRef;
  onReady: () => void;
}) => JSX.Element;

type SpecialReaderPageProps = {
  entityName: CompoundEntityRef;
  asyncEntityMetadata: AsyncState<TechDocsEntityMetadata>;
  asyncTechDocsMetadata: AsyncState<TechDocsMetadata>;
};

const SpecialReaderPage = (props: SpecialReaderPageProps) => {
  const dom = useTechDocsReaderDom(props.entityName);

  return (
    <AddonAwareReaderPage
      asyncEntityMetadata={props.asyncEntityMetadata}
      asyncTechDocsMetadata={props.asyncTechDocsMetadata}
      dom={dom}
    />
  );
};

/**
 * Props for {@link TechDocsReaderPage}
 *
 * @public
 */
export type TechDocsReaderPageProps = {
  children?: TechDocsReaderPageRenderFunction | React.ReactNode;
};

export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const { children } = props;
  const { NotFoundErrorPage } = useApp().getComponents();
  const outlet = useOutlet();

  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const { namespace, kind, name } = useParams();

  const techdocsApi = useApi(techdocsApiRef);

  const asyncTechDocsMetadata = useAsync(() => {
    if (documentReady) {
      return techdocsApi.getTechDocsMetadata({ kind, namespace, name });
    }

    return Promise.resolve(undefined);
  }, [kind, namespace, name, techdocsApi, documentReady]);

  const asyncEntityMetadata = useAsync(() => {
    return techdocsApi.getEntityMetadata({ kind, namespace, name });
  }, [kind, namespace, name, techdocsApi]);

  const onReady = useCallback(() => {
    setDocumentReady(true);
  }, [setDocumentReady]);

  if (asyncEntityMetadata.error) return <NotFoundErrorPage />;

  if (!children) {
    if (outlet) {
      // If the outlet is a single child and that child is an instance of the
      // TechDocsAddons registry, then render it a certain way.
      if (
        getComponentData(outlet.props.children, TECHDOCS_ADDONS_WRAPPER_KEY)
      ) {
        const Component = withTechDocsReaderProvider(SpecialReaderPage, {
          kind,
          namespace,
          name,
        });
        return (
          <Component
            entityName={{ kind, namespace, name }}
            asyncEntityMetadata={asyncEntityMetadata}
            asyncTechDocsMetadata={asyncTechDocsMetadata}
          />
        );
      }
      // Otherwise, just return the outlet (legacy-style composability).
      return outlet;
    }
    return <LegacyTechDocsPage />;
  }

  return (
    <Page themeId="documentation">
      {children instanceof Function
        ? children({
            techdocsMetadataValue: asyncTechDocsMetadata.value,
            entityMetadataValue: asyncEntityMetadata.value,
            entityRef: { kind, namespace, name },
            onReady,
          })
        : children}
    </Page>
  );
};

/**
 * @public
 * @deprecated use {@link TechDocsReaderPage} instead
 */
export const TechDocsPage = TechDocsReaderPage;

/**
 * @public
 * @deprecated use {@link TechDocsReaderPageRenderFunction} instead
 */

export type TechDocsPageRenderFunction = TechDocsReaderPageRenderFunction;
