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

import React from 'react';
import dagre from 'dagre';
import { render } from '@testing-library/react';
import { Node } from './Node';
import { DependencyGraphTypes as Types } from './types';

const node = { id: 'abc', x: 0, y: 0, width: 0, height: 0 };
const setNode = jest.fn(() => new dagre.graphlib.Graph());
const renderElement = jest.fn((props: Types.RenderNodeProps) => (
  <div>{props.node.id}</div>
));

const minProps = {
  node,
  setNode,
  render: renderElement,
};

describe('<Node />', () => {
  beforeEach(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  afterEach(jest.clearAllMocks);

  it('renders the supplied element', () => {
    const { getByText } = render(
      <svg>
        <Node {...minProps} />
      </svg>,
    );
    expect(getByText(minProps.node.id)).toBeInTheDocument();
  });

  it('passes down node properties to the render method', () => {
    const nodeWithRandomProp = { ...node, randomProp: true };
    render(
      <svg>
        <Node {...minProps} node={nodeWithRandomProp} />
      </svg>,
    );

    expect(renderElement).toHaveBeenCalledWith({ node: nodeWithRandomProp });
  });

  it('calls setNode with node ID and actual size after rendering', () => {
    const { getByText } = render(
      <svg>
        <Node {...minProps} />
      </svg>,
    );
    expect(getByText(minProps.node.id)).toBeInTheDocument();

    // Updates the node in the graph
    expect(setNode).toHaveBeenCalledWith(node.id, {
      ...node,
      height: 100,
      width: 100,
    });

    // Does not pass down width/height to node
    expect(renderElement).not.toHaveBeenCalledWith(
      expect.objectContaining({ height: 100, width: 100 }),
    );
  });
});
