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

/**
 * Edge between two entities.
 *
 * @public
 */
export type EntityEdge = DependencyGraphTypes.DependencyEdge<{
  /**
   * Up to two relations that are connecting an entity.
   */
  relations: string[];
  /**
   * Whether the entity is visible or not.
   */
  // Not used, but has to be non empty to draw a label at all!
  label: 'visible';
}>;

/**
 * Node representing an entity.
 *
 * @public
 */
export type EntityNode = DependencyGraphTypes.DependencyNode<{
  /**
   * Name of the entity.
   */
  name: string;
  /**
   * Optional kind of the entity.
   */
  kind?: string;
  /**
   * Optional title of the entity.
   */
  title?: string;
  /**
   * Namespace of the entity.
   */
  namespace: string;
  /**
   * Whether the entity is focused, optional, defaults to false. Focused
   * entities are highlighted in the graph.
   */
  focused?: boolean;
  /**
   * Optional color of the entity, defaults to 'default'.
   */
  color?: 'primary' | 'secondary' | 'default';
  /**
   * Optional click handler.
   */
  onClick?: MouseEventHandler<unknown>;
}>;

export type GraphEdge = DependencyGraphTypes.GraphEdge<EntityEdge>;

export type GraphNode = DependencyGraphTypes.GraphNode<EntityNode>;

/**
 * Render direction of the graph.
 *
 * @public
 */
export enum Direction {
  /**
   * Top to bottom.
   */
  TOP_BOTTOM = 'TB',
  /**
   * Bottom to top.
   */
  BOTTOM_TOP = 'BT',
  /**
   * Left to right.
   */
  LEFT_RIGHT = 'LR',
  /**
   * Right to left.
   */
  RIGHT_LEFT = 'RL',
}
