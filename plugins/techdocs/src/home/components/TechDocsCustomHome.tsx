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
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { DocsTable, DocsTableRow } from './Tables';
import { DocsCardGrid, InfoCardGrid } from './Grids';
import { TechDocsPageWrapper } from './TechDocsPageWrapper';
import { TechDocsIndexPage } from './TechDocsIndexPage';

import {
  CodeSnippet,
  Content,
  HeaderTabs,
  Progress,
  WarningPanel,
  SupportButton,
  ContentHeader,
  TableOptions,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';
import { EntityFilterQuery } from '@backstage/catalog-client';

const panels = {
  DocsTable: DocsTable,
  DocsCardGrid: DocsCardGrid,
  TechDocsIndexPage: TechDocsIndexPage,
  InfoCardGrid: InfoCardGrid,
};

/**
 * Available panel types
 *
 * @public
 */
export type PanelType =
  | 'DocsCardGrid'
  | 'DocsTable'
  | 'TechDocsIndexPage'
  | 'InfoCardGrid';

/**
 * Type representing Panel props
 *
 * @public
 */
export interface PanelProps {
  options?: TableOptions<DocsTableRow>;
  linkContent?: string | JSX.Element;
  linkDestination?: (entity: Entity) => string | undefined;
  PageWrapper?: React.FC;
  CustomHeader?: React.FC;
}

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
  panelProps?: PanelProps;
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

/**
 * Component which can be used to render entities in a custom way.
 *
 * @public
 */
export const CustomDocsPanel = ({
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

  const Header: React.FC =
    config.panelProps?.CustomHeader ||
    (() => (
      <ContentHeader title={config.title} description={config.description}>
        {index === 0 ? (
          <SupportButton>
            Discover documentation in your ecosystem.
          </SupportButton>
        ) : null}
      </ContentHeader>
    ));

  return (
    <>
      <Header />
      <div className={classes.panelContainer}>
        <EntityListProvider>
          <Panel
            data-testid="techdocs-custom-panel"
            entities={shownEntities}
            {...config.panelProps}
          />
        </EntityListProvider>
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
  filter?: EntityFilterQuery;
  CustomPageWrapper?: React.FC;
};

export const TechDocsCustomHome = (props: TechDocsCustomHomeProps) => {
  const { tabsConfig, filter, CustomPageWrapper } = props;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const catalogApi: CatalogApi = useApi(catalogApiRef);

  const {
    value: entities,
    loading,
    error,
  } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: {
        ...filter,
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
      <TechDocsPageWrapper CustomPageWrapper={CustomPageWrapper}>
        <Content>
          <Progress />
        </Content>
      </TechDocsPageWrapper>
    );
  }

  if (error) {
    return (
      <TechDocsPageWrapper CustomPageWrapper={CustomPageWrapper}>
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
    <TechDocsPageWrapper CustomPageWrapper={CustomPageWrapper}>
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
          <CustomDocsPanel
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
