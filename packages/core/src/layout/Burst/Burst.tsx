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
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { shapes } from './shapes';

const useStyles = makeStyles({
  burst: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: -1,
    overflow: 'hidden',
  },
  burstShape: {
    position: 'absolute',
    right: 0,
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    opacity: 0.1,
  },
});

const gradients = {
  blue: 'linear-gradient(135deg, #2D46B9 0%, #509BF5 100%)',
  darkBlue: 'linear-gradient(44deg, #1E3264 0%, #A0C3D2 100%)',
  brown: 'linear-gradient(44deg, #674638 0%, #C39887 100%)',
  green: 'linear-gradient(-90deg, #1DB954 0%, #006350 100%)',
  yellowGreen: 'linear-gradient(37deg, #f0b54c 0%, #b6d404 100%)',
  orangeYellow: 'linear-gradient(37deg, #FF6437 0%, #FFC864 100%)',
  redOrange: 'linear-gradient(37deg, #A72525 0%, #E6542D 100%)',
  pinkOrange: 'linear-gradient(43deg, #F13DA2 0%, #FF8A48 100%)',
  purpleBlue: 'linear-gradient(-137deg, #4100F4 0%, #AF2996 100%)',
  tealGreen: 'linear-gradient(-137deg, #19E68C 0%, #1D7F6E 100%)',
  violetPeach: 'linear-gradient(44deg, #B39AC8 0%, #FCCBD3 100%)',
  violetGreen: 'linear-gradient(44deg, #4302F4 0%, #C3EFC8 100%)',
  purple: 'linear-gradient(-90deg, #a186bd 0%, #7c5c92 100%)',
  eveningSea: 'linear-gradient(-90deg, #043f3d 0%, #066d6a 100%)',
  royalBlue:
    'linear-gradient(45deg, #000044 0%, #0000DD 61.47%, #0033DD 74%, #4B80D4 100%)',
  grey: 'linear-gradient(45deg, #111111 0%, #777777 100%)',
  sunset: 'linear-gradient(148deg, #cf8022 0%, #4e6ec7 100%)',
  sky: 'linear-gradient(135deg, #69B9FF 0%, #ACCEEC 100%)',
};

type ValuesOf<T> = T extends Record<any, infer V> ? V : never;
const typeToBurst = (
  type: string,
): { shape: ValuesOf<typeof shapes>; gradient: ValuesOf<typeof gradients> } => {
  switch (type) {
    case 'app':
      return { shape: shapes.triangle1, gradient: gradients.redOrange };
    case 'documentation':
      return { shape: shapes.circle2, gradient: gradients.eveningSea };
    case 'library':
      return { shape: shapes.triangle3, gradient: gradients.sunset };
    case 'other':
      return { shape: shapes.rectangle1, gradient: gradients.brown };
    case 'service':
      return { shape: shapes.rectangle2, gradient: gradients.tealGreen };
    case 'tool':
      return { shape: shapes.rectangle1, gradient: gradients.violetPeach };
    case 'website':
      return { shape: shapes.rectangle2, gradient: gradients.purple };
    case 'home':
    default:
      return { shape: shapes.triangle2, gradient: gradients.green };
  }
};

type Props = { type: string };

/**
 * Visual component-background, adds burst with color.
 * Use inside container with `position: relative`
 */
export const Burst = ({ type }: Props) => {
  const classes = useStyles();
  const { shape, gradient } = typeToBurst(type);

  return (
    <div className={classes.burst} style={{ backgroundImage: gradient }}>
      <div className={classes.burstShape} style={shape} />
    </div>
  );
};
