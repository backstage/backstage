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
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
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

const useStyles = makeStyles(
  theme => ({
    domainNode: {
      fill: theme.palette.primary.main,
      stroke: theme.palette.border,
    },
    systemNode: {
      fill: 'coral',
      stroke: theme.palette.border,
    },
    componentNode: {
      fill: 'yellowgreen',
      stroke: theme.palette.border,
    },
    apiNode: {
      fill: theme.palette.gold,
      stroke: theme.palette.border,
    },
    resourceNode: {
      fill: 'grey',
      stroke: theme.palette.border,
    },
  }),
  { name: 'PluginCatalogSystemDiagramCard' },
);

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
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const kind = props.node.kind || 'Component';
  const ref = parseEntityRef(props.node.id);
  const MAX_NAME_LENGTH = 20;
  const truncatedNodeName =
    props.node.name.length < MAX_NAME_LENGTH
      ? props.node.name
      : `${props.node.name.slice(0, MAX_NAME_LENGTH)}...`;
  let nodeClass = classes.componentNode;

  switch (kind) {
    case 'Domain':
      nodeClass = classes.domainNode;
      break;
    case 'System':
      nodeClass = classes.systemNode;
      break;
    case 'Component':
      nodeClass = classes.componentNode;
      break;
    case 'API':
      nodeClass = classes.apiNode;
      break;
    case 'Resource':
      nodeClass = classes.resourceNode;
      break;
    default:
      nodeClass = classes.componentNode;
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
  const theme = useTheme();
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
        paddingX={theme.spacing(4)}
        paddingY={theme.spacing(4)}
      />
      <Box m={1} />
      <Typography
        variant="caption"
        style={{ display: 'block', textAlign: 'right' }}
      >
        <ZoomOutMap style={{ verticalAlign: 'bottom' }} />
        {t('systemDiagramCard.description')}
      </Typography>
    </InfoCard>
  );
}
