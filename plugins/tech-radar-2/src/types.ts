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
export interface QuadrantConfig {
  id: Category;
  name: string;
}

export enum Discipline {
  Backend = 'backend',
  Web = 'web',
  Data = 'data',
  DataScience = 'data-science',
  Client = 'client',
}

export interface Quadrant extends QuadrantConfig {
  idx: number;
  radialMin: number;
  radialMax: number;
  offsetX: number;
  offsetY: number;
}

export interface RingConfig {
  id: Lifecycle;
  color: string;
  name: string;
}

export interface Ring extends RingConfig {
  idx: number;
  outerRadius: number;
  innerRadius: number;
}

export interface EntryConfig {
  id: string;
  category: Category;
  lifecycle: Lifecycle;
  title: string;
  vendor: string;
  url: string;
  path: string;
  goldenTech: boolean;
  ordinal: number;
  discipline: Discipline[];
  lastModified: number;
}

export const ENTRY_RADIUS = 6;

export interface Entry extends EntryConfig {
  idx: number;
  x: number;
  y: number;
  color: string;
  inactive: boolean;
  quadrant: Quadrant;
  ring: Ring;
}

export enum Category {
  Infrastructure = 'infrastructure',
  Frameworks = 'frameworks',
  Languages = 'languages',
  Techniques = 'techniques',
}

export enum Lifecycle {
  Use = 'use',
  Trial = 'trial',
  Assess = 'assess',
  Hold = 'hold',
}

export interface CartCoord {
  x: number;
  y: number;
}

export interface PolarCoord {
  r: number;
  t: number;
}
