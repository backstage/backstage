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

import React, {
  useState,
  useCallback,
  useEffect,
  ComponentProps,
  ReactNode,
} from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { Header, Breadcrumbs } from '@backstage/core-components';
import {
  useApi,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { IconComponent } from '@backstage/frontend-plugin-api';

import {
  Entity,
  EntityRelation,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';

import {
  useAsyncEntity,
  entityRouteRef,
  catalogApiRef,
  EntityRefLink,
  InspectEntityDialog,
  UnregisterEntityDialog,
  EntityDisplayName,
  FavoriteEntity,
} from '@backstage/plugin-catalog-react';

import { EntityLabels } from '../EntityLabels';
import { EntityContextMenu } from '../../../components/EntityContextMenu';
import { rootRouteRef, unregisterRedirectRouteRef } from '../../../routes';

function headerProps(
  paramKind: string | undefined,
  paramNamespace: string | undefined,
  paramName: string | undefined,
  entity: Entity | undefined,
): { headerTitle: string; headerType: string } {
  const kind = paramKind ?? entity?.kind ?? '';
  const namespace = paramNamespace ?? entity?.metadata.namespace ?? '';
  const name =
    entity?.metadata.title ?? paramName ?? entity?.metadata.name ?? '';

  return {
    headerTitle: `${name}${
      namespace && namespace !== DEFAULT_NAMESPACE ? ` in ${namespace}` : ''
    }`,
    headerType: (() => {
      let t = kind.toLocaleLowerCase('en-US');
      if (entity && entity.spec && 'type' in entity.spec) {
        t += ' — ';
        t += (entity.spec as { type: string }).type.toLocaleLowerCase('en-US');
      }
      return t;
    })(),
  };
}

function findParentRelation(
  entityRelations: EntityRelation[] = [],
  relationTypes: string[] = [],
) {
  for (const type of relationTypes) {
    const foundRelation = entityRelations.find(
      relation => relation.type === type,
    );
    if (foundRelation) {
      return foundRelation; // Return the first found relation and stop
    }
  }
  return null;
}

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
  // NOTE(freben): Intentionally not exported at this point, since it's part of
  // the unstable extra context menu items concept below
  UNSTABLE_extraContextMenuItems?: {
    title: string;
    Icon: IconComponent;
    onClick: () => void;
  }[];
  // NOTE(blam): Intentionally not exported at this point, since it's part of
  // unstable context menu option, eg: disable the unregister entity menu
  UNSTABLE_contextMenuOptions?: {
    disableUnregister: boolean | 'visible' | 'hidden' | 'disable';
  };
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
  const {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    parentEntityRelations,
    title,
    subtitle,
  } = props;
  const { entity } = useAsyncEntity();
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const { headerTitle: entityFallbackText, headerType: type } = headerProps(
    kind,
    namespace,
    name,
    entity,
  );

  const location = useLocation();
  const navigate = useNavigate();
  const catalogRoute = useRouteRef(rootRouteRef);
  const unregisterRedirectRoute = useRouteRef(unregisterRedirectRouteRef);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const openUnregisterEntityDialog = useCallback(
    () => setConfirmationDialogOpen(true),
    [setConfirmationDialogOpen],
  );

  const closeUnregisterEntityDialog = useCallback(
    () => setConfirmationDialogOpen(false),
    [setConfirmationDialogOpen],
  );

  const cleanUpAfterUnregisterConfirmation = useCallback(async () => {
    setConfirmationDialogOpen(false);
    navigate(
      unregisterRedirectRoute ? unregisterRedirectRoute() : catalogRoute(),
    );
  }, [
    navigate,
    catalogRoute,
    unregisterRedirectRoute,
    setConfirmationDialogOpen,
  ]);

  // Make sure to close the dialog if the user clicks links in it that navigate
  // to another entity.
  useEffect(() => {
    setConfirmationDialogOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedInspectEntityDialogTab = searchParams.get('inspect');

  const setInspectEntityDialogTab = useCallback(
    (newTab: string) => setSearchParams(`inspect=${newTab}`),
    [setSearchParams],
  );

  const openInspectEntityDialog = useCallback(
    () => setSearchParams('inspect'),
    [setSearchParams],
  );

  const closeInspectEntityDialog = useCallback(
    () => setSearchParams(),
    [setSearchParams],
  );

  const inspectDialogOpen = typeof selectedInspectEntityDialogTab === 'string';

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
          <EntityContextMenu
            UNSTABLE_extraContextMenuItems={UNSTABLE_extraContextMenuItems}
            UNSTABLE_contextMenuOptions={UNSTABLE_contextMenuOptions}
            onInspectEntity={openInspectEntityDialog}
            onUnregisterEntity={openUnregisterEntityDialog}
          />
          <InspectEntityDialog
            entity={entity!}
            initialTab={
              (selectedInspectEntityDialogTab as ComponentProps<
                typeof InspectEntityDialog
              >['initialTab']) || undefined
            }
            open={inspectDialogOpen}
            onClose={closeInspectEntityDialog}
            onSelect={setInspectEntityDialogTab}
          />
          <UnregisterEntityDialog
            entity={entity!}
            open={confirmationDialogOpen}
            onClose={closeUnregisterEntityDialog}
            onConfirm={cleanUpAfterUnregisterConfirmation}
          />
        </>
      )}
    </Header>
  );
}
