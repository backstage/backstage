/*
 * Copyright 2026 The Backstage Authors
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

import { ComponentProps, ReactNode, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  ButtonIcon,
  Header,
  HeaderMetadataUsers,
  Menu,
  MenuTrigger,
  type HeaderMetadataItem,
  type HeaderNavTabItem,
} from '@backstage/ui';
import {
  CompoundEntityRef,
  DEFAULT_NAMESPACE,
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  useApi,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { EntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';
import {
  catalogApiRef,
  EntityRefLink,
  entityRouteRef,
  getEntityRelations,
  InspectEntityDialog,
  useAsyncEntity,
  useStarredEntity,
} from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
import { RiMore2Line, RiStarFill, RiStarLine } from '@remixicon/react';

type EntityTabRoute = {
  path: string;
  title: string;
  group?: string;
};

function buildTitle(
  paramName: string | undefined,
  entity: Entity | undefined,
): string {
  return (
    entity?.metadata.title ??
    entity?.metadata.name ??
    paramName ??
    'Loading entity'
  );
}

function tabHrefFromPath(rawPath: string): string {
  return rawPath.replace(/\/\*$/, '').replace(/^\//, '');
}

// TODO: Per-tab icons aren't rendered. The BUI HeaderNavTab type doesn't
// expose an icon slot, so we drop EntityContentBlueprint.dataRefs.icon
// values here. Plumb through once @backstage/ui supports it.
function buildHeaderTabs(
  routes: EntityTabRoute[],
  groupDefinitions: EntityContentGroupDefinitions,
  defaultContentOrder: 'title' | 'natural',
): HeaderNavTabItem[] {
  const aliasToGroup: Record<string, string> = {};
  for (const [groupId, def] of Object.entries(groupDefinitions)) {
    for (const alias of def.aliases ?? []) {
      aliasToGroup[alias] = groupId;
    }
  }

  const resolveGroupId = (rawGroup: string | undefined) => {
    if (!rawGroup) return undefined;
    if (groupDefinitions[rawGroup]) return rawGroup;
    return aliasToGroup[rawGroup];
  };

  type Bucket = {
    groupId?: string;
    groupTitle?: string;
    items: { id: string; label: string; href: string }[];
  };

  const buckets: Record<string, Bucket> = {};
  const order: string[] = [];

  for (const route of routes) {
    const groupId = resolveGroupId(route.group);
    const def = groupId ? groupDefinitions[groupId] : undefined;
    const key = def && groupId ? groupId : route.path;
    if (!buckets[key]) {
      buckets[key] = {
        groupId,
        groupTitle: def?.title,
        items: [],
      };
      order.push(key);
    }
    buckets[key].items.push({
      id: route.path,
      label: route.title,
      href: tabHrefFromPath(route.path),
    });
  }

  const groupOrder = Object.keys(groupDefinitions);
  order.sort((a, b) => {
    const ai = groupOrder.indexOf(a);
    const bi = groupOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });

  for (const key of order) {
    const bucket = buckets[key];
    if (bucket.groupId) {
      const groupDef = groupDefinitions[bucket.groupId];
      const contentOrder = groupDef?.contentOrder ?? defaultContentOrder;
      if (contentOrder === 'title') {
        bucket.items.sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }),
        );
      }
    }
  }

  return order.map(key => {
    const bucket = buckets[key];
    if (bucket.groupId && bucket.items.length > 1 && bucket.groupTitle) {
      return {
        id: bucket.groupId,
        label: bucket.groupTitle,
        items: bucket.items,
      };
    }
    return bucket.items[0];
  });
}

function useOwnerUsers(entity: Entity | undefined) {
  const catalogApi = useApi(catalogApiRef);
  const entityRoute = useRouteRef(entityRouteRef);

  const ownerRefs: CompoundEntityRef[] = useMemo(
    () => (entity ? getEntityRelations(entity, RELATION_OWNED_BY) : []),
    [entity],
  );

  const ownerRefStrings = useMemo(
    () => ownerRefs.map(ref => stringifyEntityRef(ref)),
    [ownerRefs],
  );

  const { value: ownerEntities } = useAsync(async () => {
    if (ownerRefStrings.length === 0) return [];
    const response = await catalogApi.getEntitiesByRefs({
      entityRefs: ownerRefStrings,
      fields: [
        'kind',
        'metadata.name',
        'metadata.namespace',
        'metadata.title',
        'spec.profile',
      ],
    });
    return response.items;
  }, [ownerRefStrings, catalogApi]);

  return useMemo(() => {
    return ownerRefs.map((ref, index) => {
      const resolved = ownerEntities?.[index];
      const profile = (resolved?.spec as { profile?: { picture?: string } })
        ?.profile;
      return {
        name: resolved?.metadata.title ?? resolved?.metadata.name ?? ref.name,
        src: profile?.picture,
        href: entityRoute({
          kind: ref.kind.toLocaleLowerCase('en-US'),
          namespace: (ref.namespace ?? DEFAULT_NAMESPACE).toLocaleLowerCase(
            'en-US',
          ),
          name: ref.name,
        }),
      };
    });
  }, [ownerRefs, ownerEntities, entityRoute]);
}

function buildMetadata(
  entity: Entity | undefined,
  ownerUsers: ReturnType<typeof useOwnerUsers>,
): HeaderMetadataItem[] | undefined {
  if (!entity) return undefined;

  const items: HeaderMetadataItem[] = [];

  if (ownerUsers.length > 0) {
    items.push({
      label: ownerUsers.length === 1 ? 'Owner' : 'Owners',
      value: <HeaderMetadataUsers users={ownerUsers} />,
    });
  }

  const lifecycle = (entity.spec as { lifecycle?: string } | undefined)
    ?.lifecycle;
  if (lifecycle) {
    items.push({ label: 'Lifecycle', value: lifecycle });
  }

  const system = (entity.spec as { system?: string } | undefined)?.system;
  if (system) {
    items.push({
      label: 'System',
      value: (
        <EntityRefLink
          entityRef={parseEntityRef(system, {
            defaultKind: 'System',
            defaultNamespace: entity.metadata.namespace ?? DEFAULT_NAMESPACE,
          })}
          defaultKind="System"
        />
      ),
    });
  }

  const domain = (entity.spec as { domain?: string } | undefined)?.domain;
  if (domain) {
    items.push({
      label: 'Domain',
      value: (
        <EntityRefLink
          entityRef={parseEntityRef(domain, {
            defaultKind: 'Domain',
            defaultNamespace: entity.metadata.namespace ?? DEFAULT_NAMESPACE,
          })}
          defaultKind="Domain"
        />
      ),
    });
  }

  const partOf = getEntityRelations(entity, RELATION_PART_OF);
  if (partOf.length > 0 && !system && !domain) {
    items.push({
      label: 'Part of',
      value: (
        <>
          {partOf.map((ref, idx) => (
            <span key={stringifyEntityRef(ref)}>
              {idx > 0 ? ', ' : null}
              <EntityRefLink entityRef={ref} />
            </span>
          ))}
        </>
      ),
    });
  }

  return items.length > 0 ? items : undefined;
}

function FavoriteEntityButton(props: { entity: Entity }) {
  const { toggleStarredEntity, isStarredEntity } = useStarredEntity(
    props.entity,
  );
  return (
    <ButtonIcon
      variant="tertiary"
      aria-label={
        isStarredEntity ? 'Remove from favorites' : 'Add to favorites'
      }
      icon={isStarredEntity ? <RiStarFill /> : <RiStarLine />}
      onPress={() => toggleStarredEntity()}
    />
  );
}

function EntityContextMenuBui(props: { children: ReactNode }) {
  return (
    <MenuTrigger>
      <ButtonIcon
        variant="tertiary"
        aria-label="Open entity menu"
        icon={<RiMore2Line />}
      />
      <Menu placement="bottom end">{props.children}</Menu>
    </MenuTrigger>
  );
}

/** @alpha */
export interface EntityHeaderBuiProps {
  routes: EntityTabRoute[];
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder?: 'title' | 'natural';
  contextMenuItems?: ReactNode[];
}

