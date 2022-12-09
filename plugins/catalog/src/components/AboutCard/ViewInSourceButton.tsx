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
import { IconLinkVertical } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  ScmIntegrationIcon,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  getEntitySourceLocation,
  useEntity,
} from '@backstage/plugin-catalog-react';
import React from 'react';

export function ViewInSourceButton() {
  const { entity } = useEntity();
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const entitySourceLocation = getEntitySourceLocation(
    entity,
    scmIntegrationsApi,
  );

  return (
    <IconLinkVertical
      label="View Source"
      disabled={!entitySourceLocation}
      icon={<ScmIntegrationIcon type={entitySourceLocation?.integrationType} />}
      href={entitySourceLocation?.locationTargetUrl}
    />
  );
}
