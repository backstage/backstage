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
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import React, { FunctionComponent } from 'react';
import { EntityRelationsGraph } from './EntityRelationsGraph';

describe('<EntityRelationsGraph/>', () => {
  let Wrapper: FunctionComponent;
  let catalog: jest.Mocked<CatalogApi>;

  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  beforeEach(() => {
    const entities: { [key: string]: Entity } = {
      'b:d/c': {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
        relations: [
          {
            target: {
              kind: 'k',
              name: 'a1',
              namespace: 'd',
            },
            type: RELATION_OWNER_OF,
          },
          {
            target: {
              kind: 'b',
              name: 'c1',
              namespace: 'd',
            },
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
            target: {
              kind: 'b',
              name: 'c',
              namespace: 'd',
            },
            type: RELATION_OWNED_BY,
          },
          {
            target: {
              kind: 'b',
              name: 'c1',
              namespace: 'd',
            },
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
            target: {
              kind: 'b',
              name: 'c',
              namespace: 'd',
            },
            type: RELATION_PART_OF,
          },
          {
            target: {
              kind: 'k',
              name: 'a1',
              namespace: 'd',
            },
            type: RELATION_OWNER_OF,
          },
          {
            target: {
              kind: 'b',
              name: 'c2',
              namespace: 'd',
            },
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
            target: {
              kind: 'b',
              name: 'c1',
              namespace: 'd',
            },
            type: RELATION_PART_OF,
          },
        ],
      },
    };
    catalog = {
      getEntities: jest.fn(),
      getEntityByName: jest.fn(async n => entities[stringifyEntityRef(n)]),
      removeEntityByUid: jest.fn(),
      getLocationById: jest.fn(),
      getOriginLocationByEntity: jest.fn(),
      getLocationByEntity: jest.fn(),
      addLocation: jest.fn(),
      removeLocationById: jest.fn(),
    };
    const apis = ApiRegistry.with(catalogApiRef, catalog);

    Wrapper = ({ children }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('renders a single node without exploding', async () => {
    catalog.getEntityByName.mockResolvedValue({
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c',
        namespace: 'd',
      },
      relations: [],
    });

    const { findByText, findAllByTestId } = await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(1);
    expect(catalog.getEntityByName).toBeCalledTimes(1);
  });

  test('renders a progress indicator while loading', async () => {
    catalog.getEntityByName.mockImplementation(() => new Promise(() => {}));

    const { findByRole } = await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await findByRole('progressbar')).toBeInTheDocument();
    expect(catalog.getEntityByName).toBeCalledTimes(1);
  });

  test('does not explode if an entity is missing', async () => {
    catalog.getEntityByName.mockImplementation(async n => {
      if (n.name === 'c') {
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
              type: RELATION_OWNER_OF,
            },
          ],
        };
      }

      return undefined;
    });

    const { findByText, findAllByTestId } = await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
        />
      </Wrapper>,
    );

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(1);
    expect(catalog.getEntityByName).toBeCalledTimes(2);
  });

  test('renders at max depth of one', async () => {
    const { findByText, findAllByTestId, findAllByText } =
      await renderInTestApp(
        <Wrapper>
          <EntityRelationsGraph
            rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
            maxDepth={1}
          />
        </Wrapper>,
      );

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('b:d/c1')).toBeInTheDocument();
    expect(await findByText('k:d/a1')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(3);

    expect(await findAllByText('ownerOf')).toHaveLength(1);
    expect(await findAllByText('hasPart')).toHaveLength(1);
    expect(await findAllByTestId('label')).toHaveLength(2);

    expect(catalog.getEntityByName).toBeCalledTimes(3);
  });

  test('renders simplied graph at full depth', async () => {
    const { findByText, findAllByText, findAllByTestId } =
      await renderInTestApp(
        <Wrapper>
          <EntityRelationsGraph
            unidirectional
            maxDepth={Number.POSITIVE_INFINITY}
            rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          />
        </Wrapper>,
      );

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('b:d/c1')).toBeInTheDocument();
    expect(await findByText('k:d/a1')).toBeInTheDocument();
    expect(await findByText('b:d/c2')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(4);

    expect(await findAllByText('ownerOf')).toHaveLength(1);
    expect(await findAllByText('hasPart')).toHaveLength(2);
    expect(await findAllByTestId('label')).toHaveLength(3);

    expect(catalog.getEntityByName).toBeCalledTimes(4);
  });

  test('renders full graph at full depth', async () => {
    const { findAllByText, findByText, findAllByTestId } =
      await renderInTestApp(
        <Wrapper>
          <EntityRelationsGraph
            unidirectional={false}
            mergeRelations={false}
            rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          />
        </Wrapper>,
      );

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('b:d/c1')).toBeInTheDocument();
    expect(await findByText('k:d/a1')).toBeInTheDocument();
    expect(await findByText('b:d/c2')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(4);

    expect(await findAllByText('ownerOf')).toHaveLength(2);
    expect(await findAllByText('ownedBy')).toHaveLength(2);
    expect(await findAllByText('hasPart')).toHaveLength(2);
    expect(await findAllByText('partOf')).toHaveLength(2);
    expect(await findAllByTestId('label')).toHaveLength(8);

    expect(catalog.getEntityByName).toBeCalledTimes(4);
  });

  test('renders full graph at full depth with merged relations', async () => {
    const { findAllByText, findByText, findAllByTestId } =
      await renderInTestApp(
        <Wrapper>
          <EntityRelationsGraph
            unidirectional={false}
            mergeRelations
            rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          />
        </Wrapper>,
      );

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('b:d/c1')).toBeInTheDocument();
    expect(await findByText('k:d/a1')).toBeInTheDocument();
    expect(await findByText('b:d/c2')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(4);

    expect(await findAllByText('ownerOf')).toHaveLength(2);
    expect(await findAllByText('hasPart')).toHaveLength(2);
    expect(await findAllByTestId('label')).toHaveLength(4);

    expect(catalog.getEntityByName).toBeCalledTimes(4);
  });

  test('renders a graph with multiple root nodes', async () => {
    const { findAllByText, findByText, findAllByTestId } =
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

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('b:d/c1')).toBeInTheDocument();
    expect(await findByText('k:d/a1')).toBeInTheDocument();
    expect(await findByText('b:d/c2')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(4);

    expect(await findAllByText('ownerOf')).toHaveLength(1);
    expect(await findAllByText('partOf')).toHaveLength(2);
    expect(await findAllByTestId('label')).toHaveLength(3);

    expect(catalog.getEntityByName).toBeCalledTimes(4);
  });

  test('renders a graph with filtered kinds and relations', async () => {
    const { findAllByText, findByText, findAllByTestId } =
      await renderInTestApp(
        <Wrapper>
          <EntityRelationsGraph
            rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
            relations={['ownerOf', 'ownedBy']}
            kinds={['k']}
          />
        </Wrapper>,
      );

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('k:d/a1')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(2);

    expect(await findAllByText('ownerOf')).toHaveLength(1);
    expect(await findAllByTestId('label')).toHaveLength(1);

    expect(catalog.getEntityByName).toBeCalledTimes(2);
  });

  test('handle clicks on a node', async () => {
    const onNodeClick = jest.fn();
    const { findByText } = await renderInTestApp(
      <Wrapper>
        <EntityRelationsGraph
          rootEntityNames={{ kind: 'b', namespace: 'd', name: 'c' }}
          onNodeClick={onNodeClick}
        />
      </Wrapper>,
    );

    userEvent.click(await findByText('k:d/a1'));
    expect(onNodeClick).toBeCalledTimes(1);
  });
});
