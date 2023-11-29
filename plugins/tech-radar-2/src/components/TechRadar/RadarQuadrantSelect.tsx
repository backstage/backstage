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
import React, { FC, MouseEventHandler } from 'react';

import { makeStyles, Theme, alpha, Typography } from '@material-ui/core';

import { Quadrant } from '../../types';

interface QuadrantBoxStylesProps {
  quadrant: Quadrant;
  isActive: boolean;
}

const useQuadrantBoxStyles = makeStyles<Theme, QuadrantBoxStylesProps>(theme => ({
  quadrant: {
    backgroundColor: ({ isActive }) => (isActive ? theme.palette.info.main : alpha(theme.palette.text.secondary, 0.2)),
    gridColumnStart: ({ quadrant }) => (quadrant.offsetX === -1 ? 1 : 2),
    gridRowStart: ({ quadrant }) => (quadrant.offsetY === -1 ? 1 : 2),
    border: '0',
    '&:hover': {
      backgroundColor: ({ isActive }) =>
        isActive ? theme.palette.info.main : alpha(theme.palette.text.secondary, 0.4),
    },
    cursor: 'pointer',
  },
}));

interface QuadrantBoxProps {
  quadrant: Quadrant;
  isActive: boolean;
  onSelect: (quadrant?: Quadrant) => void;
}

const QuadrantBox: FC<QuadrantBoxProps> = ({ quadrant, isActive, onSelect }) => {
  const classes = useQuadrantBoxStyles({ quadrant, isActive });
  const handleClick: MouseEventHandler = e => {
    e.preventDefault();
    onSelect(isActive ? undefined : quadrant);
  };
  return <button type="button" className={classes.quadrant} onClick={handleClick} />;
};

const useStyles = makeStyles(theme => ({
  border: {
    padding: theme.spacing(1),
    border: `2px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
    width: '120px',
    height: '90px',
  },
  container: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1),
    width: '100%',
    height: '100%',
  },
  ringContainer: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  ring: {
    borderRadius: '50%',
    border: `1px solid ${theme.palette.background.paper}`,
    aspectRatio: '1/1',
  },
  label: {
    textTransform: 'uppercase',
    fontWeight: 700,
    textAlign: 'right',
  },
}));

interface RingProps {
  size: string;
}

const Ring: FC<RingProps> = ({ size }) => {
  const classes = useStyles();
  return (
    <div className={classes.ringContainer}>
      <div className={classes.ring} style={{ width: size }} />
    </div>
  );
};

interface RadarQuadrantSelectProps {
  quadrants: Quadrant[];
  activeQuadrant?: Quadrant;
  onQuadrantSelect: (quadrant?: Quadrant) => void;
}

const RadarQuadrantSelect: FC<RadarQuadrantSelectProps> = ({ quadrants, activeQuadrant, onQuadrantSelect }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.label}>VIEW</Typography>
      <div className={classes.border}>
        <div className={classes.container}>
          {quadrants.map(quadrant => (
            <QuadrantBox
              key={quadrant.id}
              quadrant={quadrant}
              isActive={activeQuadrant?.id === quadrant.id}
              onSelect={onQuadrantSelect}
            />
          ))}
          {['65%', '50%', '35%', '20%'].map(size => (
            <Ring key={size} size={size} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadarQuadrantSelect;
