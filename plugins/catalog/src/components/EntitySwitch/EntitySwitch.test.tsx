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

import { Entity } from '@backstage/catalog-model';
import {
  AsyncEntityProvider,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { render, screen } from '@testing-library/react';
import { ReactNode, useEffect } from 'react';
import { isKind } from './conditions';
import { EntitySwitch } from './EntitySwitch';
import { featureFlagsApiRef } from '@backstage/core-plugin-api';
import { LocalStorageFeatureFlags } from '@backstage/core-app-api';
import { TestApiProvider } from '@backstage/test-utils';

const mockFeatureFlagsApi = new LocalStorageFeatureFlags();
const Wrapper = ({ children }: { children?: ReactNode }) => (
  <TestApiProvider apis={[[featureFlagsApiRef, mockFeatureFlagsApi]]}>
    {children}
  </TestApiProvider>
);

describe('EntitySwitch', () => {
  it('should render only the first match', () => {
    const content = (
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('component')} children="A" />
        <EntitySwitch.Case if={isKind('component')} children="B" />
        <EntitySwitch.Case children="C" />
      </EntitySwitch>
    );

    render(
      <Wrapper>
        <EntityProvider
          entity={{ metadata: { name: 'mock' }, kind: 'component' } as Entity}
        >
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
  });

  it('should render the default case if entity is not found', () => {
    const content = (
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('component')} children="A" />
        <EntitySwitch.Case if={isKind('api')} children="B" />
        <EntitySwitch.Case children="C" />
      </EntitySwitch>
    );

    render(
      <Wrapper>
        <AsyncEntityProvider entity={undefined} loading={false}>
          {content}
        </AsyncEntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).toBeInTheDocument();
  });

  it(`shouldn't render any children if entity is loading and no entity exists in the context`, () => {
    const content = (
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('component')} children="A" />
        <EntitySwitch.Case if={isKind('api')} children="B" />
        <EntitySwitch.Case children="C" />
      </EntitySwitch>
    );

    render(
      <Wrapper>
        <AsyncEntityProvider entity={undefined} loading>
          {content}
        </AsyncEntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
  });

  it('should render the fallback if no cases are matching', () => {
    const content = (
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('system')} children="A" />
        <EntitySwitch.Case if={isKind('api')} children="B" />
        <EntitySwitch.Case children="C" />
      </EntitySwitch>
    );

    render(
      <Wrapper>
        <EntityProvider
          entity={{ metadata: { name: 'mock' }, kind: 'component' } as Entity}
        >
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('should render only the first fallback in case no cases are matching', () => {
    const content = (
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('system')} children="A" />
        <EntitySwitch.Case if={isKind('api')} children="B" />
        <EntitySwitch.Case children="C" />
        <EntitySwitch.Case children="D" />
      </EntitySwitch>
    );

    render(
      <Wrapper>
        <EntityProvider
          entity={{ metadata: { name: 'mock' }, kind: 'component' } as Entity}
        >
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.queryByText('D')).not.toBeInTheDocument();
  });

  it('should switch child when entity switches', () => {
    const content = (
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('component')} children="A" />
        <EntitySwitch.Case if={isKind('template')} children="B" />
        <EntitySwitch.Case children="C" />
      </EntitySwitch>
    );

    const rendered = render(
      <Wrapper>
        <EntityProvider
          entity={{ metadata: { name: 'mock' }, kind: 'component' } as Entity}
        >
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();

    rendered.rerender(
      <Wrapper>
        <EntityProvider
          entity={{ metadata: { name: 'mock' }, kind: 'template' } as Entity}
        >
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();

    rendered.rerender(
      <Wrapper>
        <EntityProvider
          entity={{ metadata: { name: 'mock' }, kind: 'derp' } as Entity}
        >
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();

    rendered.rerender(
      <Wrapper>
        <AsyncEntityProvider entity={undefined} loading={false}>
          {content}
        </AsyncEntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).toBeInTheDocument();
  });

  it('should switch child when filters switch', () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    const rendered = render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={isKind('component')} children="A" />
            <EntitySwitch.Case children="B" />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();

    rendered.rerender(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={isKind('template')} children="A" />
            <EntitySwitch.Case children="B" />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should render all elements that match the condition', () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch renderMultipleMatches="all">
            <EntitySwitch.Case if={isKind('component')} children={<p>A</p>} />
            <EntitySwitch.Case if={isKind('component')} children={<p>B</p>} />
            <EntitySwitch.Case if={isKind('system')} children={<p>C</p>} />
            <EntitySwitch.Case children={<p>D</p>} />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    expect(screen.queryByText('D')).not.toBeInTheDocument();
  });

  it('should render default element if none of the cases match', () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch renderMultipleMatches="all">
            <EntitySwitch.Case if={isKind('system')} children={<p>A</p>} />
            <EntitySwitch.Case if={isKind('system')} children={<p>B</p>} />
            <EntitySwitch.Case children={<p>C</p>} />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('should render nothing if no default case is set for multiple matches', () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch renderMultipleMatches="all">
            <EntitySwitch.Case if={isKind('system')} children={<p>A</p>} />
            <EntitySwitch.Case if={isKind('system')} children={<p>B</p>} />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });

  it('should render nothing if no default case is set for default', () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={isKind('system')} children={<p>A</p>} />
            <EntitySwitch.Case if={isKind('system')} children={<p>B</p>} />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });

  it('should display the children in case entity is available and loading is true', () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    render(
      <Wrapper>
        <AsyncEntityProvider entity={entity} loading>
          <EntitySwitch>
            <EntitySwitch.Case
              if={isKind('component')}
              children={<p>Component</p>}
            />
            <EntitySwitch.Case if={isKind('system')} children={<p>System</p>} />
          </EntitySwitch>
        </AsyncEntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('Component')).toBeInTheDocument();
    expect(screen.queryByText('System')).not.toBeInTheDocument();
  });

  it(`shouldn't unmount the children on entity refresh`, () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    let mountsCount = 0;
    function Component() {
      useEffect(() => {
        ++mountsCount;
      }, []);

      return <p>Component</p>;
    }

    const rendered = render(
      <Wrapper>
        <AsyncEntityProvider entity={entity} loading={false}>
          <EntitySwitch>
            <EntitySwitch.Case
              if={isKind('component')}
              children={<Component />}
            />
            <EntitySwitch.Case if={isKind('system')} children={<p>System</p>} />
          </EntitySwitch>
        </AsyncEntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('Component')).toBeInTheDocument();
    expect(screen.queryByText('System')).not.toBeInTheDocument();

    expect(mountsCount).toBe(1);

    rendered.rerender(
      <Wrapper>
        <AsyncEntityProvider entity={entity} loading>
          <EntitySwitch>
            <EntitySwitch.Case
              if={isKind('component')}
              children={<Component />}
            />
            <EntitySwitch.Case if={isKind('system')} children={<p>System</p>} />
          </EntitySwitch>
        </AsyncEntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('Component')).toBeInTheDocument();
    expect(screen.queryByText('System')).not.toBeInTheDocument();

    expect(mountsCount).toBe(1);

    rendered.rerender(
      <Wrapper>
        <AsyncEntityProvider entity={entity} loading={false}>
          <EntitySwitch>
            <EntitySwitch.Case
              if={isKind('component')}
              children={<Component />}
            />
            <EntitySwitch.Case if={isKind('system')} children={<p>System</p>} />
          </EntitySwitch>
        </AsyncEntityProvider>
      </Wrapper>,
    );

    expect(screen.queryByText('Component')).toBeInTheDocument();
    expect(screen.queryByText('System')).not.toBeInTheDocument();

    expect(mountsCount).toBe(1);
  });

  it('should switch with async condition that is true', async () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    const shouldRender = () => Promise.resolve(true);
    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={shouldRender} children="A" />
            <EntitySwitch.Case children="B" />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    await expect(screen.findByText('A')).resolves.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });

  it('should render all elements with async result as true', async () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    const shouldRender = () => Promise.resolve(true);
    const shouldNotRender = () => Promise.resolve(false);
    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch renderMultipleMatches="all">
            <EntitySwitch.Case if={shouldRender} children={<p>A</p>} />
            <EntitySwitch.Case if={shouldRender} children={<p>B</p>} />
            <EntitySwitch.Case if={shouldNotRender} children={<p>C</p>} />
            <EntitySwitch.Case children={<p>D</p>} />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    await expect(screen.findByText('A')).resolves.toBeInTheDocument();
    await expect(screen.findByText('B')).resolves.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    expect(screen.queryByText('D')).not.toBeInTheDocument();
  });

  it('should render default element if none of the async cases match', async () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    const shouldNotRender = () => Promise.resolve(false);
    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch renderMultipleMatches="all">
            <EntitySwitch.Case if={shouldNotRender} children={<p>A</p>} />
            <EntitySwitch.Case if={shouldNotRender} children={<p>B</p>} />
            <EntitySwitch.Case children={<p>C</p>} />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    await expect(screen.findByText('C')).resolves.toBeInTheDocument();
    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });

  it('should switch with sync condition that is false', async () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    const shouldRender = () => Promise.resolve(false);
    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={shouldRender} children="A" />
            <EntitySwitch.Case if={() => true} children="B" />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    await expect(screen.findByText('B')).resolves.toBeInTheDocument();
    expect(screen.queryByText('A')).not.toBeInTheDocument();
  });

  it('should switch with async condition that throws', async () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    const shouldRender = jest.fn().mockRejectedValue(undefined);
    render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={shouldRender} children="A" />
            <EntitySwitch.Case if={() => false} children="B" />
            <EntitySwitch.Case children="C" />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    await expect(screen.findByText('C')).resolves.toBeInTheDocument();
    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });
});
