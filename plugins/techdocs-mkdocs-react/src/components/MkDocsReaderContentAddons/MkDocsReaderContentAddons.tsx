/*
 * Copyright 2022 The Backstage Authors
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
import { Portal } from '@material-ui/core';
import {
  useTechDocsAddons,
  TechDocsAddonLocations as locations,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';

export const MkDocsReaderContentAddons = () => {
  const addons = useTechDocsAddons();

  const { shadowRoot } = useTechDocsReaderPage();

  const contentElement = shadowRoot?.querySelector(
    '[data-md-component="content"]',
  );

  const primarySidebarElement = shadowRoot?.querySelector(
    'div[data-md-component="sidebar"][data-md-type="navigation"], div[data-md-component="navigation"]',
  );
  let primarySidebarAddonLocation = primarySidebarElement?.querySelector(
    '[data-techdocs-addons-location="primary sidebar"]',
  );
  if (!primarySidebarAddonLocation) {
    primarySidebarAddonLocation = document.createElement('div');
    primarySidebarAddonLocation.setAttribute(
      'data-techdocs-addons-location',
      'primary sidebar',
    );
    primarySidebarElement?.prepend(primarySidebarAddonLocation);
  }

  const secondarySidebarElement = shadowRoot?.querySelector(
    'div[data-md-component="sidebar"][data-md-type="toc"], div[data-md-component="toc"]',
  );
  let secondarySidebarAddonLocation = secondarySidebarElement?.querySelector(
    '[data-techdocs-addons-location="secondary sidebar"]',
  );
  if (!secondarySidebarAddonLocation) {
    secondarySidebarAddonLocation = document.createElement('div');
    secondarySidebarAddonLocation.setAttribute(
      'data-techdocs-addons-location',
      'secondary sidebar',
    );
    secondarySidebarElement?.prepend(secondarySidebarAddonLocation);
  }

  return (
    <>
      <Portal container={primarySidebarAddonLocation}>
        {addons.renderComponentsByLocation(locations.PrimarySidebar)}
      </Portal>
      <Portal container={contentElement}>
        {addons.renderComponentsByLocation(locations.Content)}
      </Portal>
      <Portal container={secondarySidebarAddonLocation}>
        {addons.renderComponentsByLocation(locations.SecondarySidebar)}
      </Portal>
    </>
  );
};
