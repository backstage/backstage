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

import React, { useMemo, useRef, useState } from 'react';
import type { Entry } from '../../utils/types';
import RadarPlot from '../RadarPlot';
import { RadarProps } from './types';
import { adjustEntries, adjustQuadrants, adjustRings } from './utils';

const Radar = ({
  width,
  height,
  quadrants,
  rings,
  entries,
  getRingColor,
  ...props
}: RadarProps): JSX.Element => {
  const radius = Math.min(width, height) / 2;

  // State
  const [activeEntry, setActiveEntry] = useState<Entry>();
  const node = useRef<SVGSVGElement>(null);

  // Adjusted props
  const adjustedQuadrants = useMemo(
    () => adjustQuadrants(quadrants, radius, width, height),
    [quadrants, radius, width, height],
  );
  const adjustedRings = useMemo(
    () => adjustRings(rings, radius),
    [radius, rings],
  );
  const adjustedEntries = useMemo(
    () =>
      adjustEntries(
        entries,
        adjustedQuadrants,
        adjustedRings,
        radius,
        activeEntry,
      ),
    [entries, adjustedQuadrants, adjustedRings, radius, activeEntry],
  );

  return (
    <svg ref={node} width={width} height={height} {...props.svgProps}>
      <RadarPlot
        getRingColor={getRingColor}
        width={width}
        height={height}
        radius={radius}
        entries={adjustedEntries}
        quadrants={adjustedQuadrants}
        rings={adjustedRings}
        activeEntry={activeEntry}
        onEntryMouseEnter={entry => setActiveEntry(entry)}
        onEntryMouseLeave={() => setActiveEntry(undefined)}
      />
    </svg>
  );
};

export default Radar;
