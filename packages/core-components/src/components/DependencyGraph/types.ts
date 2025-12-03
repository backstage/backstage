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
/* We want to maintain the same information as an enum, so we disable the redeclaration warning */
/* eslint-disable @typescript-eslint/no-redeclare */

/**
 * Types used to customize and provide data to {@link DependencyGraph}
 *
 * @packageDocumentation
 */

import { ReactNode } from 'react';

/**
 * Types for the {@link DependencyGraph} component.
 *
 * @public
 */
export namespace DependencyGraphTypes {
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
    /**
     * Distance to a root entity
     */
    distance?: number;
  };

  /**
   * Properties of {@link DependencyGraphTypes.RenderLabelFunction} for {@link DependencyGraphTypes.DependencyEdge}
   *
   * @public
   */
  export type RenderLabelProps<T = unknown> = { edge: DependencyEdge<T> };

  /**
   * Custom React component for edge labels
   *
   * @public
   */
  export type RenderLabelFunction<T = {}> = (
    props: RenderLabelProps<T>,
  ) => ReactNode;

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
   *
   * @public
   */
  export type RenderNodeProps<T = unknown> = { node: DependencyNode<T> };

  /**
   * Custom React component for graph {@link DependencyGraphTypes.DependencyNode}
   *
   * @public
   */
  export type RenderNodeFunction<T = {}> = (
    props: RenderNodeProps<T>,
  ) => ReactNode;

  /**
   * Properties of {@link DependencyGraphTypes.RenderEdgeFunction} for {@link DependencyGraphTypes.DependencyEdge}
   *
   * @public
   */
  export type RenderEdgeProps<T = {}> = {
    edge: T & {
      points: { x: number; y: number }[];
      label?: string;
      labeloffset?: number;
      labelpos?: string;
      width?: number;
      height?: number;
      weight?: number;
      minlen?: number;
      showArrowHeads?: boolean;
      from?: string;
      to?: string;
      relations?: string[];
    };
    id: {
      v: string;
      w: string;
      name?: string | undefined;
    };
  };

  /**
   * Custom React component for graph {@link DependencyGraphTypes.DependencyEdge}
   *
   * @public
   */
  export type RenderEdgeFunction<T = {}> = (
    props: RenderEdgeProps<T>,
  ) => ReactNode;

  /**
   * Graph direction
   *
   * @public
   */
  export const Direction = {
    /**
     * Top to Bottom
     */
    TOP_BOTTOM: 'TB',
    /**
     * Bottom to Top
     */
    BOTTOM_TOP: 'BT',
    /**
     * Left to Right
     */
    LEFT_RIGHT: 'LR',
    /**
     * Right to Left
     */
    RIGHT_LEFT: 'RL',
  } as const;

  /**
   * @public
   */
  export type Direction = (typeof Direction)[keyof typeof Direction];

  /**
   * @public
   */
  export namespace Direction {
    export type TOP_BOTTOM = typeof Direction.TOP_BOTTOM;
    export type BOTTOM_TOP = typeof Direction.BOTTOM_TOP;
    export type LEFT_RIGHT = typeof Direction.LEFT_RIGHT;
    export type RIGHT_LEFT = typeof Direction.RIGHT_LEFT;
  }

  /**
   * Node alignment
   *
   * @public
   */
  export const Alignment = {
    /**
     * Up Left
     */
    UP_LEFT: 'UL',
    /**
     * Up Right
     */
    UP_RIGHT: 'UR',
    /**
     * Down Left
     */
    DOWN_LEFT: 'DL',
    /**
     * Down Right
     */
    DOWN_RIGHT: 'DR',
  } as const;

  /**
   * @public
   */
  export type Alignment = (typeof Alignment)[keyof typeof Alignment];

  /**
   * @public
   */
  export namespace Alignment {
    export type UP_LEFT = typeof Alignment.UP_LEFT;
    export type UP_RIGHT = typeof Alignment.UP_RIGHT;
    export type DOWN_LEFT = typeof Alignment.DOWN_LEFT;
    export type DOWN_RIGHT = typeof Alignment.DOWN_RIGHT;
  }

  /**
   * Algorithm used to rand nodes in graph
   *
   * @public
   */
  export const Ranker = {
    /**
     * {@link https://en.wikipedia.org/wiki/Network_simplex_algorithm | Network Simplex} algorithm
     */
    NETWORK_SIMPLEX: 'network-simplex',
    /**
     * Tight Tree algorithm
     */
    TIGHT_TREE: 'tight-tree',
    /**
     * Longest path algorithm
     *
     * @remarks
     *
     * Simplest and fastest
     */
    LONGEST_PATH: 'longest-path',
  } as const;

  /**
   * @public
   */
  export type Ranker = (typeof Ranker)[keyof typeof Ranker];

  /**
   * @public
   */
  export namespace Ranker {
    export type NETWORK_SIMPLEX = typeof Ranker.NETWORK_SIMPLEX;
    export type TIGHT_TREE = typeof Ranker.TIGHT_TREE;
    export type LONGEST_PATH = typeof Ranker.LONGEST_PATH;
  }

  /**
   * Position of label in relation to the edge
   *
   * @public
   */
  export const LabelPosition = {
    LEFT: 'l',
    RIGHT: 'r',
    CENTER: 'c',
  } as const;

  /**
   * @public
   */
  export type LabelPosition =
    (typeof LabelPosition)[keyof typeof LabelPosition];

  /**
   * @public
   */
  export namespace LabelPosition {
    export type LEFT = typeof LabelPosition.LEFT;
    export type RIGHT = typeof LabelPosition.RIGHT;
    export type CENTER = typeof LabelPosition.CENTER;
  }
}
