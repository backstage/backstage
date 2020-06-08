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

import { createApiRef } from '@backstage/core';

/**
 * Types related to the Radar's visualization.
 */

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
  quadrant: RadarQuadrant;
  ring: RadarRing;
  title: string;
  url: string;
}

/**
 * Types related to data collection for the Radar.
 */

export interface TechRadarLoaderResponse {
  quadrants: RadarQuadrant[];
  rings: RadarRing[];
  entries: RadarEntry[];
}

/**
 * Set up the Radar as a Backstage component.
 */

export interface TechRadarComponentProps {
  width: number;
  height: number;
  getData?: () => Promise<TechRadarLoaderResponse>;
  svgProps?: object;
}

/**
 * Set up the Radar as a Backstage plugin.
 */

export interface TechRadarApi extends TechRadarComponentProps {
  title?: string;
  subtitle?: string;
}

export const techRadarApiRef = createApiRef<TechRadarApi>({
  id: 'plugin.techradar',
  description: 'Used by the Tech Radar to render the visualization',
});

export class TechRadar implements TechRadarApi {
  // Default columns
  public width: TechRadarApi['width'];
  public height: TechRadarApi['height'];
  public getData: TechRadarApi['getData'];
  public svgProps: TechRadarApi['svgProps'];
  public title: TechRadarApi['title'];
  public subtitle: TechRadarApi['subtitle'];

  constructor(overrideOptions: TechRadarApi) {
    const defaultOptions: Partial<TechRadarApi> = {
      title: 'Tech Radar',
      subtitle: 'Welcome to the Tech Radar!',
    };

    const options = { ...defaultOptions, ...overrideOptions };

    this.width = options.width;
    this.height = options.height;
    this.getData = options.getData;
    this.svgProps = options.svgProps;
    this.title = options.title;
    this.subtitle = options.subtitle;
  }
}
