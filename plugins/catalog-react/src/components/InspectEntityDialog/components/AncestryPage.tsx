/*
 * Copyright 2022 The Backstage Authors
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
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  cn,
  DependencyGraph,
  DependencyGraphTypes,
  Link,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, useApp, useRouteRef } from '@backstage/core-plugin-api';
import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../../api';
import { humanizeEntityRef } from '../../EntityRefLink';
import { entityRouteRef } from '../../../routes';
import { EntityKindIcon } from './EntityKindIcon';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type NodeType = Entity & { root: boolean };

function useAncestry(root: Entity): {
  loading: boolean;
  error?: Error;
  nodes: DependencyGraphTypes.DependencyNode<NodeType>[];
  edges: DependencyGraphTypes.DependencyEdge[];
} {
  const catalogClient = useApi(catalogApiRef);
  const entityRef = stringifyEntityRef(root);

  const { loading, error, value } = useAsync(async () => {
    const response = await catalogClient.getEntityAncestors({ entityRef });
    const nodes = new Array<DependencyGraphTypes.DependencyNode<NodeType>>();
    const edges = new Array<DependencyGraphTypes.DependencyEdge>();
    for (const current of response.items) {
      const currentRef = stringifyEntityRef(current.entity);
      const isRootNode = currentRef === response.rootEntityRef;
      nodes.push({ id: currentRef, root: isRootNode, ...current.entity });
      for (const parentRef of current.parentEntityRefs) {
        edges.push({ from: currentRef, to: parentRef });
      }
    }
    return { nodes, edges };
  }, [entityRef]);

  return {
    loading,
    error,
    nodes: value?.nodes || [],
    edges: value?.edges || [],
  };
}

function CustomNode({ node }: DependencyGraphTypes.RenderNodeProps<NodeType>) {
  const navigate = useNavigate();
  const entityRoute = useRouteRef(entityRouteRef);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const app = useApp();
  const idRef = useRef<SVGTextElement | null>(null);

  useLayoutEffect(() => {
    // set the width to the length of the ID
    if (idRef.current) {
      let { height: renderedHeight, width: renderedWidth } =
        idRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);
      if (renderedHeight !== height || renderedWidth !== width) {
        setWidth(renderedWidth);
        setHeight(renderedHeight);
      }
    }
  }, [width, height]);

  const hasKindIcon = app.getSystemIcon(
    `kind:${node.kind.toLocaleLowerCase('en-US')}`,
  );
  const padding = 10;
  const iconSize = height;
  const paddedIconWidth = hasKindIcon ? iconSize + padding : 0;
  const paddedWidth = paddedIconWidth + width + padding * 2;
  const paddedHeight = height + padding * 2;

  const displayTitle =
    node.metadata.title ||
    (node.kind && node.metadata.name && node.metadata.namespace
      ? humanizeEntityRef({
          kind: node.kind,
          name: node.metadata.name,
          namespace: node.metadata.namespace || '',
        })
      : node.id);

  const onClick = () => {
    navigate(
      entityRoute({
        kind: node.kind,
        namespace: node.metadata.namespace || DEFAULT_NAMESPACE,
        name: node.metadata.name,
      }),
    );
  };

  /* SVG fill/stroke use CSS custom properties inline because SVG elements
     do not support Tailwind utility classes for fill and stroke. */
  const nodeFill = node.root ? 'hsl(var(--secondary))' : 'hsl(var(--primary))';
  const textFill = node.root
    ? 'hsl(var(--secondary-foreground))'
    : 'hsl(var(--primary-foreground))';

  return (
    <g onClick={onClick} className={cn('cursor-pointer')}>
      <rect
        style={{ fill: nodeFill, stroke: nodeFill }}
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      {hasKindIcon && (
        <g style={{ color: textFill }}>
          <EntityKindIcon
            kind={node.kind}
            y={padding}
            x={padding}
            width={iconSize}
            height={iconSize}
          />
        </g>
      )}
      <text
        ref={idRef}
        style={{ fill: textFill }}
        y={paddedHeight / 2}
        x={paddedIconWidth + (width + padding * 2) / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {displayTitle}
      </text>
    </g>
  );
}

export function AncestryPage(props: { entity: Entity }) {
  const { loading, error, nodes, edges } = useAncestry(props.entity);
  const { t } = useTranslationRef(catalogReactTranslationRef);
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold">
        {t('inspectEntityDialog.ancestryPage.title')}
      </h2>
      <p className="mb-4 text-muted-foreground">
        {t('inspectEntityDialog.ancestryPage.description', {
          processorsLink: (
            <Link to="https://backstage.io/docs/features/software-catalog/life-of-an-entity">
              {t('inspectEntityDialog.ancestryPage.processorsLink')}
            </Link>
          ),
        })}
      </p>
      <div className="mt-4">
        <DependencyGraph
          nodes={nodes}
          edges={edges}
          renderNode={CustomNode}
          direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
          zoom="enable-on-click"
        />
      </div>
    </>
  );
}
