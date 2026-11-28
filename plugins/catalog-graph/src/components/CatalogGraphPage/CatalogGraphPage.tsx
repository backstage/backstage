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

import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { Header, Page, SupportButton } from '@backstage/core-components';
import { useAnalytics, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  entityPresentationSnapshot,
  useEntityPresentation,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { Alert, Flex, FullPage, Text, ToggleButton } from '@backstage/ui';
import { RiFilterLine, RiFullscreenLine } from '@remixicon/react';
import classNames from 'classnames';
import { MouseEvent, useCallback, useMemo } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { useLocation, useNavigate } from 'react-router-dom';
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
import {
  BreadcrumbEntry,
  useTranslationRef,
} from '@backstage/frontend-plugin-api';
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

type HeaderVariant = 'legacy' | 'bui';

type CatalogGraphPageState = ReturnType<typeof useCatalogGraphPage>;

function CatalogGraphRoots(
  props: Omit<CatalogGraphPageProps, 'initialState'> &
    CatalogGraphPageState & { headerVariant: HeaderVariant },
) {
  const {
    headerVariant,
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
    ...pageProps
  } = props;
  const { relationPairs, entityFilter, showArrowHeads } = pageProps;
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const catalogEntityRoute = useRouteRef(entityRouteRef);
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

  const catalogApi = useApi(catalogApiRef);
  const firstRoot = rootEntityNames[0];
  const firstRootTitle = useEntityPresentation(firstRoot).primaryTitle;
  // The root names are reparsed whenever the URL changes, so key the refs by
  // value to only check for missing entities when the roots actually change.
  const rootEntityRefsKey = JSON.stringify(
    rootEntityNames.map(e => stringifyEntityRef(e)),
  );
  const rootEntityRefs = useMemo<string[]>(
    () => JSON.parse(rootEntityRefsKey),
    [rootEntityRefsKey],
  );
  const { value: rootEntities } = useAsync(async () => {
    const { items } = await catalogApi.getEntitiesByRefs({
      entityRefs: rootEntityRefs,
      fields: ['kind', 'metadata.name', 'metadata.namespace'],
    });
    return rootEntityRefs.map((ref, index) => ({ ref, found: !!items[index] }));
  }, [catalogApi, rootEntityRefs]);
  const missingRefs = rootEntities?.filter(e => !e.found).map(e => e.ref) ?? [];

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
      {missingRefs.length > 0 && (
        <Alert
          status="warning"
          title={t('catalogGraphPage.entityNotFoundTitle')}
          description={t('catalogGraphPage.entityNotFoundDescription', {
            refs: missingRefs.join(', '),
          })}
        />
      )}
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

  const rootEntityTitle =
    rootEntityNames.length > 1
      ? `${firstRootTitle} ${t('catalogGraphPage.additionalRootEntities', {
          count: rootEntityNames.length - 1,
        })}`
      : firstRootTitle;

  if (headerVariant === 'bui') {
    // The plugin header has no subtitle, so the root entities are shown as an
    // extra breadcrumb that links to the first root entity. A trailing crumb
    // for this page keeps the entity crumb from being the current one.
    // FullPage sizes itself to the viewport below the plugin header, which
    // gives the graph a definite height.
    return (
      <BreadcrumbEntry
        entry={{
          label: rootEntityTitle,
          href: catalogEntityRoute({
            kind: firstRoot.kind.toLowerCase(),
            namespace: firstRoot.namespace.toLowerCase(),
            name: firstRoot.name,
          }),
        }}
      >
        <BreadcrumbEntry
          entry={{
            label: t('catalogGraphPage.breadcrumbTitle'),
            href: `${pathname}${search}`,
          }}
        >
          <FullPage>{pageContent}</FullPage>
        </BreadcrumbEntry>
      </BreadcrumbEntry>
    );
  }

  return (
    <Page themeId="home">
      <Header title={t('catalogGraphPage.title')} subtitle={rootEntityTitle} />
      <div className={styles.legacyContent}>{pageContent}</div>
    </Page>
  );
}

function CatalogGraphPageContent(
  props: CatalogGraphPageProps & { headerVariant: HeaderVariant },
) {
  const { initialState, ...rest } = props;
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const state = useCatalogGraphPage({ initialState });

  if (state.rootEntityNames.length > 0) {
    return <CatalogGraphRoots {...rest} {...state} />;
  }

  // Without a root entity there is nothing to show, and nothing on the page
  // can select one.
  const emptyState = (
    <div className={styles.root}>
      <Alert
        status="info"
        title={t('catalogGraphPage.noRootEntityTitle')}
        description={t('catalogGraphPage.noRootEntityDescription')}
      />
    </div>
  );

  if (props.headerVariant === 'bui') {
    return <FullPage>{emptyState}</FullPage>;
  }

  return (
    <Page themeId="home">
      <Header title={t('catalogGraphPage.title')} />
      <div className={styles.legacyContent}>{emptyState}</div>
    </Page>
  );
}

export const CatalogGraphPage = (props: CatalogGraphPageProps) => (
  <CatalogGraphPageContent {...props} headerVariant="legacy" />
);

export const NfsCatalogGraphPage = (props: CatalogGraphPageProps) => (
  <CatalogGraphPageContent {...props} headerVariant="bui" />
);
