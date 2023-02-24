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

import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import React from 'react';
import { Quadrant, Ring } from '../../utils/types';
import { RadarLegendRing } from './RadarLegendRing';
import { RadarLegendProps, Segments } from './types';
import { getSegment } from './utils';

type RadarLegendQuadrantProps = {
  segments: Segments;
  quadrant: Quadrant;
  rings: Ring[];
  classes: ClassNameMap<string>;
  onEntryMouseEnter: RadarLegendProps['onEntryMouseEnter'];
  onEntryMouseLeave: RadarLegendProps['onEntryMouseLeave'];
};

export const RadarLegendQuadrant = ({
  segments,
  quadrant,
  rings,
  classes,
  onEntryMouseEnter,
  onEntryMouseLeave,
}: RadarLegendQuadrantProps) => {
  return (
    <foreignObject
      key={quadrant.id}
      x={quadrant.legendX}
      y={quadrant.legendY}
      width={quadrant.legendWidth}
      height={quadrant.legendHeight}
      data-testid="radar-quadrant"
    >
      <div className={classes.quadrant}>
        <h2 className={classes.quadrantHeading}>{quadrant.name}</h2>
        <div className={classes.rings}>
          {rings.map(ring => (
            <RadarLegendRing
              key={ring.id}
              ring={ring}
              classes={classes}
              entries={getSegment(segments, quadrant, ring)}
              onEntryMouseEnter={onEntryMouseEnter}
              onEntryMouseLeave={onEntryMouseLeave}
            />
          ))}
        </div>
      </div>
    </foreignObject>
  );
};
