/*
 * Copyright 2026 The Backstage Authors
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

import { Suspense } from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import {
  attachComponentData,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import {
  getDataKeyByName,
  TECHDOCS_ADDONS_KEY,
  TechDocsAddons,
  useTechDocsAddons,
} from './addons';
import { TechDocsAddonLocations, TechDocsAddonOptions } from './types';

let addonReady = false;
let resolveAddon: () => void;
let addonPromise: Promise<void>;

const SuspendedAddon = () => {
  if (!addonReady) {
    throw addonPromise;
  }
  return <div>Addon content</div>;
};
const VisibleAddon = () => <div>Visible addon content</div>;

const addonOptions: TechDocsAddonOptions = {
  name: 'Suspended',
  location: TechDocsAddonLocations.Header,
  component: SuspendedAddon,
};
const visibleAddonOptions: TechDocsAddonOptions = {
  name: 'Visible',
  location: TechDocsAddonLocations.Header,
  component: VisibleAddon,
};

attachComponentData(SuspendedAddon, TECHDOCS_ADDONS_KEY, addonOptions);
attachComponentData(SuspendedAddon, getDataKeyByName(addonOptions.name), true);
attachComponentData(VisibleAddon, TECHDOCS_ADDONS_KEY, visibleAddonOptions);
attachComponentData(
  VisibleAddon,
  getDataKeyByName(visibleAddonOptions.name),
  true,
);

const LocationReader = () => {
  const addons = useTechDocsAddons();

  return (
    <>
      <div>Reader content</div>
      {addons.renderComponentsByLocation(TechDocsAddonLocations.Header)}
      <Outlet />
    </>
  );
};

const NamedReader = () => {
  const addons = useTechDocsAddons();

  return (
    <>
      <div>Reader content</div>
      {addons.renderComponentByName(addonOptions.name)}
      <Outlet />
    </>
  );
};

describe('useTechDocsAddons', () => {
  beforeEach(() => {
    addonReady = false;
    addonPromise = new Promise(resolve => {
      resolveAddon = () => {
        addonReady = true;
        resolve();
      };
    });
  });

  it('keeps the reader visible while an addon rendered by location suspends', async () => {
    render(
      <TestApiProvider
        apis={[
          [
            featureFlagsApiRef,
            {
              registerFlag: () => {},
              getRegisteredFlags: () => [],
              isActive: () => false,
              save: () => {},
            },
          ],
        ]}
      >
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Suspense fallback={<div>Reader fallback</div>}>
            <Routes>
              <Route path="/" element={<LocationReader />}>
                <Route
                  index
                  element={
                    <TechDocsAddons>
                      <VisibleAddon />
                      <SuspendedAddon />
                    </TechDocsAddons>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </MemoryRouter>
      </TestApiProvider>,
    );

    expect(screen.getByText('Reader content')).toBeInTheDocument();
    expect(screen.getByText('Visible addon content')).toBeInTheDocument();
    expect(screen.queryByText('Reader fallback')).not.toBeInTheDocument();

    await act(async () => resolveAddon());
    expect(screen.getByText('Addon content')).toBeInTheDocument();
  });

  it('keeps the reader visible while an addon rendered by name suspends', async () => {
    render(
      <TestApiProvider
        apis={[
          [
            featureFlagsApiRef,
            {
              registerFlag: () => {},
              getRegisteredFlags: () => [],
              isActive: () => false,
              save: () => {},
            },
          ],
        ]}
      >
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Suspense fallback={<div>Reader fallback</div>}>
            <Routes>
              <Route path="/" element={<NamedReader />}>
                <Route
                  index
                  element={
                    <TechDocsAddons>
                      <SuspendedAddon />
                    </TechDocsAddons>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </MemoryRouter>
      </TestApiProvider>,
    );

    expect(screen.getByText('Reader content')).toBeInTheDocument();
    expect(screen.queryByText('Reader fallback')).not.toBeInTheDocument();

    await act(async () => resolveAddon());
    expect(screen.getByText('Addon content')).toBeInTheDocument();
  });
});
