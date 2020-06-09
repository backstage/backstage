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

import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';

type Props = {
  x: number;
  y: number;
  number: number;
  color: string;
  url?: string;
  moved?: number;
  onMouseEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
  onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
};

const useStyles = makeStyles<Theme>(() => ({
  text: {
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: '9px',
    fill: '#fff',
    textAnchor: 'middle',
  },

  link: {
    cursor: 'pointer',
  },
}));

const RadarEntry: FC<Props> = props => {
  const classes = useStyles(props);

  const {
    moved,
    color,
    url,
    number,
    x,
    y,
    onMouseEnter,
    onMouseLeave,
    onClick,
  } = props;

  const style = { fill: color };

  let blip;
  if (moved && moved > 0) {
    blip = <path d="M -11,5 11,5 0,-13 z" style={style} />; // triangle pointing up
  } else if (moved && moved < 0) {
    blip = <path d="M -11,-5 11,-5 0,13 z" style={style} />; // triangle pointing down
  } else {
    blip = <circle r={9} style={style} />;
  }

  if (url) {
    blip = (
      <a href={url} className={classes.link}>
        {blip}
      </a>
    );
  }

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {blip}
      <text y={3} className={classes.text}>
        {number}
      </text>
    </g>
  );
};

export default RadarEntry;
