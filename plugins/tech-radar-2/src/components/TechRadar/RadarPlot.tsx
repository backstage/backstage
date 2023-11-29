/*
 * Copyright 2023 The Backstage Authors
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
import React, { FC, useMemo } from 'react';

import { Entry, Quadrant, Ring } from '../../types';

import RadarEntry from './RadarEntry';
import RadarGrid, { QuadrantGrid } from './RadarGrid';

// A component that draws the radar circle.
const RadarPlot: FC<RadarPlotProps> = ({ size, radius, rings, quadrants, entries }) => {
  const activeQuadrant = quadrants.length === 1 ? quadrants[0] : undefined;

  const translate = useMemo(() => {
    if (!activeQuadrant) return `${size / 2}, ${radius + 20}`;
    const xOffset = activeQuadrant.offsetX * (radius / 2);
    const yOffset = activeQuadrant.offsetY === -1 ? 0 : radius - 40;
    return `${size / 2 - xOffset}, ${radius - yOffset}`;
  }, [activeQuadrant, radius, size]);

  return (
    <g transform={`translate(${translate})`}>
      {activeQuadrant && <QuadrantGrid radius={radius} quadrant={activeQuadrant} rings={rings} ringLabels />}
      {!activeQuadrant && <RadarGrid radius={radius} rings={rings} quadrants={quadrants} />}
      {entries
        .filter(e => !activeQuadrant || activeQuadrant.id === e.category)
        .map(
          entry =>
            !!entry.x &&
            !!entry.y &&
            !!entry.color && (
              <RadarEntry
                key={entry.id}
                x={entry.x}
                y={entry.y}
                color={entry.color}
                inactive={entry.inactive}
                url={entry.url}
                goldenTech={entry.goldenTech}
                title={entry.title}
              />
            ),
        )}
    </g>
  );
};

interface RadarPlotProps {
  size: number;
  radius: number;
  rings: Ring[];
  quadrants: Quadrant[];
  entries: Entry[];
}

export default RadarPlot;
