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

import { ApiRef } from '@backstage/core';

export interface RadarRing {
  id: string;
  name: string;
  color: string;
}

export interface RadarQuadrant {
  id: string;
  name: string;
}

export interface RadarEntry {
  key: string; // react key
  id: string;
  moved: number;
  quadrant: string;
  ring: string;
  title: string;
  url: string;
}

export interface TechRadarLoaderResponse {
  quadrants: RadarQuadrant[];
  rings: RadarRing[];
  entries: RadarEntry[];
}

export interface TechRadarAdditionalOptions {
  title?: string;
  subtitle?: string;
  svgProps?: object;
}

export interface TechRadarApi {
  width: number;
  height: number;
  load: () => Promise<TechRadarLoaderResponse>;
  additionalOpts: TechRadarAdditionalOptions;
}

export const techRadarApiRef = new ApiRef<TechRadarApi>({
  id: 'plugin.techradar',
  description: 'Used by the Tech Radar to render the diagram',
});

export class TechRadar implements TechRadarApi {
  private defaultAdditionalOpts: Partial<TechRadarAdditionalOptions> = {
    title: 'Tech Radar',
    subtitle: 'Welcome to the Tech Radar!',
  };

  constructor(
    public width: number,
    public height: number,
    public load: () => Promise<TechRadarLoaderResponse>,
    public additionalOpts: TechRadarAdditionalOptions = {},
  ) {
    this.additionalOpts = { ...this.defaultAdditionalOpts, ...additionalOpts };
  }
}
