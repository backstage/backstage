/*
 * Copyright 2020 The Backstage Authors
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
  DEFAULT_NAMESPACE,
  Entity,
  EntityRelation,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import {
  Breadcrumbs,
  Content,
  Header,
  HeaderLabel,
  Link,
  Page,
  Progress,
  RoutedTabs,
  WarningPanel,
} from '@backstage/core-components';
import {
  attachComponentData,
  IconComponent,
  useApi,
  useElementFilter,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  catalogApiRef,
  EntityDisplayName,
  EntityRefLink,
  EntityRefLinks,
  entityRouteRef,
  FavoriteEntity,
  getEntityRelations,
  InspectEntityDialog,
  UnregisterEntityDialog,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { TabProps } from '@material-ui/core/Tab';
import Alert from '@material-ui/lab/Alert';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import { catalogTranslationRef } from '../../alpha/translation';
import { rootRouteRef, unregisterRedirectRouteRef } from '../../routes';
import { EntityContextMenu } from '../EntityContextMenu/EntityContextMenu';

/** @public */
export type EntityLayoutRouteProps = {
  path: string;
  title: string;
  children: JSX.Element;
  if?: (entity: Entity) => boolean;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const dataKey = 'plugin.catalog.entityLayoutRoute';

const Route: (props: EntityLayoutRouteProps) => null = () => null;
attachComponentData(Route, dataKey, true);
attachComponentData(Route, 'core.gatherMountPoints', true); // This causes all mount points that are discovered within this route to use the path of the route itself

function EntityLayoutTitle(props: {
  title: string;
  entity: Entity | undefined;
}) {
  const { entity, title } = props;
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

function EntityLabels(props: { entity: Entity }) {
  const { entity } = props;
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  const { t } = useTranslationRef(catalogTranslationRef);
  return (
    <>
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label={t('entityLabels.ownerLabel')}
          contentTypograpyRootComponent="p"
          value={
            <EntityRefLinks
              entityRefs={ownedByRelations}
              defaultKind="Group"
              color="inherit"
            />
          }
        />
      )}
      {entity.spec?.lifecycle && (
        <HeaderLabel
          label={t('entityLabels.lifecycleLabel')}
          value={entity.spec.lifecycle?.toString()}
        />
      )}
    </>
  );
}

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
interface ExtraContextMenuItem {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
}

type VisibleType = 'visible' | 'hidden' | 'disable';

// NOTE(blam): Intentionally not exported at this point, since it's part of
// unstable context menu option, eg: disable the unregister entity menu
interface EntityContextMenuOptions {
  disableUnregister: boolean | VisibleType;
}

/** @public */
export interface EntityLayoutProps {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  UNSTABLE_contextMenuOptions?: EntityContextMenuOptions;
  children?: React.ReactNode;
  NotFoundComponent?: React.ReactNode;
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

/**
 * EntityLayout is a compound component, which allows you to define a layout for
 * entities using a sub-navigation mechanism.
 *
 * Consists of two parts: EntityLayout and EntityLayout.Route
 *
 * @example
 * ```jsx
 * <EntityLayout>
 *   <EntityLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </EntityLayout.Route>
 * </EntityLayout>
 * ```
 *
 * @public
 */
export const EntityLayout = (props: EntityLayoutProps) => {
  const {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    children,
    NotFoundComponent,
    parentEntityRelations,
  } = props;
  const classes = useStyles();
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();
  const location = useLocation();
  const routes = useElementFilter(
    children,
    elements =>
      elements
        .selectByComponentData({
          key: dataKey,
          withStrictError:
            'Child of EntityLayout must be an EntityLayout.Route',
        })
        .getElements<EntityLayoutRouteProps>() // all nodes, element data, maintain structure or not?
        .flatMap(({ props: elementProps }) => {
          if (!entity) {
            return [];
          } else if (elementProps.if && !elementProps.if(entity)) {
            return [];
          }

          return [
            {
              path: elementProps.path,
              title: elementProps.title,
              children: elementProps.children,
              tabProps: elementProps.tabProps,
            },
          ];
        }),
    [entity],
  );

  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity,
  );

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const catalogRoute = useRouteRef(rootRouteRef);
  const unregisterRedirectRoute = useRouteRef(unregisterRedirectRouteRef);
  const { t } = useTranslationRef(catalogTranslationRef);

  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    navigate(
      unregisterRedirectRoute ? unregisterRedirectRoute() : catalogRoute(),
    );
  };

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
  }, [parentEntity]);

  // Make sure to close the dialog if the user clicks links in it that navigate
  // to another entity.
  useEffect(() => {
    setConfirmationDialogOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const selectedInspectTab = searchParams.get('inspect');
  const showInspectTab = typeof selectedInspectTab === 'string';

  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      <Header
        title={<EntityLayoutTitle title={headerTitle} entity={entity!} />}
        pageTitleOverride={headerTitle}
        type={headerType}
        subtitle={
          parentEntity && (
            <Breadcrumbs separator=">" className={classes.breadcrumbs}>
              {ancestorEntity && (
                <EntityRefLink
                  entityRef={ancestorEntity.targetRef}
                  disableTooltip
                />
              )}
              <EntityRefLink
                entityRef={parentEntity.targetRef}
                disableTooltip
              />
              {name}
            </Breadcrumbs>
          )
        }
      >
        {entity && (
          <>
            <EntityLabels entity={entity} />
            <EntityContextMenu
              UNSTABLE_extraContextMenuItems={UNSTABLE_extraContextMenuItems}
              UNSTABLE_contextMenuOptions={UNSTABLE_contextMenuOptions}
              onUnregisterEntity={() => setConfirmationDialogOpen(true)}
              onInspectEntity={() => setSearchParams('inspect')}
            />
          </>
        )}
      </Header>

      {loading && <Progress />}

      {entity && <RoutedTabs routes={routes} />}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
        </Content>
      )}

      {!loading && !error && !entity && (
        <Content>
          {NotFoundComponent ? (
            NotFoundComponent
          ) : (
            <WarningPanel title={t('entityLabels.warningPanelTitle')}>
              There is no {kind} with the requested{' '}
              <Link to="https://backstage.io/docs/features/software-catalog/references">
                kind, namespace, and name
              </Link>
              .
            </WarningPanel>
          )}
        </Content>
      )}

      {showInspectTab && (
        <InspectEntityDialog
          entity={entity!}
          initialTab={
            (selectedInspectTab as ComponentProps<
              typeof InspectEntityDialog
            >['initialTab']) || undefined
          }
          onSelect={newTab => setSearchParams(`inspect=${newTab}`)}
          open
          onClose={() => setSearchParams()}
        />
      )}

      <UnregisterEntityDialog
        open={confirmationDialogOpen}
        entity={entity!}
        onConfirm={cleanUpAfterRemoval}
        onClose={() => setConfirmationDialogOpen(false)}
      />
    </Page>
  );
};

EntityLayout.Route = Route;
