/*
 * Copyright 2025 The Backstage Authors
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

import { ReactNode } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Breadcrumbs, Header } from '@backstage/core-components';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  EntityDisplayName,
  EntityRefLink,
  entityRouteRef,
  FavoriteEntity,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';

import { EntityLabels } from '../EntityLabels';
import { headerProps } from '../../../utils/headerProps.ts';
import { findParentRelation } from '../../../utils/findParentRelation.ts';

const useStyles = makeStyles(theme => ({
  breadcrumbs: {
    color: theme.page.fontColor,
    fontSize: theme.typography.caption.fontSize,
    textTransform: 'uppercase',
    marginTop: theme.spacing(1),
    opacity: 0.8,
    '& span ': {
      color: theme.page.fontColor,
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    },
  },
}));

function EntityHeaderTitle() {
  const { entity } = useAsyncEntity();
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const { headerTitle: title } = headerProps(kind, namespace, name, entity);
  return (
    <Box display="inline-flex" alignItems="center" height="1em" maxWidth="100%">
      <Box
        component="span"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {entity ? <EntityDisplayName entityRef={entity} hideIcon /> : title}
      </Box>
      {entity && <FavoriteEntity entity={entity} />}
    </Box>
  );
}

function EntityHeaderSubtitle(props: { parentEntityRelations?: string[] }) {
  const { parentEntityRelations } = props;
  const classes = useStyles();
  const { entity } = useAsyncEntity();
  const { name } = useRouteRefParams(entityRouteRef);
  const parentEntity = findParentRelation(
    entity?.relations ?? [],
    parentEntityRelations ?? [],
  );

  const catalogApi = useApi(catalogApiRef);

  const { value: ancestorEntity } = useAsync(async () => {
    if (parentEntity) {
      return findParentRelation(
        (await catalogApi.getEntityByRef(parentEntity?.targetRef))?.relations,
        parentEntityRelations,
      );
    }
    return null;
  }, [parentEntity, catalogApi]);

  return parentEntity ? (
    <Breadcrumbs separator=">" className={classes.breadcrumbs}>
      {ancestorEntity && (
        <EntityRefLink entityRef={ancestorEntity.targetRef} disableTooltip />
      )}
      <EntityRefLink entityRef={parentEntity.targetRef} disableTooltip />
      {name}
    </Breadcrumbs>
  ) : null;
}

/** @alpha */
export function EntityHeader(props: {
  contextMenu?: ReactNode;
  /**
   * An array of relation types used to determine the parent entities in the hierarchy.
   * These relations are prioritized in the order provided, allowing for flexible
   * navigation through entity relationships.
   *
   * For example, use relation types like `["partOf", "memberOf", "ownedBy"]` to define how the entity is related to
   * its parents in the Entity Catalog.
   *
   * It adds breadcrumbs in the Entity page to enhance user navigation and context awareness.
   */
  parentEntityRelations?: string[];
  title?: ReactNode;
  subtitle?: ReactNode;
}) {
  const { contextMenu, parentEntityRelations, title, subtitle } = props;
  const { entity } = useAsyncEntity();
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const { headerTitle: entityFallbackText, headerType: type } = headerProps(
    kind,
    namespace,
    name,
    entity,
  );

  return (
    <Header
      pageTitleOverride={entityFallbackText}
      type={type}
      title={title ?? <EntityHeaderTitle />}
      subtitle={
        subtitle ?? (
          <EntityHeaderSubtitle parentEntityRelations={parentEntityRelations} />
        )
      }
    >
      {entity && (
        <>
          <EntityLabels entity={entity} />
          {contextMenu}
        </>
      )}
    </Header>
  );
}
