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
};

export type PageTheme = {
  gradient: Gradient;
};

export const gradients: Record<string, Gradient> = {
  blue: {
    colors: ['#2D46B9', '#509BF5'],
  },
  darkBlue: {
    colors: ['#1E3264', '#A0C3D2'],
  },
  brown: {
    colors: ['#674638', '#C39887'],
  },
  green: {
    colors: ['#1DB954', '#006350'],
  },
  orangeYellow: {
    colors: ['#FF6437', '#FFC864'],
  },
  redOrange: {
    colors: ['#A72525', '#E6542D'],
  },
  pinkOrange: {
    colors: ['#F13DA2', '#FF8A48'],
  },
  purpleBlue: {
    colors: ['#2D00AA', '#C769B5'],
  },
  tealGreen: {
    colors: ['#19E68C', '#1D7F6E'],
  },
  violetPeach: {
    colors: ['#B39AC8', '#FCCBD3'],
  },
  violetGreen: {
    colors: ['#4302F4', '#C3EFC8'],
  },
  purple: {
    colors: ['#a186bd', '#7c5c92'],
  },
  eveningSea: {
    colors: ['#00FFF2', '#035355'],
  },
  royalBlue: {
    colors: ['#000044', '#4B80D4'],
  },
  grey: {
    colors: ['#111111', '#777777'],
  },
  sunset: {
    colors: ['#cf8022', '#4e6ec7'],
  },
  sky: {
    colors: ['#69B9FF', '#ACCEEC'],
  },
  teal: {
    colors: ['#1F8A77', 'rgba(155, 240, 225, 1.0)'],
  },
};

export const pageTheme: Record<string, PageTheme> = {
  home: {
    gradient: gradients.teal,
  },
  documentation: {
    gradient: gradients.eveningSea,
  },
  tool: {
    gradient: gradients.purpleBlue,
  },
};
