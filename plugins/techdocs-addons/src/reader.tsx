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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { Content, Header, Page, Progress } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
// todo(backstage/techdocs-core): Export these from @backstage/plugin-techdocs
import {
  // @ts-ignore
  useTechDocsReaderDom,
  // @ts-ignore
  withTechDocsReaderProvider,
  // @ts-ignore
  TechDocsStateIndicator as TechDocReaderPageIndicator,
} from '@backstage/plugin-techdocs';
import {
  withStyles,
  Portal,
  Box,
  Toolbar,
  ToolbarProps,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import React, { useEffect, useRef, useState } from 'react';
import { create } from 'jss';
import Helmet from 'react-helmet';

import { useTechDocsAddons } from './addons';
import {
  TechDocsMetadataProvider,
  useMetadata,
  TechDocsEntityProvider,
  TechDocsReaderPageProvider,
  useTechDocsReaderPage,
} from './context';
import { TechDocsAddonLocations as locations } from './types';

const TechDocsReaderPageSubheader = withStyles(theme => ({
  root: {
    gridArea: 'pageSubheader',
    flexDirection: 'column',
    minHeight: 'auto',
    padding: theme.spacing(3, 3, 0),
  },
}))(({ ...rest }: ToolbarProps) => {
  const addons = useTechDocsAddons();

  if (!addons.renderComponentsWithLocation(locations.SUBHEADER)) return null;

  return (
    <Toolbar {...rest}>
      {addons.renderComponentsWithLocation(locations.SUBHEADER) && (
        <Box
          display="flex"
          justifyContent="flex-end"
          width="100%"
          flexWrap="wrap"
        >
          {addons.renderComponentsWithLocation(locations.SUBHEADER)}
        </Box>
      )}
    </Toolbar>
  );
});

const skeleton = <Skeleton animation="wave" variant="text" height={40} />;

const TechDocsReaderPageHeader = () => {
  const addons = useTechDocsAddons();
  const configApi = useApi(configApiRef);

  const metadata = useMetadata();

  const { title, setTitle, subtitle, setSubtitle } = useTechDocsReaderPage();

  useEffect(() => {
    if (!metadata) return;
    setTitle(prevTitle => prevTitle || metadata.site_name);
    setSubtitle(
      prevSubtitle => prevSubtitle || metadata.site_description || 'Home',
    );
  }, [metadata, setTitle, setSubtitle]);

  const appTitle = configApi.getOptional('app.title') || 'Backstage';
  const tabTitle = [subtitle, title, appTitle].filter(Boolean).join(' | ');

  return (
    <Header
      type="Documentation"
      title={title || skeleton}
      subtitle={subtitle || skeleton}
    >
      <Helmet titleTemplate="%s">
        <title>{tabTitle}</title>
      </Helmet>
      {addons.renderComponentsWithLocation(locations.HEADER)}
    </Header>
  );
};

const TechDocsReaderPageContent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [jss, setJss] = useState(
    create({
      ...jssPreset(),
      insertionPoint: undefined,
    }),
  );

  const addons = useTechDocsAddons();
  const { entityName, setShadowRoot } = useTechDocsReaderPage();
  const dom = useTechDocsReaderDom(entityName);

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
    '[data-md-component="navigation"]',
  );
  const secondarySidebarElement = ref.current?.shadowRoot?.querySelector(
    '[data-md-component="toc"]',
  );

  const primarySidebarAddonSpace = document.createElement('div');
  primarySidebarElement?.prepend(primarySidebarAddonSpace);

  const secondarySidebarAddonSpace = document.createElement('div');
  secondarySidebarElement?.prepend(secondarySidebarAddonSpace);

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
        <Portal container={primarySidebarAddonSpace}>
          {addons.renderComponentsWithLocation(locations.PRIMARY_SIDEBAR)}
        </Portal>
        <Portal container={contentElement}>
          {addons.renderComponentsWithLocation(locations.CONTENT)}
        </Portal>
        <Portal container={secondarySidebarAddonSpace}>
          {addons.renderComponentsWithLocation(locations.SECONDARY_SIDEBAR)}
        </Portal>
      </StylesProvider>
    </Content>
  );
};

/**
 * @public
 */
export type TechDocsReaderPageProps = { entityName: CompoundEntityRef };

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const { entityName } = props;
  const Component = withTechDocsReaderProvider(() => {
    return (
      <TechDocsMetadataProvider entityName={entityName}>
        <TechDocsEntityProvider entityName={entityName}>
          <TechDocsReaderPageProvider entityName={entityName}>
            <Page themeId="documentation">
              <TechDocsReaderPageHeader />
              <TechDocsReaderPageSubheader />
              <TechDocReaderPageIndicator />
              <TechDocsReaderPageContent />
            </Page>
          </TechDocsReaderPageProvider>
        </TechDocsEntityProvider>
      </TechDocsMetadataProvider>
    );
  }, entityName);
  return <Component />;
};
