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
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { IconLinkVertical } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import DocsIcon from '@material-ui/icons/Description';
import React from 'react';
import { viewTechDocRouteRef } from '../../routes';

export function ViewInTechDocsButton() {
  const { entity } = useEntity();
  const viewTechdocLink = useRouteRef(viewTechDocRouteRef);

  return (
    <IconLinkVertical
      label="View TechDocs"
      disabled={
        !entity.metadata.annotations?.['backstage.io/techdocs-ref'] ||
        !viewTechdocLink
      }
      icon={<DocsIcon />}
      href={
        viewTechdocLink &&
        viewTechdocLink({
          namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
          kind: entity.kind,
          name: entity.metadata.name,
        })
      }
    />
  );
}
