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

import { parseEntityRef } from '@backstage/catalog-model';
import { Header, Page, SupportButton } from '@backstage/core-components';
import { useAnalytics, useRouteRef } from '@backstage/core-plugin-api';
import {
  entityPresentationSnapshot,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { Flex, FullPage, Text, ToggleButton } from '@backstage/ui';
import { RiFilterLine, RiFullscreenLine } from '@remixicon/react';
import classNames from 'classnames';
import { MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EntityRelationsGraph,
  EntityRelationsGraphProps,
} from '../EntityRelationsGraph';
import { CurveFilter } from './CurveFilter';
import { DirectionFilter } from './DirectionFilter';
import { MaxDepthFilter } from './MaxDepthFilter';
import { SelectedKindsFilter } from './SelectedKindsFilter';
import { SelectedRelationsFilter } from './SelectedRelationsFilter';
import { SwitchFilter } from './SwitchFilter';
import { useCatalogGraphPage } from './useCatalogGraphPage';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogGraphTranslationRef } from '../../translation';
import { Direction, EntityNode } from '../../lib/types';
import styles from './CatalogGraphPage.module.css';

/**
 * @public
 * @deprecated The catalog graph page is styled with CSS modules and no longer
 * reads theme overrides, so this type has no effect and will be removed.
 */
export type CatalogGraphPageClassKey =
  | 'content'
  | 'container'
  | 'fullHeight'
  | 'graphWrapper'
  | 'graph'
  | 'legend'
  | 'filters';

type CatalogGraphPageProps = {
  initialState?: {
    selectedRelations?: string[];
    selectedKinds?: string[];
    rootEntityRefs?: string[];
    maxDepth?: number;
    unidirectional?: boolean;
    mergeRelations?: boolean;
    direction?: Direction;
    showFilters?: boolean;
    curve?: 'curveStepBefore' | 'curveMonotoneX';
  };
} & Partial<EntityRelationsGraphProps>;

function CatalogGraphPageContent(
  props: CatalogGraphPageProps & { headerVariant: 'legacy' | 'bui' },
) {
  const { headerVariant, ...pageProps } = props;
  const { relationPairs, initialState, entityFilter, showArrowHeads } =
    pageProps;
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const navigate = useNavigate();
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const {
    maxDepth,
    setMaxDepth,
    selectedKinds,
    setSelectedKinds,
    selectedRelations,
    setSelectedRelations,
    unidirectional,
    setUnidirectional,
    mergeRelations,
    setMergeRelations,
    direction,
    setDirection,
    curve,
    setCurve,
    rootEntityNames,
    setRootEntityNames,
    showFilters,
    toggleShowFilters,
  } = useCatalogGraphPage({ initialState });
  const analytics = useAnalytics();
  const onNodeClick = useCallback(
    (node: EntityNode, event: MouseEvent<unknown>) => {
      const nodeEntityName = parseEntityRef(node.id);
      const nodeTitle = entityPresentationSnapshot(node.entity).primaryTitle;

      if (event.shiftKey) {
        const path = catalogEntityRoute({
          kind: nodeEntityName.kind.toLowerCase(),
          namespace: nodeEntityName.namespace.toLowerCase(),
          name: nodeEntityName.name,
        });

        analytics.captureEvent('click', nodeTitle, {
          attributes: { to: path },
        });
        navigate(path);
      } else {
        analytics.captureEvent('click', nodeTitle);
        setRootEntityNames([nodeEntityName]);
      }
    },
    [catalogEntityRoute, navigate, setRootEntityNames, analytics],
  );

  const pageContent = (
    <div className={styles.root}>
      <Flex justify="between" align="center">
        <ToggleButton
          isSelected={showFilters}
          onChange={toggleShowFilters}
          iconStart={<RiFilterLine aria-hidden />}
        >
          {t('catalogGraphPage.filterToggleButtonTitle')}
        </ToggleButton>
        <SupportButton>
          {t('catalogGraphPage.supportButtonDescription')}
        </SupportButton>
      </Flex>
      <div
        className={classNames(styles.layout, {
          [styles.layoutWithFilters]: showFilters,
        })}
      >
        {showFilters && (
          <div className={styles.filters}>
            <MaxDepthFilter value={maxDepth} onChange={setMaxDepth} />
            <SelectedKindsFilter
              value={selectedKinds}
              onChange={setSelectedKinds}
            />
            <SelectedRelationsFilter
              value={selectedRelations}
              onChange={setSelectedRelations}
            />
            <DirectionFilter value={direction} onChange={setDirection} />
            <CurveFilter value={curve} onChange={setCurve} />
            <div className={styles.switches}>
              <SwitchFilter
                value={unidirectional}
                onChange={setUnidirectional}
                label={t('catalogGraphPage.simplifiedSwitchLabel')}
              />
              <SwitchFilter
                value={mergeRelations}
                onChange={setMergeRelations}
                label={t('catalogGraphPage.mergeRelationsSwitchLabel')}
              />
            </div>
          </div>
        )}
        <div className={styles.graphWrapper}>
          <Text
            as="p"
            variant="body-x-small"
            color="secondary"
            className={styles.legend}
          >
            <RiFullscreenLine size={16} aria-hidden />{' '}
            {t('catalogGraphPage.zoomOutDescription')}
          </Text>
          <EntityRelationsGraph
            {...pageProps}
            rootEntityNames={rootEntityNames}
            maxDepth={maxDepth}
            kinds={
              selectedKinds && selectedKinds.length > 0
                ? selectedKinds
                : undefined
            }
            relations={
              selectedRelations && selectedRelations.length > 0
                ? selectedRelations
                : undefined
            }
            mergeRelations={mergeRelations}
            unidirectional={unidirectional}
            showArrowHeads={showArrowHeads}
            onNodeClick={onNodeClick}
            direction={direction}
            relationPairs={relationPairs}
            entityFilter={entityFilter}
            className={styles.graph}
            zoom="enabled"
            curve={curve}
          />
        </div>
      </div>
    </div>
  );

  if (headerVariant === 'bui') {
    // FullPage sizes itself to the viewport below the plugin header, which
    // gives the graph a definite height even when there is no root entity.
    return <FullPage>{pageContent}</FullPage>;
  }

  return (
    <Page themeId="home">
      <Header
        title={t('catalogGraphPage.title')}
        subtitle={rootEntityNames
          .map(e => entityPresentationSnapshot(e).primaryTitle)
          .join(', ')}
      />
      <div className={styles.legacyContent}>{pageContent}</div>
    </Page>
  );
}

export const CatalogGraphPage = (props: CatalogGraphPageProps) => (
  <CatalogGraphPageContent {...props} headerVariant="legacy" />
);

export const NfsCatalogGraphPage = (props: CatalogGraphPageProps) => (
  <CatalogGraphPageContent {...props} headerVariant="bui" />
);
