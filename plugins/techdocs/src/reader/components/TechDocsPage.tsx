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
import { useAsync } from 'react-use';
import { techdocsApiRef } from '../../api';
import { TechDocsEntityMetadata, TechDocsMetadata } from '../../types';
import { EntityName } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { Page } from '@backstage/core-components';

type RenderFunction = ({
  techdocsMetadataValue,
  entityMetadataValue,
  entityId,
}: {
  techdocsMetadataValue?: TechDocsMetadata | undefined;
  entityMetadataValue?: TechDocsEntityMetadata | undefined;
  entityId: EntityName;
  onReady: () => void;
}) => JSX.Element;

type Props = {
  children?: RenderFunction | React.ReactNode;
};

export const TechDocsPage = ({ children }: Props) => {
  const outlet = useOutlet();

  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const { namespace, kind, name } = useParams();

  const techdocsApi = useApi(techdocsApiRef);

  const { value: techdocsMetadataValue } = useAsync(() => {
    if (documentReady) {
      return techdocsApi.getTechDocsMetadata({ kind, namespace, name });
    }

    return Promise.resolve(undefined);
  }, [kind, namespace, name, techdocsApi, documentReady]);

  const { value: entityMetadataValue, error: entityMetadataError } =
    useAsync(() => {
      return techdocsApi.getEntityMetadata({ kind, namespace, name });
    }, [kind, namespace, name, techdocsApi]);

  const onReady = useCallback(() => {
    setDocumentReady(true);
  }, [setDocumentReady]);

  if (!children) return outlet;

  return (
    <Page themeId="documentation">
      {children instanceof Function
        ? children({
            techdocsMetadataValue,
            entityMetadataValue,
            entityId: { kind, namespace, name },
            onReady,
          })
        : children}
    </Page>
  );
};
