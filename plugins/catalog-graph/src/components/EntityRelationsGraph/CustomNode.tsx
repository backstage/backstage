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
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
//import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { EntityKindIcon } from './EntityKindIcon';
import { EntityNodeData } from './types';
import { createTheme, Theme } from '@material-ui/core';
import { Palette } from '@material-ui/core/styles/createPalette';
import {
  blue,
  green,
  grey,
  orange,
  purple,
  red,
} from '@material-ui/core/colors';

//in mui v5
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    catalogGraph?: {
      component?: string;
      domain?: string;
      system?: string;
      location?: string;
      resource?: string;
      group?: string;
      user?: string;
      template?: string;
      api?: string;
    };
  }
}

type graphPalette = Palette & PaletteOptions;

interface customTheme extends Theme {
  palette: graphPalette;
}

const customNodeTheme: customTheme = createTheme({
  palette: {
    catalogGraph: {
      component: red[500],
      domain: green[300],
      system: purple[500],
      location: orange[300],
      resource: purple[300],
      group: blue[500],
      user: grey[300],
      template: red[300],
      api: green[500],
    },
  },
});

const useStyles = makeStyles((theme: customTheme) => ({
  node: {
    fill: (props: { [key: string]: undefined }) =>
      props?.kind && customNodeTheme.palette?.catalogGraph
        ? customNodeTheme.palette.catalogGraph?.[props?.kind]
        : theme.palette.grey[300],
    stroke: theme.palette.catalogGraph?.domain,

    '&.primary': {
      fill: (props: { [key: string]: undefined }) =>
        props?.kind && customNodeTheme.palette.catalogGraph
          ? customNodeTheme.palette.catalogGraph?.[props?.kind]
          : theme.palette.grey[300],
      stroke: theme.palette.grey[300],
    },
    '&.secondary': {
      fill: (props: { [key: string]: undefined }) =>
        props?.kind && customNodeTheme.palette.catalogGraph
          ? customNodeTheme.palette.catalogGraph?.[props?.kind]
          : theme.palette.grey[300],
      stroke: theme.palette.grey[300],
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

export function CustomNode({
  node: {
    id,
    kind,
    namespace,
    name,
    color = 'default',
    focused,
    title,
    onClick,
  },
}: DependencyGraphTypes.RenderNodeProps<EntityNodeData>) {
  const styleProps: any = {
    kind: kind?.toLocaleLowerCase('en-US'),
  };
  const classes = useStyles({ ...styleProps });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
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

  const padding = 10;
  const iconSize = height;
  const paddedIconWidth = kind ? iconSize + padding : 0;
  const paddedWidth = paddedIconWidth + width + padding * 2;
  const paddedHeight = height + padding * 2;

  const displayTitle =
    title ??
    (kind && name && namespace
      ? humanizeEntityRef({ kind, name, namespace })
      : id);

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
      {kind && (
        <EntityKindIcon
          kind={kind}
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
    </g>
  );
}
