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
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { render } from '@testing-library/react';
import React from 'react';
import { isKind } from './conditions';
import { EntitySwitch } from './EntitySwitch';
import { featureFlagsApiRef } from '@backstage/core-plugin-api';
import {
  LocalStorageFeatureFlags,
  ApiProvider,
  ApiRegistry,
} from '@backstage/core-app-api';

const mockFeatureFlagsApi = new LocalStorageFeatureFlags();
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <ApiProvider apis={ApiRegistry.with(featureFlagsApiRef, mockFeatureFlagsApi)}>
    {children}
  </ApiProvider>
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
        <EntityProvider entity={{ kind: 'component' } as Entity}>
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(rendered.queryByText('A')).toBeInTheDocument();
    expect(rendered.queryByText('B')).not.toBeInTheDocument();
    expect(rendered.queryByText('C')).not.toBeInTheDocument();

    rendered.rerender(
      <Wrapper>
        <EntityProvider entity={{ kind: 'template' } as Entity}>
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(rendered.queryByText('A')).not.toBeInTheDocument();
    expect(rendered.queryByText('B')).toBeInTheDocument();
    expect(rendered.queryByText('C')).not.toBeInTheDocument();

    rendered.rerender(
      <Wrapper>
        <EntityProvider entity={{ kind: 'derp' } as Entity}>
          {content}
        </EntityProvider>
      </Wrapper>,
    );

    expect(rendered.queryByText('A')).not.toBeInTheDocument();
    expect(rendered.queryByText('B')).not.toBeInTheDocument();
    expect(rendered.queryByText('C')).toBeInTheDocument();
  });

  it('should switch child when filters switch', () => {
    const entity = { kind: 'component' } as Entity;

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

    expect(rendered.queryByText('A')).toBeInTheDocument();
    expect(rendered.queryByText('B')).not.toBeInTheDocument();

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

    expect(rendered.queryByText('A')).not.toBeInTheDocument();
    expect(rendered.queryByText('B')).toBeInTheDocument();
  });

  it('should switch with async condition that is true', async () => {
    const entity = { kind: 'component' } as Entity;

    const shouldRender = () => Promise.resolve(true);
    const rendered = render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={shouldRender} children="A" />
            <EntitySwitch.Case children="B" />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    await expect(rendered.findByText('A')).resolves.toBeInTheDocument();
    expect(rendered.queryByText('B')).not.toBeInTheDocument();
  });

  it('should switch with sync condition that is false', async () => {
    const entity = { kind: 'component' } as Entity;

    const shouldRender = () => Promise.resolve(false);
    const rendered = render(
      <Wrapper>
        <EntityProvider entity={entity}>
          <EntitySwitch>
            <EntitySwitch.Case if={shouldRender} children="A" />
            <EntitySwitch.Case if={() => true} children="B" />
          </EntitySwitch>
        </EntityProvider>
      </Wrapper>,
    );

    await expect(rendered.findByText('B')).resolves.toBeInTheDocument();
    expect(rendered.queryByText('A')).not.toBeInTheDocument();
  });

  it('should switch with sync condition that throws', async () => {
    const entity = { kind: 'component' } as Entity;

    const shouldRender = () => Promise.reject();
    const rendered = render(
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

    await expect(rendered.findByText('C')).resolves.toBeInTheDocument();
    expect(rendered.queryByText('A')).not.toBeInTheDocument();
    expect(rendered.queryByText('B')).not.toBeInTheDocument();
  });
});
