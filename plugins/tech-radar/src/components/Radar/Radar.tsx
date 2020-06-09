/*
 * Copyright 2020 Spotify AB
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

import React, { FC, useState, useRef } from 'react';
import RadarPlot from '../RadarPlot';
import { Ring, Quadrant, Entry } from '../../utils/types';
import { adjustQuadrants, adjustRings, adjustEntries } from './utils';

type Props = {
  width: number;
  height: number;
  quadrants: Quadrant[];
  rings: Ring[];
  entries: Entry[];
  svgProps?: object;
};

const Radar: FC<Props> = props => {
  const { width, height, quadrants, rings, entries } = props;
  const radius = Math.min(width, height) / 2;

  const [activeEntry, setActiveEntry] = useState<Entry | null>();
  const node = useRef<SVGSVGElement>(null);

  // TODO(dflemstr): most of this can be heavily memoized if performance becomes a problem
  adjustQuadrants(quadrants, radius, width, height);
  adjustRings(rings, radius);
  adjustEntries(entries, activeEntry, quadrants, rings, radius);

  return (
    <svg ref={node} width={width} height={height} {...props.svgProps}>
      <RadarPlot
        width={width}
        height={height}
        radius={radius}
        entries={entries}
        quadrants={quadrants}
        rings={rings}
        activeEntry={activeEntry || undefined}
        onEntryMouseEnter={entry => setActiveEntry(entry)}
        onEntryMouseLeave={() => setActiveEntry(null)}
      />
    </svg>
  );
};

export default Radar;
