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
  DependencyGraph,
  DependencyGraphTypes,
  Link,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, useApp, useRouteRef } from '@backstage/core-plugin-api';
import { Box, DialogContentText, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../../api';
import { humanizeEntityRef } from '../../EntityRefLink';
import { entityRouteRef } from '../../../routes';
import { EntityKindIcon } from './EntityKindIcon';

const useStyles = makeStyles(theme => ({
  node: {
    fill: theme.palette.grey[300],
    stroke: theme.palette.grey[300],
    '&.primary': {
      fill: theme.palette.primary.light,
      stroke: theme.palette.primary.light,
    },
    '&.secondary': {
      fill: theme.palette.secondary.light,
      stroke: theme.palette.secondary.light,
    },
  },
  text: {
    fill: theme.palette.getContrastText(theme.palette.grey[300]),
    '&.primary': {
      fill: theme.palette.primary.contrastText,
    },
    '&.secondary': {
      fill: theme.palette.secondary.contrastText,
    },
    '&.focused': {
      fontWeight: 'bold',
    },
  },
  clickable: {
    cursor: 'pointer',
  },
}));

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
  const classes = useStyles();
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

  return (
    <g onClick={onClick} className={classes.clickable}>
      <rect
        className={classNames(
          classes.node,
          node.root ? 'secondary' : 'primary',
        )}
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      {hasKindIcon && (
        <EntityKindIcon
          kind={node.kind}
          y={padding}
          x={padding}
          width={iconSize}
          height={iconSize}
          className={classNames(
            classes.text,
            node.root ? 'secondary' : 'primary',
          )}
        />
      )}
      <text
        ref={idRef}
        className={classNames(
          classes.text,
          node.root ? 'secondary' : 'primary',
        )}
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
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <>
      <DialogContentText variant="h2">Ancestry</DialogContentText>
      <DialogContentText gutterBottom>
        This is the ancestry of entities above the current one - as in, the
        chain(s) of entities down to the current one, where{' '}
        <Link to="https://backstage.io/docs/features/software-catalog/life-of-an-entity">
          processors emitted
        </Link>{' '}
        child entities that ultimately led to the current one existing. Note
        that this is a completely different mechanism from relations.
      </DialogContentText>
      <Box mt={4}>
        <DependencyGraph
          nodes={nodes}
          edges={edges}
          renderNode={CustomNode}
          direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
          zoom="enable-on-click"
        />
      </Box>
    </>
  );
}
