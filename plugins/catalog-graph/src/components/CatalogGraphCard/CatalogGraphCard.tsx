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

import {
  getCompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useAnalytics, useRouteRef } from '@backstage/core-plugin-api';
import {
  EntityInfoCard,
  humanizeEntityRef,
  useEntity,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { ButtonLink } from '@backstage/ui';
import { RiArrowRightLine } from '@remixicon/react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import qs from 'qs';
import { MouseEvent, ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogGraphRouteRef } from '../../routes';
import {
  EntityRelationsGraph,
  EntityRelationsGraphProps,
} from '../EntityRelationsGraph';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogGraphTranslationRef } from '../../translation';
import { Direction, EntityNode } from '../../lib/types';
import classNames from 'classnames';

/** @public */
export type CatalogGraphCardClassKey = 'graph';

const useStyles = makeStyles<Theme, { height?: number }>(
  {
    graph: ({ height }) => ({
      height: height ?? '100%',
      minHeight: 0,
    }),
  },
  { name: 'PluginCatalogGraphCatalogGraphCard' },
);

export const CatalogGraphCard = (
  props: Partial<EntityRelationsGraphProps> & {
    height?: number;
    title?: string;
    action?: ReactNode;
  },
) => {
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const {
    relationPairs,
    maxDepth = 1,
    unidirectional = true,
    mergeRelations = true,
    showArrowHeads,
    direction = Direction.LEFT_RIGHT,
    kinds,
    relations,
    entityFilter,
    height,
    className,
    action,
    rootEntityNames,
    onNodeClick,
    title = t('catalogGraphCard.title'),
    zoom = 'enable-on-click',
  } = props;

  const { entity } = useEntity();
  const entityName = useMemo(() => getCompoundEntityRef(entity), [entity]);
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const catalogGraphRoute = useRouteRef(catalogGraphRouteRef);
  const navigate = useNavigate();
  const classes = useStyles({ height });
  const analytics = useAnalytics();

  const defaultOnNodeClick = useCallback(
    (node: EntityNode, _: MouseEvent<unknown>) => {
      const nodeEntityName = parseEntityRef(node.id);
      const path = catalogEntityRoute({
        kind: nodeEntityName.kind.toLocaleLowerCase('en-US'),
        namespace: nodeEntityName.namespace.toLocaleLowerCase('en-US'),
        name: nodeEntityName.name,
      });
      analytics.captureEvent(
        'click',
        node.entity.metadata.title ?? humanizeEntityRef(nodeEntityName),
        { attributes: { to: path } },
      );
      navigate(path);
    },
    [catalogEntityRoute, navigate, analytics],
  );

  const catalogGraphParams = qs.stringify(
    {
      rootEntityRefs: [stringifyEntityRef(entity)],
      maxDepth: maxDepth,
      unidirectional,
      mergeRelations,
      selectedKinds: kinds,
      selectedRelations: relations,
      direction,
    },
    { arrayFormat: 'brackets', addQueryPrefix: true },
  );
  const catalogGraphUrl = `${catalogGraphRoute()}${catalogGraphParams}`;

  return (
    <EntityInfoCard
      title={title}
      headerActions={action}
      footerActions={
        <ButtonLink
          iconEnd={<RiArrowRightLine />}
          variant="tertiary"
          href={catalogGraphUrl}
        >
          {t('catalogGraphCard.deepLinkTitle')}
        </ButtonLink>
      }
    >
      <EntityRelationsGraph
        {...props}
        rootEntityNames={rootEntityNames || entityName}
        onNodeClick={onNodeClick || defaultOnNodeClick}
        className={classNames(classes.graph, className)}
        maxDepth={maxDepth}
        unidirectional={unidirectional}
        mergeRelations={mergeRelations}
        direction={direction}
        relationPairs={relationPairs}
        entityFilter={entityFilter}
        zoom={zoom}
        showArrowHeads={showArrowHeads}
      />
    </EntityInfoCard>
  );
};
