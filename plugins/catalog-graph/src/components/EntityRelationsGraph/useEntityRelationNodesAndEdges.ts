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
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { RelationPairs } from '../../lib/types';
import { EntityEdge, EntityNode } from '../../lib/types';
import { useEntityRelationGraph } from './useEntityRelationGraph';
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { useRelations } from '../../hooks/useRelations';
import { buildGraph } from '../../lib/graph';
import {
  BuiltInTransformations,
  builtInTransformations,
  GraphTransformer,
  TransformationContext,
} from '../../lib/graph-transformations';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

type AnyTransformation = BuiltInTransformations | GraphTransformer;

/**
 * Generate nodes and edges to render the entity graph.
 */
export function useEntityRelationNodesAndEdges({
  rootEntityRefs,
  maxDepth = Number.POSITIVE_INFINITY,
  unidirectional = true,
  mergeRelations = true,
  kinds,
  relations,
  entityFilter,
  onNodeClick,
  relationPairs: incomingRelationPairs,
  transformations: userTransformations,
  noDefaultTransformations = false,
}: {
  rootEntityRefs: string[];
  maxDepth?: number;
  unidirectional?: boolean;
  mergeRelations?: boolean;
  kinds?: string[];
  relations?: string[];
  entityFilter?: (entity: Entity) => boolean;
  onNodeClick?: (value: EntityNode, event: MouseEvent<unknown>) => void;
  relationPairs?: RelationPairs;
  transformations?: (GraphTransformer | BuiltInTransformations)[];
  noDefaultTransformations?: boolean;
}): {
  loading: boolean;
  nodes?: EntityNode[];
  edges?: EntityEdge[];
  error?: Error;
} {
  const errorApi = useApi(errorApiRef);
  const [nodesAndEdges, setNodesAndEdges] = useState<{
    nodes?: EntityNode[];
    edges?: EntityEdge[];
  }>({});

  const { entities, loading, error } = useEntityRelationGraph({
    rootEntityRefs,
    filter: {
      maxDepth,
      kinds,
      relations,
      entityFilter,
    },
  });

  const { relationPairs, includeRelation } = useRelations({
    relations,
    relationPairs: incomingRelationPairs,
  });

  const transformations = useMemo(() => {
    return userTransformations?.filter(transformation => {
      if (
        typeof transformation !== 'function' &&
        !builtInTransformations[transformation]
      ) {
        errorApi.post(
          new Error(`Unknown graph transformation: ${transformation}`),
        );
        return false;
      }
      return true;
    });
  }, [userTransformations, errorApi]);

  const appliedTransformations = useMemo((): AnyTransformation[] => {
    const curTransformations: AnyTransformation[] = [];

    if (!noDefaultTransformations) {
      curTransformations.push('reduce-edges');
      curTransformations.push('set-distances');
      if (unidirectional) {
        curTransformations.push('strip-distant-edges');
      }
      if (mergeRelations || unidirectional) {
        // Merge relations even if only unidirectional, the next transformer
        // 'remove-backward-edges' needs to know about all relations before it
        // strips away the backward ones
        curTransformations.push('merge-relations');
      }
      if (unidirectional && !mergeRelations) {
        curTransformations.push('order-forward');
        curTransformations.push('remove-backward-edges');
      }
    }

    curTransformations.push(...(transformations ?? []));

    return curTransformations;
  }, [
    transformations,
    noDefaultTransformations,
    unidirectional,
    mergeRelations,
  ]);

  useEffect(() => {
    if (loading || error) {
      return;
    }

    const nodes = Object.entries(entities).map(([entityRef, entity]) => {
      const focused = rootEntityRefs.includes(entityRef);
      const node: EntityNode = {
        id: entityRef,
        entity,
        focused,
        color: focused ? 'secondary' : 'primary',
        // @deprecated
        kind: entity.kind,
        name: entity.metadata.name,
        namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
        title: entity.metadata.title,
        spec: entity.spec,
      };

      if (onNodeClick) {
        node.onClick = event => onNodeClick(node, event);
      }

      return node;
    });

    const edges = buildGraph({
      rootEntityRefs,
      entities,
      includeRelation,
      kinds,
      mergeRelations,
      relationPairs,
      unidirectional,
    });

    const transformationContext: TransformationContext = {
      nodeDistances: new Map(),
      edges,
      nodes,

      rootEntityRefs,
      unidirectional,
      maxDepth,
    };

    const runTransformation = (
      transformation: BuiltInTransformations | GraphTransformer,
    ) => {
      if (typeof transformation === 'function') {
        transformation(transformationContext);
      } else {
        builtInTransformations[transformation](transformationContext);
      }
    };

    for (const transformation of appliedTransformations) {
      runTransformation(transformation);
    }

    setNodesAndEdges({
      nodes: transformationContext.nodes,
      edges: transformationContext.edges,
    });
  }, [
    loading,
    error,
    maxDepth,
    entities,
    rootEntityRefs,
    kinds,
    includeRelation,
    unidirectional,
    mergeRelations,
    onNodeClick,
    relationPairs,
    appliedTransformations,
  ]);

  return {
    loading,
    error,
    ...nodesAndEdges,
  };
}
