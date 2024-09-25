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
import { DependencyGraphTypes } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';
import { useEntityPresentation } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { EntityIcon } from './EntityIcon';
import { EntityNodeData } from './types';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';

/** @public */
export type CustomNodeClassKey = 'node' | 'text' | 'clickable';

const useStyles = makeStyles(
  theme => ({
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
  }),
  { name: 'PluginCatalogGraphCustomNode' },
);

export function DefaultRenderNode({
  node: { id, entity, color = 'default', focused, onClick },
}: DependencyGraphTypes.RenderNodeProps<EntityNodeData>) {
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const idRef = useRef<SVGTextElement | null>(null);
  const entityRefPresentationSnapshot = useEntityPresentation(entity, {
    defaultNamespace: DEFAULT_NAMESPACE,
  });

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

  const hasKindIcon = !!entityRefPresentationSnapshot.Icon;
  const padding = 10;
  const iconSize = height;
  const paddedIconWidth = hasKindIcon ? iconSize + padding : 0;
  const paddedWidth = paddedIconWidth + width + padding * 2;
  const paddedHeight = height + padding * 2;

  const displayTitle = entityRefPresentationSnapshot.primaryTitle ?? id;

  return (
    <g onClick={onClick} className={classNames(onClick && classes.clickable)}>
      <rect
        className={classNames(
          classes.node,
          color === 'primary' && 'primary',
          color === 'secondary' && 'secondary',
        )}
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      {hasKindIcon && (
        <EntityIcon
          icon={entityRefPresentationSnapshot.Icon as IconComponent}
          y={padding}
          x={padding}
          width={iconSize}
          height={iconSize}
          className={classNames(
            classes.text,
            focused && 'focused',
            color === 'primary' && 'primary',
            color === 'secondary' && 'secondary',
          )}
        />
      )}
      <text
        ref={idRef}
        className={classNames(
          classes.text,
          focused && 'focused',
          color === 'primary' && 'primary',
          color === 'secondary' && 'secondary',
        )}
        y={paddedHeight / 2}
        x={paddedIconWidth + (width + padding * 2) / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {displayTitle}
      </text>
      <title>{entityRefPresentationSnapshot.entityRef}</title>
    </g>
  );
}
