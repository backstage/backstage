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

import React, { useState } from 'react';
import {
  Content,
  ContentHeader,
  ErrorPage,
  Header,
  Page,
} from '@backstage/core-components';
import { ScmIntegration } from '@backstage/integration';
import { ScmIntegrationsProvider } from '../../hooks/useIntegrations';
import { ScmIntegrationList } from '../ScmIntegrationList';
import { GithubScmIntegration } from '../GithubScmIntegration';

function getScmIntegrationComponent(
  integration: ScmIntegration | undefined,
): JSX.Element | null {
  switch (integration?.type) {
    case 'github':
      return <GithubScmIntegration integration={integration} />;
    default:
      return null;
  }
}

/**
 * The catalog import page for components.
 *
 * @public
 */
export const ComponentImportPage = () => {
  const [integration, setIntegration] = useState<ScmIntegration | undefined>(
    undefined,
  );
  const ScmIntegrationComponent = getScmIntegrationComponent(integration);

  if (integration && !ScmIntegrationComponent) {
    return (
      <ErrorPage
        status="400"
        statusMessage={`Integration ${integration.type} does not have an associated component`}
      />
    );
  }

  return (
    <Page themeId="home">
      <Header title="Catalog Import" />
      <Content>
        <ContentHeader title="Software components" />

        {integration ? (
          ScmIntegrationComponent
        ) : (
          <ScmIntegrationsProvider>
            <ScmIntegrationList setIntegration={setIntegration} />
          </ScmIntegrationsProvider>
        )}
      </Content>
    </Page>
  );
};
