/*
 * Copyright 2020 The Backstage Authors
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

/**
 * Types used to customize and provide data to {@link DependencyGraph}
 *
 * @packageDocumentation
 */

import React from 'react';

/**
 * Edge of {@link DependencyGraph}
 *
 * @public
 */
export type DependencyEdge<T = {}> = T & {
  /**
   * ID of {@link DependencyNode} from where the Edge start
   */
  from: string;
  /**
   * ID of {@link DependencyNode} to where the Edge goes to
   */
  to: string;
  /**
   * Label assigned and rendered with the Edge
   */
  label?: string;
};

/**
 * Properties of {@link DependencyGraphTypes.RenderLabelFunction} for {@link DependencyGraphTypes.DependencyEdge}
 */
export type RenderLabelProps<T = unknown> = { edge: DependencyEdge<T> };

/**
 * Custom React component for edge labels
 */
export type RenderLabelFunction<T = {}> = (
  props: RenderLabelProps<T>,
) => React.ReactNode;

/**
 * Node of {@link DependencyGraph}
 *
 * @public
 */
export type DependencyNode<T = {}> = T & {
  id: string;
};

/**
 * Properties of {@link DependencyGraphTypes.RenderNodeFunction} for {@link DependencyGraphTypes.DependencyNode}
 */
export type RenderNodeProps<T = unknown> = { node: DependencyNode<T> };

/**
 * Custom React component for graph {@link DependencyGraphTypes.DependencyNode}
 */
export type RenderNodeFunction<T = {}> = (
  props: RenderNodeProps<T>,
) => React.ReactNode;

/**
 * Graph direction
 *
 * @public
 */
export enum Direction {
  /**
   * Top to Bottom
   */
  TOP_BOTTOM = 'TB',
  /**
   * Bottom to Top
   */
  BOTTOM_TOP = 'BT',
  /**
   * Left to Right
   */
  LEFT_RIGHT = 'LR',
  /**
   * Right to Left
   */
  RIGHT_LEFT = 'RL',
}

/**
 * Node alignment
 *
 * @public
 */
export enum Alignment {
  /**
   * Up Left
   */
  UP_LEFT = 'UL',
  /**
   * Up Right
   */
  UP_RIGHT = 'UR',
  /**
   * Down Left
   */
  DOWN_LEFT = 'DL',
  /**
   * Down Right
   */
  DOWN_RIGHT = 'DR',
}

/**
 * Algorithm used to rand nodes in graph
 */
export enum Ranker {
  /**
   * {@link https://en.wikipedia.org/wiki/Network_simplex_algorithm | Network Simplex} algorithm
   */
  NETWORK_SIMPLEX = 'network-simplex',
  /**
   * Tight Tree algorithm
   */
  TIGHT_TREE = 'tight-tree',
  /**
   * Longest path algorithm
   *
   * @remarks
   *
   * Simplest and fastest
   */
  LONGEST_PATH = 'longest-path',
}

/**
 * Position of label in relation to the edge
 *
 * @public
 */
export enum LabelPosition {
  LEFT = 'l',
  RIGHT = 'r',
  CENTER = 'c',
}
