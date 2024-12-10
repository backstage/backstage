/*
 * Copyright 2021 The Backstage Authors
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
import useAsync from 'react-use/esm/useAsync';
import { makeStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles/withStyles';
import {
  CATALOG_FILTER_EXISTS,
  catalogApiRef,
  CatalogApi,
  useEntityOwnership,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { DocsTable } from './Tables';
import { DocsCardGrid } from './Grids';
import { TechDocsPageWrapper } from './TechDocsPageWrapper';

import {
  CodeSnippet,
  Content,
  HeaderTabs,
  Progress,
  WarningPanel,
  SupportButton,
  ContentHeader,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';

const panels = {
  DocsTable: DocsTable,
  DocsCardGrid: DocsCardGrid,
};

/**
 * Available panel types
 *
 * @public
 */
export type PanelType = 'DocsCardGrid' | 'DocsTable';

/**
 * Type representing a TechDocsCustomHome panel.
 *
 * @public
 */
export interface PanelConfig {
  title: string;
  description: string;
  panelType: PanelType;
  panelCSS?: CSSProperties;
  filterPredicate: ((entity: Entity) => boolean) | string;
}

/**
 * Type representing a TechDocsCustomHome tab.
 *
 * @public
 */
export interface TabConfig {
  label: string;
  panels: PanelConfig[];
}

/**
 * Type representing a list of TechDocsCustomHome tabs.
 *
 * @public
 */
export type TabsConfig = TabConfig[];

const CustomPanel = ({
  config,
  entities,
  index,
}: {
  config: PanelConfig;
  entities: Entity[];
  index: number;
}) => {
  const useStyles = makeStyles({
    panelContainer: {
      marginBottom: '2rem',
      ...(config.panelCSS ? config.panelCSS : {}),
    },
  });
  const classes = useStyles();
  const { loading: loadingOwnership, isOwnedEntity } = useEntityOwnership();

  const Panel = panels[config.panelType];

  const shownEntities = entities.filter(entity => {
    if (config.filterPredicate === 'ownedByUser') {
      if (loadingOwnership) {
        return false;
      }
      return isOwnedEntity(entity);
    }

    return (
      typeof config.filterPredicate === 'function' &&
      config.filterPredicate(entity)
    );
  });

  return (
    <>
      <ContentHeader title={config.title} description={config.description}>
        {index === 0 ? (
          <SupportButton>
            Discover documentation in your ecosystem.
          </SupportButton>
        ) : null}
      </ContentHeader>
      <div className={classes.panelContainer}>
        <Panel data-testid="techdocs-custom-panel" entities={shownEntities} />
      </div>
    </>
  );
};

/**
 * Props for {@link TechDocsCustomHome}
 *
 * @public
 */
export type TechDocsCustomHomeProps = {
  tabsConfig: TabsConfig;
};

export const TechDocsCustomHome = (props: TechDocsCustomHomeProps) => {
  const { tabsConfig } = props;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const catalogApi: CatalogApi = useApi(catalogApiRef);

  const {
    value: entities,
    loading,
    error,
  } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: {
        [`metadata.annotations.${TECHDOCS_ANNOTATION}`]: CATALOG_FILTER_EXISTS,
      },
      fields: [
        'apiVersion',
        'kind',
        'metadata',
        'relations',
        'spec.owner',
        'spec.type',
      ],
    });
    return response.items.filter((entity: Entity) => {
      return !!entity.metadata.annotations?.[TECHDOCS_ANNOTATION];
    });
  });

  const currentTabConfig = tabsConfig[selectedTab];

  if (loading) {
    return (
      <TechDocsPageWrapper>
        <Content>
          <Progress />
        </Content>
      </TechDocsPageWrapper>
    );
  }

  if (error) {
    return (
      <TechDocsPageWrapper>
        <Content>
          <WarningPanel
            severity="error"
            title="Could not load available documentation."
          >
            <CodeSnippet language="text" text={error.toString()} />
          </WarningPanel>
        </Content>
      </TechDocsPageWrapper>
    );
  }

  return (
    <TechDocsPageWrapper>
      <HeaderTabs
        selectedIndex={selectedTab}
        onChange={index => setSelectedTab(index)}
        tabs={tabsConfig.map(({ label }, index) => ({
          id: index.toString(),
          label,
        }))}
      />
      <Content data-testid="techdocs-content">
        {currentTabConfig.panels.map((config, index) => (
          <CustomPanel
            key={index}
            config={config}
            entities={!!entities ? entities : []}
            index={index}
          />
        ))}
      </Content>
    </TechDocsPageWrapper>
  );
};
