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

import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { CompoundEntityRef } from '@backstage/catalog-model';

import { TechDocsEntityMetadata, TechDocsMetadata } from '../../types';
import { TechDocsReaderPageProvider } from '../TechDocsReaderPageContext';

/**
 * Function that uses the reader page context to render documentation.
 * @public
 */
export type TechDocsReaderPageRendererRenderFunction<T = {}> = (
  value: T & {
    techdocsMetadataValue?: TechDocsMetadata | undefined;
    entityMetadataValue?: TechDocsEntityMetadata | undefined;
    entityRef: CompoundEntityRef;
    /**
     * @deprecated You can continue pass this property, but directly to the `TechDocsReaderPageContent` component.
     */
    onReady?: () => void;
  },
) => JSX.Element;

/**
 * Props for {@link TechDocsReaderPageRenderer}.
 * @public
 */
export type TechDocsReaderPageRendererProps<T = {}> = {
  entityRef?: CompoundEntityRef;
  children: TechDocsReaderPageRendererRenderFunction<T> | ReactNode;
};

/**
 * Component to customize how a reader page renders.
 * @param props - see {@link TechDocsReaderPageRendererProps}.
 * @public
 */
export const TechDocsReaderPageRenderer = (
  props: TechDocsReaderPageRendererProps,
) => {
  const { kind, name, namespace } = useParams();
  const { children, entityRef = { kind, name, namespace } } = props;

  return (
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {({ metadata, entityMetadata }) =>
        children instanceof Function
          ? children({
              entityRef,
              techdocsMetadataValue: metadata.value,
              entityMetadataValue: entityMetadata.value,
            })
          : children
      }
    </TechDocsReaderPageProvider>
  );
};
