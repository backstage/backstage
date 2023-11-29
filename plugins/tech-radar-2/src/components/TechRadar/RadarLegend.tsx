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
import React, { FC, useMemo, useState } from 'react';

import { Button, makeStyles, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import _ from 'lodash';

import { Entry, Quadrant, Ring } from '../../types';

import { BlipIcon, GoldenTechBlipIcon } from './Blip';

const ENTRIES_PER_SECTION = 10;
const GOLDEN_TECH_SECTION_ID = 'golden_tech';

const useStyles = makeStyles(theme => ({
  quadrants: {
    display: 'grid',
    'grid-template-columns': '1fr 1fr 1fr 1fr',
    'grid-gap': '10px',
  },

  quadrant: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },

  ringList: {
    columnCount: 2,
    '$quadrants &': {
      columnCount: 1,
    },
  },

  ring: {
    marginTop: 0,
    marginBottom: theme.spacing(3),
  },

  ringHeading: {
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      color: '#2E77D0',
    },
  },

  hidden: {
    display: 'none',
  },

  inactive: {
    color: theme.palette.text.disabled,
  },
}));

interface RadarRingProps {
  title: string;
  icon: JSX.Element;
  entries: Entry[];
}

const RadarRing: FC<RadarRingProps> = ({ title, icon, entries }) => {
  const classes = useStyles();
  const [showAll, setShowAll] = useState(false);

  if (entries.length === 0) {
    return null;
  }

  const entriesToShow = showAll ? entries : entries.slice(0, ENTRIES_PER_SECTION);
  const isExpandable = entries.length > ENTRIES_PER_SECTION;

  return (
    <dl className={classes.ring}>
      <div style={{ breakInside: 'avoid' }}>
        <Typography variant="body2" component="dt" gutterBottom className={classes.ringHeading}>
          {title}
          {icon}
        </Typography>

        {entriesToShow.map(entry => {
          const url = entry.url || '#';

          return (
            <Typography
              key={entry.id}
              variant="body2"
              component="dd"
              className={classnames({ [classes.hidden]: entry.inactive })}
              gutterBottom
            >
              <a href={url} className={classes.entry}>
                <span>{entry.title}</span>
                <ChevronRightIcon color="disabled" />
              </a>
            </Typography>
          );
        })}

        {isExpandable && (
          <Button
            size="small"
            onClick={() => setShowAll(!showAll)}
            startIcon={showAll ? <ExpandLess /> : <ExpandMore />}
          >
            {showAll ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>
    </dl>
  );
};

interface RadarQuadrantProps {
  entries: Entry[];
  quadrant: Quadrant;
  rings: Ring[];
}

const RadarQuadrant: FC<RadarQuadrantProps> = ({ entries, quadrant, rings }) => {
  const classes = useStyles();
  const lifecycles = useMemo(() => {
    return _.groupBy(entries, e => (e.goldenTech ? GOLDEN_TECH_SECTION_ID : e.lifecycle));
  }, [entries]);
  const inactive = useMemo(() => entries.length === 0, [entries]);

  return (
    <div
      className={classnames(classes.quadrant, {
        [classes.inactive]: inactive,
      })}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {quadrant.name}
      </Typography>
      <div className={classes.ringList}>
        <RadarRing
          title="Golden technologies"
          icon={<GoldenTechBlipIcon />}
          entries={lifecycles[GOLDEN_TECH_SECTION_ID] || []}
        />

        {rings.map(ring => (
          <RadarRing
            key={ring.id}
            title={ring.name}
            icon={<BlipIcon color={ring.color} />}
            entries={lifecycles[ring.id] || []}
          />
        ))}
      </div>
    </div>
  );
};

const RadarLegend: FC<RadarLegendProps> = ({ quadrants, rings, entries }) => {
  const classes = useStyles();
  const categories = _(entries)
    .filter(entry => !entry.inactive)
    .groupBy('category')
    .value();

  return (
    <div className={classnames({ [classes.quadrants]: quadrants.length > 1 })}>
      {quadrants.map(quadrant => (
        <RadarQuadrant key={quadrant.id} entries={categories[quadrant.id] || []} quadrant={quadrant} rings={rings} />
      ))}
    </div>
  );
};

interface RadarLegendProps {
  quadrants: Quadrant[];
  rings: Ring[];
  entries: Entry[];
}

export default RadarLegend;
