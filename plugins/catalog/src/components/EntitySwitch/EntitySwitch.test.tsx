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
import React from 'react';
import { isKind } from './conditions';
import { EntitySwitch } from './EntitySwitch';
import { featureFlagsApiRef } from '@backstage/core-plugin-api';
import { LocalStorageFeatureFlags } from '@backstage/core-app-api';
import { TestApiProvider } from '@backstage/test-utils';

const mockFeatureFlagsApi = new LocalStorageFeatureFlags();
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <TestApiProvider apis={[[featureFlagsApiRef, mockFeatureFlagsApi]]}>
    {children}
  </TestApiProvider>
);

describe('EntitySwitch', () => {
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
    expect(screen.getByText('C')).toBeInTheDocument();
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

  it('should switch with sync condition that throws', async () => {
    const entity = { metadata: { name: 'mock' }, kind: 'component' } as Entity;

    const shouldRender = () => Promise.reject();
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
