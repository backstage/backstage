/*
 * Copyright 2020 Spotify AB
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
import { useAsync } from 'react-use';

import { catalogApiRef, CatalogApi } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import {
  CodeSnippet,
  Content,
  Header,
  HeaderTabs,
  Page,
  Progress,
  useApi,
  WarningPanel,
} from '@backstage/core';

import { OverviewContent } from './OverviewContent';
import { OwnedContent } from './OwnedContent';

export const TechDocsHome = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const catalogApi: CatalogApi = useApi(catalogApiRef);

  const tabs = [{ label: 'Overview' }, { label: 'Owned Documents' }];

  const { value, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities();
    return response.items.filter((entity: Entity) => {
      return !!entity.metadata.annotations?.['backstage.io/techdocs-ref'];
    });
  });

  if (loading) {
    return (
      <Page themeId="documentation">
        <Header
          title="Documentation"
          subtitle="Documentation available in Backstage"
        />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="documentation">
        <Header
          title="Documentation"
          subtitle="Documentation available in Backstage"
        />
        <Content>
          <WarningPanel
            severity="error"
            title="Could not load available documentation."
          >
            <CodeSnippet language="text" text={error.toString()} />
          </WarningPanel>
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="documentation">
      <Header
        title="Documentation"
        subtitle="Documentation available in Backstage"
      />
      <HeaderTabs
        selectedIndex={selectedTab}
        onChange={index => setSelectedTab(index)}
        tabs={tabs.map(({ label }, index) => ({
          id: index.toString(),
          label,
        }))}
      />
      {selectedTab === 0 ? (
        <OverviewContent entities={value} />
      ) : (
        <OwnedContent entities={value} />
      )}
    </Page>
  );
};
