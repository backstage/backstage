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
  Entity,
  RELATION_DEPENDS_ON,
  RELATION_PROVIDES_API,
  RELATION_PART_OF,
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
  parseEntityRef,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityRouteRef,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { Maximize2 } from 'lucide-react';
import useAsync from 'react-use/esm/useAsync';

import {
  DependencyGraph,
  DependencyGraphTypes,
  InfoCard,
  Progress,
  ResponseErrorPanel,
  Link,
} from '@backstage/core-components';

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export type SystemDiagramCardClassKey =
  | 'domainNode'
  | 'systemNode'
  | 'componentNode'
  | 'apiNode'
  | 'resourceNode';

/**
 * Tailwind CSS class mappings for diagram node styling per entity kind.
 * Uses CSS custom properties for theme-aware colors; named CSS colors
 * (coral, yellowgreen, grey) are retained as they are not theme-dependent.
 */
const nodeStyles: Record<string, string> = {
  domainNode: 'fill-[var(--primary)] stroke-[var(--border)]',
  systemNode: 'fill-[coral] stroke-[var(--border)]',
  componentNode: 'fill-[yellowgreen] stroke-[var(--border)]',
  apiNode: 'fill-[var(--gold)] stroke-[var(--border)]',
  resourceNode: 'fill-[grey] stroke-[var(--border)]',
};

// Simplifies the diagram output by hiding the default namespace and kind
function readableEntityName(
  ref:
    | Entity
    | {
        kind: string;
        namespace?: string;
        name: string;
      },
): string {
  return stringifyEntityRef(ref)
    .toLocaleLowerCase('en-US')
    .replace(`:${DEFAULT_NAMESPACE}/`, ':')
    .split(':')[1];
}

function RenderNode(props: DependencyGraphTypes.RenderNodeProps<any>) {
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const kind = props.node.kind || 'Component';
  const ref = parseEntityRef(props.node.id);
  const MAX_NAME_LENGTH = 20;
  const truncatedNodeName =
    props.node.name.length < MAX_NAME_LENGTH
      ? props.node.name
      : `${props.node.name.slice(0, MAX_NAME_LENGTH)}...`;

  let nodeClass: string;
  switch (kind) {
    case 'Domain':
      nodeClass = nodeStyles.domainNode;
      break;
    case 'System':
      nodeClass = nodeStyles.systemNode;
      break;
    case 'Component':
      nodeClass = nodeStyles.componentNode;
      break;
    case 'API':
      nodeClass = nodeStyles.apiNode;
      break;
    case 'Resource':
      nodeClass = nodeStyles.resourceNode;
      break;
    default:
      nodeClass = nodeStyles.componentNode;
  }

  return (
    <g>
      <rect width={200} height={100} rx={20} className={nodeClass} />
      <Link
        to={catalogEntityRoute({
          kind: kind,
          namespace: ref.namespace,
          name: ref.name,
        })}
      >
        <text
          x={100}
          y={45}
          textAnchor="middle"
          alignmentBaseline="baseline"
          style={{ fontWeight: 'bold' }}
        >
          {truncatedNodeName}
        </text>
      </Link>

      <text x={100} y={65} textAnchor="middle" alignmentBaseline="hanging">
        {props.node.kind}
      </text>
    </g>
  );
}

/**
 * Dynamically generates a diagram of a system, its assigned entities,
 * and relationships of those entities.
 */
export function SystemDiagramCard() {
  const { entity } = useEntity();
  const { t } = useTranslationRef(catalogTranslationRef);
  const currentSystemName = entity.metadata.name;
  const currentSystemNode = stringifyEntityRef(entity);
  const systemNodes = new Array<{ id: string; kind: string; name: string }>();
  const systemEdges = new Array<{ from: string; to: string; label: string }>();

  const catalogApi = useApi(catalogApiRef);
  const {
    loading,
    error,
    value: catalogResponse,
  } = useAsync(() => {
    return catalogApi.getEntities({
      filter: {
        kind: ['Component', 'API', 'Resource', 'System', 'Domain'],
        'spec.system': [
          currentSystemName,
          `${
            entity.metadata.namespace || DEFAULT_NAMESPACE
          }/${currentSystemName}`,
        ],
      },
    });
  }, [catalogApi, currentSystemName]);

  // pick out the system itself
  systemNodes.push({
    id: currentSystemNode,
    kind: 'System',
    name: readableEntityName(entity),
  });

  // check if the system has an assigned domain
  // even if the domain object doesn't exist in the catalog, display it in the map
  const catalogItemDomain = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'Domain',
  });
  catalogItemDomain.forEach(foundDomain =>
    systemNodes.push({
      id: stringifyEntityRef(foundDomain),
      kind: foundDomain.kind,
      name: readableEntityName(foundDomain),
    }),
  );
  catalogItemDomain.forEach(foundDomain =>
    systemEdges.push({
      from: currentSystemNode,
      to: stringifyEntityRef(foundDomain),
      label: t('systemDiagramCard.edgeLabels.partOf'),
    }),
  );

  if (catalogResponse && catalogResponse.items) {
    for (const catalogItem of catalogResponse.items) {
      systemNodes.push({
        id: stringifyEntityRef(catalogItem),
        kind: catalogItem.kind,
        name: readableEntityName(catalogItem),
      });

      // Check relations of the entity assigned to this system to see
      // if it relates to other entities.
      // Note those relations may, or may not, be explicitly
      // assigned to the system.
      const catalogItemRelations_partOf = getEntityRelations(
        catalogItem,
        RELATION_PART_OF,
      );
      catalogItemRelations_partOf.forEach(foundRelation =>
        systemEdges.push({
          from: stringifyEntityRef(catalogItem),
          to: stringifyEntityRef(foundRelation),
          label: t('systemDiagramCard.edgeLabels.partOf'),
        }),
      );

      const catalogItemRelations_providesApi = getEntityRelations(
        catalogItem,
        RELATION_PROVIDES_API,
      );
      catalogItemRelations_providesApi.forEach(foundRelation =>
        systemEdges.push({
          from: stringifyEntityRef(catalogItem),
          to: stringifyEntityRef(foundRelation),
          label: t('systemDiagramCard.edgeLabels.provides'),
        }),
      );

      const catalogItemRelations_dependsOn = getEntityRelations(
        catalogItem,
        RELATION_DEPENDS_ON,
      );
      catalogItemRelations_dependsOn.forEach(foundRelation =>
        systemEdges.push({
          from: stringifyEntityRef(catalogItem),
          to: stringifyEntityRef(foundRelation),
          label: t('systemDiagramCard.edgeLabels.dependsOn'),
        }),
      );
    }
  }

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <InfoCard title={t('systemDiagramCard.title')}>
      <DependencyGraph
        nodes={systemNodes}
        edges={systemEdges}
        nodeMargin={10}
        direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
        renderNode={RenderNode}
        paddingX={32}
        paddingY={32}
      />
      <div className="mt-2" />
      <p className="block text-right text-xs text-muted-foreground">
        <Maximize2 className="inline-block h-4 w-4 align-bottom" />
        {t('systemDiagramCard.description')}
      </p>
    </InfoCard>
  );
}
