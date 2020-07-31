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

export type Gradient = {
  colors: string[];
  waveColor: string;
  opacity: string[];
};

export type PageTheme = {
  gradient: Gradient;
};

export const gradients: Record<string, Gradient> = {
  darkGrey: {
    colors: ['#171717', '#383838'],
    waveColor: '#757575',
    opacity: ['1.0', '0.0'],
  },
  marineBlue: {
    colors: ['#00759A', '#004EAC'],
    waveColor: '#BDDBFF',
    opacity: ['0.72', '0.0'],
  },
  veryBlue: {
    colors: ['#0B2B9C', '#311288'],
    waveColor: '#8960FD',
    opacity: ['0.72', '0.0'],
  },
  rubyRed: {
    colors: ['#A4284B', '#8D1134'],
    waveColor: '#FFBFF5',
    opacity: ['0.28', '0.10'],
  },
  toastyOrange: {
    colors: ['#CC3707', '#9A2500'],
    waveColor: '#FF784E',
    opacity: ['0.72', '0.0'],
  },
  purpleSky: {
    colors: ['#AF29F8', '#4100F4'],
    waveColor: '#AF29F8',
    opacity: ['0.72', '0.0'],
  },
  eveningSea: {
    colors: ['#00FFF2', '#035355'],
    waveColor: '',
    opacity: ['0.72', '0.0'],
  },
  teal: {
    colors: ['#005E4D', '#004E40'],
    waveColor: '#9BF0E1',
    opacity: ['0.72', '0.0'],
  },
  pinkSea: {
    colors: ['#C8077A', '#C2297D'],
    waveColor: '#ea93c3',
    opacity: ['0.8', '0.0'],
  },
};

export const pageTheme: Record<string, PageTheme> = {
  home: {
    gradient: gradients.teal,
  },
  documentation: {
    gradient: gradients.pinkSea,
  },
  tool: {
    gradient: gradients.purpleSky,
  },
  service: {
    gradient: gradients.marineBlue,
  },
  website: {
    gradient: gradients.veryBlue,
  },
  library: {
    gradient: gradients.rubyRed,
  },
  other: {
    gradient: gradients.darkGrey,
  },
  app: {
    gradient: gradients.toastyOrange,
  },
};
