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
import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';

/**
 * Additional Data for entities.
 *
 * @public
 */
export type EntityEdgeData = {
  /**
   * Up to two relations that are connecting an entity.
   */
  relations: string[];
  /**
   * Whether the entity is visible or not.
   */
  // Not used, but has to be non-empty to draw a label at all!
  label: 'visible';
};

/**
 * Edge between two entities.
 *
 * @public
 */
export type EntityEdge = DependencyGraphTypes.DependencyEdge<EntityEdgeData>;

/**
 * Additional data for Entity Node
 *
 * @public
 */
export type EntityNodeData = {
  /**
   * The Entity
   */
  entity: Entity;
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

  /**
   * Name of the entity.
   * @deprecated use {@link EntityNodeData#entity} instead
   */
  name: string;
  /**
   * Optional kind of the entity.
   * @deprecated use {@link EntityNodeData#entity} instead
   */
  kind?: string;
  /**
   * Optional title of the entity.
   * @deprecated use {@link EntityNodeData#entity} instead
   */
  title?: string;
  /**
   * Namespace of the entity.
   * @deprecated use {@link EntityNodeData#entity} instead
   * The Entity
   */
  namespace: string;
  /**
   * Optional spec of the entity.
   * @deprecated use {@link EntityNodeData#entity} instead
   */
  spec?: JsonObject;
};

/**
 * Node representing an entity.
 *
 * @public
 */
export type EntityNode = DependencyGraphTypes.DependencyNode<EntityNodeData>;

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
