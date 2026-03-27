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

import { useState, useRef, useLayoutEffect } from 'react';
import { DependencyGraphTypes as Types } from './types';

/** @public */
export type DependencyGraphDefaultNodeClassKey = 'node' | 'text';

/** @public */
export function DefaultNode({ node: { id } }: Types.RenderNodeProps) {
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
  const paddedWidth = width + padding * 2;
  const paddedHeight = height + padding * 2;

  return (
    <g>
      <rect
        style={{ fill: 'var(--primary)', stroke: 'var(--primary)' }}
        width={paddedWidth}
        height={paddedHeight}
        rx={10}
      />
      <text
        ref={idRef}
        style={{ fill: 'var(--primary-foreground)' }}
        y={paddedHeight / 2}
        x={paddedWidth / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {id}
      </text>
    </g>
  );
}
