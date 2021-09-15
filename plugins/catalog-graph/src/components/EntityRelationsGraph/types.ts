/*
 * Copyright 2021 The Backstage Authors
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
import { DependencyGraphTypes } from '@backstage/core-components';
import { MouseEventHandler } from 'react';

export type EntityEdge = DependencyGraphTypes.DependencyEdge<{
  relations: string[];
  // Not used, but has to be non empty to draw a label at all!
  label: 'visible';
}>;

export type EntityNode = DependencyGraphTypes.DependencyNode<{
  name: string;
  kind?: string;
  title?: string;
  namespace: string;
  focused?: boolean;
  color?: 'primary' | 'secondary' | 'default';
  onClick?: MouseEventHandler<SVGGElement>;
}>;

export type GraphEdge = DependencyGraphTypes.GraphEdge<EntityEdge>;

export type GraphNode = DependencyGraphTypes.GraphNode<EntityNode>;

export enum Direction {
  TOP_BOTTOM = 'TB',
  BOTTOM_TOP = 'BT',
  LEFT_RIGHT = 'LR',
  RIGHT_LEFT = 'RL',
}
