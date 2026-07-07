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

import { useMemo } from 'react';
import {
  Box,
  ButtonIcon,
  Header,
  HeaderMetadataUsers,
  Link,
  type HeaderMetadataItem,
  type HeaderMetadataUser,
  type HeaderNavTabItem,
} from '@backstage/ui';
import {
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
  stringifyEntityRef,
  type CompoundEntityRef,
} from '@backstage/catalog-model';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  catalogApiRef,
  catalogReactTranslationRef,
  entityRouteRef,
  getEntityRelations,
  useAsyncEntity,
  useEntityPresentation,
  useEntityRefLink,
  useStarredEntity,
} from '@backstage/plugin-catalog-react';
import { RiStarFill, RiStarLine } from '@remixicon/react';
import useAsync from 'react-use/esm/useAsync';
import { catalogTranslationRef } from '../../translation';
import {
  EntityContextMenu,
  type EntityContextMenuItemDataWithNode,
} from '../EntityContextMenu';

function useOwnerUsers(entity: Entity | undefined): HeaderMetadataUser[] {
  const catalogApi = useApi(catalogApiRef);
  const entityLink = useEntityRefLink();
  const ownerRefs = useMemo(
    () => getEntityRelations(entity, RELATION_OWNED_BY),
    [entity],
  );
  const ownerRefStrings = useMemo(
    () => ownerRefs.map(ref => stringifyEntityRef(ref)),
    [ownerRefs],
  );
  const { value: ownerEntities } = useAsync(async () => {
    if (ownerRefStrings.length === 0) return [];
    return (
      await catalogApi.getEntitiesByRefs({
        entityRefs: ownerRefStrings,
        fields: [
          'kind',
          'metadata.name',
          'metadata.namespace',
          'metadata.title',
          'spec.profile',
        ],
      })
    ).items;
  }, [catalogApi, ownerRefStrings]);

  return ownerRefs.map((ref, index) => {
    const owner = ownerEntities?.[index];
    const profile = (owner?.spec as { profile?: { picture?: string } })
      ?.profile;
    return {
      name: owner?.metadata.title ?? owner?.metadata.name ?? ref.name,
      src: profile?.picture,
      href: entityLink(ref),
    };
  });
}

function HierarchyLinks(props: { refs: CompoundEntityRef[] }) {
  const entityLink = useEntityRefLink();
  return (
    <Box as="ul" display="inline" m="0" p="0" style={{ listStyle: 'none' }}>
      {props.refs.map((ref, index) => (
        <Box as="li" display="inline" key={stringifyEntityRef(ref)}>
          {index > 0 ? ', ' : null}
          <Link href={entityLink(ref)} standalone>
            {ref.name}
          </Link>
        </Box>
      ))}
    </Box>
  );
}

function hierarchyLabel(
  ref: CompoundEntityRef,
): 'systemLabel' | 'domainLabel' | 'partOfLabel' {
  switch (ref.kind.toLocaleLowerCase('en-US')) {
    case 'system':
      return 'systemLabel';
    case 'domain':
      return 'domainLabel';
    default:
      return 'partOfLabel';
  }
}

function useMetadata(entity: Entity | undefined): HeaderMetadataItem[] {
  const owners = useOwnerUsers(entity);
  const { t } = useTranslationRef(catalogTranslationRef);
  return useMemo(() => {
    if (!entity) return [];
    const metadata: HeaderMetadataItem[] = [];
    const lifecycle = entity.spec?.lifecycle?.toString();
    if (lifecycle) {
      metadata.push({
        label: t('entityLabels.lifecycleLabel'),
        value: lifecycle,
      });
    }
    if (owners.length > 0) {
      metadata.push({
        label: t('entityLabels.ownerLabel'),
        value: <HeaderMetadataUsers users={owners} />,
      });
    }

    const hierarchy = getEntityRelations(entity, RELATION_PART_OF).reduce(
      (groups, ref) => {
        const label = hierarchyLabel(ref);
        groups[label] = [...(groups[label] ?? []), ref];
        return groups;
      },
      {} as Record<string, CompoundEntityRef[]>,
    );
    for (const [label, refs] of Object.entries(hierarchy)) {
      metadata.push({
        label: t(
          `entityLabels.${label}` as
            | 'entityLabels.systemLabel'
            | 'entityLabels.domainLabel'
            | 'entityLabels.partOfLabel',
        ),
        value: <HierarchyLinks refs={refs} />,
      });
    }
    return metadata;
  }, [entity, owners, t]);
}

function FavoriteEntityButton(props: { entity: Entity }) {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const { isStarredEntity, toggleStarredEntity } = useStarredEntity(
    props.entity,
  );
  return (
    <ButtonIcon
      variant="secondary"
      aria-label={
        isStarredEntity
          ? t('favoriteEntity.removeFromFavorites')
          : t('favoriteEntity.addToFavorites')
      }
      icon={isStarredEntity ? <RiStarFill /> : <RiStarLine />}
      onPress={() => toggleStarredEntity()}
    />
  );
}

export function EntityHeaderBui(props: {
  tabs: HeaderNavTabItem[];
  activeTabId?: string;
  contextMenuItems?: EntityContextMenuItemDataWithNode[];
}) {
  const { entity } = useAsyncEntity();
  const routeParams = useRouteRefParams(entityRouteRef);
  const presentation = useEntityPresentation(entity ?? routeParams);
  const metadata = useMetadata(entity);
  const type = entity?.spec?.type?.toString();

  return (
    <Header
      title={presentation.primaryTitle}
      tags={[
        { label: entity?.kind ?? routeParams.kind },
        ...(type ? [{ label: type }] : []),
      ]}
      metadata={metadata}
      tabs={entity ? props.tabs : undefined}
      activeTabId={props.activeTabId}
      customActions={
        entity ? (
          <>
            <FavoriteEntityButton entity={entity} />
            <EntityContextMenu contextMenuItems={props.contextMenuItems} />
          </>
        ) : undefined
      }
    />
  );
}
