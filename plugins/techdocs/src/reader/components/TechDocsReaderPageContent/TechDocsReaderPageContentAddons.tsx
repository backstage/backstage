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

import Portal from '@material-ui/core/Portal';
import {
  useTechDocsAddons,
  TechDocsAddonLocations as locations,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';

/** Keeps sidebar addons in the same scrollable region as their content. */
const getSidebarAddonLocation = (
  sidebarElement: Element | null | undefined,
  location: string,
) => {
  if (!sidebarElement) {
    return undefined;
  }

  const scrollWrap = Array.from(sidebarElement.children).find(child =>
    child.classList.contains('md-sidebar__scrollwrap'),
  );
  const container = scrollWrap ?? sidebarElement;
  let addonLocation = sidebarElement.querySelector(
    `[data-techdocs-addons-location="${location}"]`,
  );

  if (!addonLocation) {
    addonLocation = document.createElement('div');
    addonLocation.setAttribute('data-techdocs-addons-location', location);
  }
  if (addonLocation.parentElement !== container) {
    container.prepend(addonLocation);
  }

  return addonLocation;
};

export const TechDocsReaderPageContentAddons = () => {
  const addons = useTechDocsAddons();

  const { shadowRoot } = useTechDocsReaderPage();

  const contentElement = shadowRoot?.querySelector(
    '[data-md-component="content"]',
  );

  const primarySidebarElement = shadowRoot?.querySelector(
    'div[data-md-component="sidebar"][data-md-type="navigation"], div[data-md-component="navigation"]',
  );
  const primarySidebarAddonLocation = getSidebarAddonLocation(
    primarySidebarElement,
    'primary sidebar',
  );

  const secondarySidebarElement = shadowRoot?.querySelector(
    'div[data-md-component="sidebar"][data-md-type="toc"], div[data-md-component="toc"]',
  );
  const secondarySidebarAddonLocation = getSidebarAddonLocation(
    secondarySidebarElement,
    'secondary sidebar',
  );

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