/**
 * BUI-based entity page header. Renders the entity title, metadata,
 * favorite toggle, context menu, and grouped tabs using `@backstage/ui`.
 *
 * @alpha
 */
export function EntityHeaderBui(props: EntityHeaderBuiProps) {
  const {
    routes,
    groupDefinitions,
    defaultContentOrder = 'title',
    contextMenuItems,
  } = props;

  const { entity } = useAsyncEntity();
  const { name } = useRouteRefParams(entityRouteRef);
  const title = buildTitle(name, entity);

  const tabs = useMemo(
    () => buildHeaderTabs(routes, groupDefinitions, defaultContentOrder),
    [routes, groupDefinitions, defaultContentOrder],
  );

  const ownerUsers = useOwnerUsers(entity);
  const metadata = useMemo(
    () => buildMetadata(entity, ownerUsers),
    [entity, ownerUsers],
  );
  const description = entity?.metadata.description;

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedInspectTab = searchParams.get('inspect');
  const setInspectTab = useCallback(
    (newTab: string) =>
      setSearchParams(prev => {
        prev.set('inspect', newTab);
        return prev;
      }),
    [setSearchParams],
  );
  const closeInspectEntityDialog = useCallback(
    () =>
      setSearchParams(prev => {
        prev.delete('inspect');
        return prev;
      }),
    [setSearchParams],
  );
  const inspectDialogOpen = typeof selectedInspectTab === 'string';

  const customActions = entity ? (
    <>
      <FavoriteEntityButton entity={entity} />
      {contextMenuItems && contextMenuItems.length > 0 ? (
        <EntityContextMenuBui>{contextMenuItems}</EntityContextMenuBui>
      ) : null}
    </>
  ) : null;

  return (
    <>
      <Header
        title={title}
        description={description}
        metadata={metadata}
        customActions={customActions}
        tabs={entity ? tabs : undefined}
      />
      {entity && (
        <InspectEntityDialog
          entity={entity}
          initialTab={
            (selectedInspectTab as ComponentProps<
              typeof InspectEntityDialog
            >['initialTab']) || undefined
          }
          open={inspectDialogOpen}
          onClose={closeInspectEntityDialog}
          onSelect={setInspectTab}
        />
      )}
    </>
  );
}
