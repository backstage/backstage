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

import { Content, Progress } from '@backstage/core-components';
import { Portal } from '@material-ui/core';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import { create } from 'jss';

import { useTechDocsAddons } from '../../addons';
import { useTechDocsReaderPage } from '../../context';
import { TechDocsAddonLocations as locations } from '../../types';

export const TechDocsReaderPageContent = ({ dom }: { dom: Element | null }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [jss, setJss] = useState(
    create({
      ...jssPreset(),
      insertionPoint: undefined,
    }),
  );

  const addons = useTechDocsAddons();
  const { setShadowRoot } = useTechDocsReaderPage();

  useEffect(() => {
    const shadowHost = ref.current;
    if (!dom || !shadowHost || shadowHost.shadowRoot) return;

    setJss(
      create({
        ...jssPreset(),
        insertionPoint: dom.querySelector('head') || undefined,
      }),
    );

    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(dom);
    setShadowRoot(shadowRoot);
  }, [dom, setShadowRoot]);

  const contentElement = ref.current?.shadowRoot?.querySelector(
    '[data-md-component="container"]',
  );
  const primarySidebarElement = ref.current?.shadowRoot?.querySelector(
    'div[data-md-component="sidebar"][data-md-type="navigation"], div[data-md-component="navigation"]',
  );
  const secondarySidebarElement = ref.current?.shadowRoot?.querySelector(
    'div[data-md-component="sidebar"][data-md-type="toc"], div[data-md-component="toc"]',
  );

  const primarySidebarAddonLocation = document.createElement('div');
  primarySidebarElement?.prepend(primarySidebarAddonLocation);

  const secondarySidebarAddonLocation = document.createElement('div');
  secondarySidebarElement?.prepend(secondarySidebarAddonLocation);

  // do not return content until dom is ready
  if (!dom) {
    return (
      <Content>
        <Progress />
      </Content>
    );
  }

  return (
    <Content>
      {/* sheetsManager={new Map()} is needed in order to deduplicate the injection of CSS in the page. */}
      <StylesProvider jss={jss} sheetsManager={new Map()}>
        <div ref={ref} data-testid="techdocs-native-shadowroot" />
        <Portal container={primarySidebarAddonLocation}>
          {addons.renderComponentsByLocation(locations.PRIMARY_SIDEBAR)}
        </Portal>
        <Portal container={contentElement}>
          {addons.renderComponentsByLocation(locations.CONTENT)}
        </Portal>
        <Portal container={secondarySidebarAddonLocation}>
          {addons.renderComponentsByLocation(locations.SECONDARY_SIDEBAR)}
        </Portal>
      </StylesProvider>
    </Content>
  );
};
