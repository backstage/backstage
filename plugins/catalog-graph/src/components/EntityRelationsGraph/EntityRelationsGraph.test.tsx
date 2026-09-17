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

import {
  Entity,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { DependencyGraphTypes } from '@backstage/core-components';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropsWithChildren, FunctionComponent } from 'react';
import { EntityRelationsGraph } from './EntityRelationsGraph';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

/*
  The tests in this file have been disabled for the following error:

    TypeError: Cannot read properties of null (reading 'document')

      at document (../../../node_modules/d3-drag/src/nodrag.js:5:19)
      at SVGSVGElement.mousedowned (../../../node_modules/d3-zoom/src/zoom.js:279:16)
      at SVGSVGElement.call (../../../node_modules/d3-selection/src/selection/on.js:3:14)
      at SVGSVGElement.callTheUserObjectsOperation (../../../node_modules/jsdom/lib/jsdom/living/generated/EventListener.js:26:30)
      at innerInvokeEventListeners (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:350:25)
      at invokeEventListeners (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at SVGElementImpl._dispatch (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at SVGElementImpl.dispatchEvent (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at SVGElement.dispatchEvent (../../../node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at ../../../node_modules/@testing-library/user-event/dist/cjs/event/dispatchEvent.js:47:43
      at cb (../../../node_modules/@testing-library/react/dist/pure.js:66:16)
      at batchedUpdates$1 (../../../node_modules/react-dom/cjs/react-dom.development.js:22380:12)
      at act (../../../node_modules/react-dom/cjs/react-dom-test-utils.development.js:1042:14)
      at Object.eventWrapper (../../../node_modules/@testing-library/react/dist/pure.js:65:26)
      at Object.wrapEvent (../../../node_modules/@testing-library/user-event/dist/cjs/event/wrapEvent.js:29:24)
      at Object.dispatchEvent (../../../node_modules/@testing-library/user-event/dist/cjs/event/dispatchEvent.js:47:22)
      at Object.dispatchUIEvent (../../../node_modules/@testing-library/user-event/dist/cjs/event/dispatchEvent.js:24:26)
      at Mouse.down (../../../node_modules/@testing-library/user-event/dist/cjs/system/pointer/mouse.js:83:34)
      at PointerHost.press (../../../node_modules/@testing-library/user-event/dist/cjs/system/pointer/index.js:39:24)
      at pointerAction (../../../node_modules/@testing-library/user-event/dist/cjs/pointer/index.js:59:43)
      at Object.pointer (../../../node_modules/@testing-library/user-event/dist/cjs/pointer/index.js:35:15)
      at ../../../node_modules/@testing-library/react/dist/pure.js:59:16

  This has started happening after upgrading to the later version of @testing-library/user-event, and the d3-drag library
  where it happens seems to be unmaintained. Skipping for now.

  https://github.com/d3/d3-drag/issues/79#issuecomment-1631409544

  https://github.com/d3/d3-drag/issues/89
*/

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<EntityRelationsGraph/>', () => {
  let Wrapper: FunctionComponent<PropsWithChildren<{}>>;
  const entities: { [ref: string]: Entity } = {
    'b:d/c': {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c',
        namespace: 'd',
      },
      relations: [
        {
          targetRef: 'k:d/a1',
          type: RELATION_OWNER_OF,
        },
        {
          targetRef: 'b:d/c1',
          type: RELATION_HAS_PART,
        },
      ],
    },
    'k:d/a1': {
      apiVersion: 'a',
      kind: 'k',
      metadata: {
        name: 'a1',
        namespace: 'd',
      },
      relations: [
        {
          targetRef: 'b:d/c',
          type: RELATION_OWNED_BY,
        },
        {
          targetRef: 'b:d/c1',
          type: RELATION_OWNED_BY,
        },
      ],
    },
    'b:d/c1': {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c1',
        namespace: 'd',
      },
      relations: [
        {
          targetRef: 'b:d/c',
          type: RELATION_PART_OF,
        },
        {
          targetRef: 'k:d/a1',
          type: RELATION_OWNER_OF,
        },
        {
          targetRef: 'b:d/c2',
          type: RELATION_HAS_PART,
        },
      ],
    },
    'b:d/c2': {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c2',
        namespace: 'd',
      },
      relations: [
        {
          targetRef: 'b:d/c1',
          type: RELATION_PART_OF,
        },
      ],
    },
  };
  const catalog = catalogApiMock.mock();
  const CUSTOM_TEST_ID = 'custom-test-id';

  beforeEach(() => {
    Wrapper = ({ children }) => (
      <TestApiProvider apis={[[catalogApiRef, catalog]]}>
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders a single node without exploding', async () => {
    catalog.getEntityByRef.mockResolvedValue({
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c',
        namespace: 'd',
      },
      relations: [],
    });

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(1);
    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(1);
  });

  test('renders a progress indicator while loading', async () => {
    catalog.getEntityByRef.mockImplementation(() => new Promise(() => {}));

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(1);
  });

  test('does not explode if an entity is missing', async () => {
    catalog.getEntityByRef.mockImplementation(async (n: any) => {
      if (n === 'b:d/c') {
        return {
          apiVersion: 'a',
          kind: 'b',
          metadata: {
            name: 'c',
            namespace: 'd',
          },
          relations: [
            {
              target: {
                kind: 'component',
                name: 'some-component',
                namespace: 'default',
              },
              targetRef: 'component:default/some-component',
              type: RELATION_OWNER_OF,
            },
          ],
        };
      }

      return undefined;
    });

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(1);
    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(2);
  });

  test('renders at max depth of one', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          maxDepth={1}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c1')).toBeInTheDocument();
    expect(await screen.findByText('k:d/a1')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(3);

    expect(await screen.findAllByText('ownerOf')).toHaveLength(1);
    expect(await screen.findAllByText('hasPart')).toHaveLength(1);
    expect(await screen.findAllByTestId('label')).toHaveLength(2);

    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(3);
  });

  test('renders simplified graph at full depth', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          unidirectional
          maxDepth={Number.POSITIVE_INFINITY}
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c1')).toBeInTheDocument();
    expect(await screen.findByText('k:d/a1')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c2')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(4);

    expect(await screen.findAllByText('ownerOf')).toHaveLength(1);
    expect(await screen.findAllByText('hasPart')).toHaveLength(2);
    expect(await screen.findAllByTestId('label')).toHaveLength(3);

    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(4);
  });

  test('renders full graph at full depth', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          unidirectional={false}
          mergeRelations={false}
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c1')).toBeInTheDocument();
    expect(await screen.findByText('k:d/a1')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c2')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(4);

    expect(await screen.findAllByText('ownerOf')).toHaveLength(2);
    expect(await screen.findAllByText('ownedBy')).toHaveLength(2);
    expect(await screen.findAllByText('hasPart')).toHaveLength(2);
    expect(await screen.findAllByText('partOf')).toHaveLength(2);
    expect(await screen.findAllByTestId('label')).toHaveLength(8);

    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(4);
  });

  test('renders full graph at full depth with merged relations', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          unidirectional={false}
          mergeRelations
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c1')).toBeInTheDocument();
    expect(await screen.findByText('k:d/a1')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c2')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(4);

    expect(await screen.findAllByText('ownerOf')).toHaveLength(2);
    expect(await screen.findAllByText('hasPart')).toHaveLength(2);
    expect(await screen.findAllByTestId('label')).toHaveLength(4);

    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(4);
  });

  test('renders a graph with multiple root nodes', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={[
            { kind: 'b', namespace: 'd', name: 'c' },
            { kind: 'b', namespace: 'd', name: 'c2' },
          ]}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c1')).toBeInTheDocument();
    expect(await screen.findByText('k:d/a1')).toBeInTheDocument();
    expect(await screen.findByText('b:d/c2')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(4);

    expect(await screen.findAllByText('ownerOf')).toHaveLength(1);
    expect(await screen.findAllByText('partOf')).toHaveLength(2);
    expect(await screen.findAllByTestId('label')).toHaveLength(3);

    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(4);
  });

  test('renders a graph with filtered kinds and relations', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          relations={['ownerOf', 'ownedBy']}
          kinds={['k']}
        />
      </Wrapper>,
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findByText('k:d/a1')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(2);

    expect(await screen.findAllByText('ownerOf')).toHaveLength(1);
    expect(await screen.findAllByTestId('label')).toHaveLength(1);

    expect(catalog.getEntityByRef).toHaveBeenCalledTimes(2);
  });

  test('handle clicks on a node', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    const onNodeClick = jest.fn();
    await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          onNodeClick={onNodeClick}
        />
      </Wrapper>,
    );

    await userEvent.click(await screen.findByText('k:d/a1'));
    expect(onNodeClick).toHaveBeenCalledTimes(1);
  });

  test('render custom node', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    const renderNode = (props: DependencyGraphTypes.RenderNodeProps) => (
      <g>
        <text>{props.node.id}</text>
        <circle data-testid={CUSTOM_TEST_ID} r={100} />
      </g>
    );

    const { container } = await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          renderNode={renderNode}
        />
      </Wrapper>,
    );

    const node = await screen.findAllByTestId(CUSTOM_TEST_ID);
    expect(node[0]).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  test('render custom label', async () => {
    catalog.getEntityByRef.mockImplementation(async n => entities[n as string]);

    const renderLabel = (props: DependencyGraphTypes.RenderLabelProps) => (
      <g>
        <text>{`Test-Label${props.edge.label}`}</text>
        <circle data-testid={CUSTOM_TEST_ID} r={100} />
      </g>
    );

    const { container } = await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          renderLabel={renderLabel}
        />
      </Wrapper>,
    );
    const node = await screen.findAllByTestId(CUSTOM_TEST_ID);
    expect(node[0]).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
    const labels = await screen.findAllByText('Test-Labelvisible');
    expect(labels[0]).toBeInTheDocument();
  });
});
