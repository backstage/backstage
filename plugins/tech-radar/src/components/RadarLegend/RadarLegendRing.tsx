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
import Typography from '@material-ui/core/Typography/Typography';
import React from 'react';
import { Entry, Ring } from '../../utils/types';
import { RadarLegendLink } from './RadarLegendLink';
import { RadarLegendProps } from './types';

type RadarLegendRingProps = {
  ring: Ring;
  entries: Entry[];
  classes: ClassNameMap<string>;
  onEntryMouseEnter?: RadarLegendProps['onEntryMouseEnter'];
  onEntryMouseLeave?: RadarLegendProps['onEntryMouseEnter'];
};

export const RadarLegendRing = ({
  ring,
  entries,
  classes,
  onEntryMouseEnter,
  onEntryMouseLeave,
}: RadarLegendRingProps) => {
  return (
    <div data-testid="radar-ring" key={ring.id} className={classes.ring}>
      <h3 className={classes.ringHeading}>{ring.name}</h3>
      {entries.length === 0 ? (
        <Typography paragraph className={classes.ringEmpty}>
          (empty)
        </Typography>
      ) : (
        <ol className={classes.ringList}>
          {entries.map(entry => (
            <li
              key={entry.id}
              value={(entry.index || 0) + 1}
              onMouseEnter={
                onEntryMouseEnter && (() => onEntryMouseEnter(entry))
              }
              onMouseLeave={
                onEntryMouseLeave && (() => onEntryMouseLeave(entry))
              }
            >
              <RadarLegendLink
                classes={classes}
                url={entry.url}
                title={entry.title}
                description={entry.description}
                active={entry.active}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
