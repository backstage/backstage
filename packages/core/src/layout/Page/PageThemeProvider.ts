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

export const gradients = {
  blue: {
    colors: ['#2D46B9', '#509BF5'],
    style: 'linear-gradient(135deg, #2D46B9 0%, #509BF5 100%)',
  },
  darkBlue: {
    colors: ['#1E3264', '#A0C3D2'],
    style: 'linear-gradient(44deg, #1E3264 0%, #A0C3D2 100%)',
  },
  brown: {
    colors: ['#674638', '#C39887'],
    style: 'linear-gradient(44deg, #674638 0%, #C39887 100%)',
  },
  green: {
    colors: ['#1DB954', '#006350'],
    style: 'linear-gradient(-90deg, #1DB954 0%, #006350 100%)',
  },
  orangeYellow: {
    colors: ['#FF6437', '#FFC864'],
    style: 'linear-gradient(37deg, #FF6437 0%, #FFC864 100%)',
  },
  redOrange: {
    colors: ['#A72525', '#E6542D'],
    style: 'linear-gradient(37deg, #A72525 0%, #E6542D 100%)',
  },
  pinkOrange: {
    colors: ['#F13DA2', '#FF8A48'],
    style: 'linear-gradient(43deg, #F13DA2 0%, #FF8A48 100%)',
  },
  purpleBlue: {
    colors: ['#4100F4', '#AF2996'],
    style: 'linear-gradient(-137deg, #4100F4 0%, #AF2996 100%)',
  },
  tealGreen: {
    colors: ['#19E68C', '#1D7F6E'],
    style: 'linear-gradient(-137deg, #19E68C 0%, #1D7F6E 100%)',
  },
  violetPeach: {
    colors: ['#B39AC8', '#FCCBD3'],
    style: 'linear-gradient(44deg, #B39AC8 0%, #FCCBD3 100%)',
  },
  violetGreen: {
    colors: ['#4302F4', '#C3EFC8'],
    style: 'linear-gradient(44deg, #4302F4 0%, #C3EFC8 100%)',
  },
  purple: {
    colors: ['#a186bd', '#7c5c92'],
    style: 'linear-gradient(-90deg, #a186bd 0%, #7c5c92 100%)',
  },
  eveningSea: {
    colors: ['#00FFF2', '#035355'],
    style: 'linear-gradient(-137deg, #00FFF2 0%, #035355 100%)',
  },
  royalBlue: {
    colors: ['#000044', '#4B80D4'],
    style:
      'linear-gradient(45deg, #000044 0%, #0000DD 61.47%, #0033DD 74%, #4B80D4 100%)',
  },
  grey: {
    colors: ['#111111', '#777777'],
    style: 'linear-gradient(45deg, #111111 0%, #777777 100%)',
  },
  sunset: {
    colors: ['#cf8022', '#4e6ec7'],
    style: 'linear-gradient(148deg, #cf8022 0%, #4e6ec7 100%)',
  },
  sky: {
    colors: ['#69B9FF', '#ACCEEC'],
    style: 'linear-gradient(135deg, #69B9FF 0%, #ACCEEC 100%)',
  },
  teal: {
    colors: ['#1F8A77', 'rgba(155, 240, 225, 1.0)'],
    style:
      'linear-gradient(180.91deg, rgba(155, 240, 225, 0.72) -42.22%, rgba(155, 240, 225, 0) 85.3%)',
  },
};

export type PageTheme = {
  activeNavLinkColor: string;
  gradient: { colors: string[]; style: string };
};

export const pageTheme: Record<string, PageTheme> = {
  service: {
    activeNavLinkColor: '#1D7F6E',
    gradient: gradients.tealGreen,
  },
  website: {
    activeNavLinkColor: '#765d90',
    gradient: gradients.purple,
  },
  home: {
    activeNavLinkColor: '#00814e',
    gradient: gradients.teal,
  },
  org: {
    activeNavLinkColor: '#6044ef',
    gradient: gradients.violetGreen,
  },
  documentation: {
    activeNavLinkColor: '#04c2ba',
    gradient: gradients.eveningSea,
  },
  tool: {
    activeNavLinkColor: '#04c2ba',
    gradient: gradients.purpleBlue,
  },
  library: {
    activeNavLinkColor: '#B39AC8',
    gradient: gradients.sunset,
  },
};
