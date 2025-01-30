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

import React, { useCallback, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import {
  TechDocsShadowDom,
  useShadowDomStylesLoading,
  useShadowRootElements,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Content, Progress } from '@backstage/core-components';

import { TechDocsSearch } from '../../../search';
import { TechDocsStateIndicator } from '../TechDocsStateIndicator';

import { useTechDocsReaderDom } from './dom';
import {
  useTechDocsReader,
  withTechDocsReaderProvider,
} from '../TechDocsReaderProvider';
import { TechDocsReaderPageContentAddons } from './TechDocsReaderPageContentAddons';
import { useApp } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  search: {
    width: '100%',
    '@media (min-width: 76.1875em)': {
      width: 'calc(100% - 34.4rem)',
      margin: '0 auto',
    },
    '@media print': {
      display: 'none',
    },
  },
});

/**
 * Props for {@link TechDocsReaderPageContent}
 * @public
 */
export type TechDocsReaderPageContentProps = {
  /**
   * @deprecated No need to pass down entityRef as property anymore. Consumes the entityName from `TechDocsReaderPageContext`. Use the {@link @backstage/plugin-techdocs-react#useTechDocsReaderPage} hook for custom reader page content.
   */
  entityRef?: CompoundEntityRef;
  /**
   * Show or hide the search bar, defaults to true.
   */
  withSearch?: boolean;
  /**
   * If {@link TechDocsReaderPageContentProps.withSearch | withSearch} is true,
   * this will redirect the search result urls, e.g. turn search results into
   * links within the "Docs" tab of the entity page, instead of the global docs
   * page.
   */
  searchResultUrlMapper?: (url: string) => string;
  /**
   * Callback called when the content is rendered.
   */
  onReady?: () => void;
};

/**
 * Renders the reader page content
 * @public
 */
export const TechDocsReaderPageContent = withTechDocsReaderProvider(
  (props: TechDocsReaderPageContentProps) => {
    const { withSearch = true, searchResultUrlMapper, onReady } = props;
    const classes = useStyles();

    const {
      entityMetadata: { value: entityMetadata, loading: entityMetadataLoading },
      entityRef,
      setShadowRoot,
    } = useTechDocsReaderPage();
    const { state } = useTechDocsReader();
    const dom = useTechDocsReaderDom(entityRef);
    const path = window.location.pathname;
    const hash = window.location.hash;
    const isStyleLoading = useShadowDomStylesLoading(dom);
    const [hashElement] = useShadowRootElements([`[id="${hash.slice(1)}"]`]);
    const app = useApp();
    const { NotFoundErrorPage } = app.getComponents();

    useEffect(() => {
      if (isStyleLoading) return;

      if (hash) {
        if (hashElement) {
          hashElement.scrollIntoView();
        }
      } else {
        document?.querySelector('header')?.scrollIntoView();
      }
    }, [path, hash, hashElement, isStyleLoading]);

    const handleAppend = useCallback(
      (newShadowRoot: ShadowRoot) => {
        setShadowRoot(newShadowRoot);
        if (onReady instanceof Function) {
          onReady();
        }
      },
      [setShadowRoot, onReady],
    );

    // No entity metadata = 404. Don't render content at all.
    if (entityMetadataLoading === false && !entityMetadata)
      return <NotFoundErrorPage />;

    // Do not return content until dom is ready; instead, render a state
    // indicator, which handles progress and content errors on our behalf.
    if (!dom) {
      return (
        <Content>
          <Grid container>
            <Grid xs={12} item>
              <TechDocsStateIndicator />
            </Grid>
          </Grid>
        </Content>
      );
    }

    return (
      <Content>
        <Grid container>
          <Grid xs={12} item>
            <TechDocsStateIndicator />
          </Grid>
          {withSearch && (
            <Grid className={classes.search} xs="auto" item>
              <TechDocsSearch
                entityId={entityRef}
                entityTitle={entityMetadata?.metadata?.title}
                searchResultUrlMapper={searchResultUrlMapper}
              />
            </Grid>
          )}
          <Grid xs={12} item>
            {/* Centers the styles loaded event to avoid having multiple locations setting the opacity style in Shadow Dom causing the screen to flash multiple times */}
            {(state === 'CHECKING' || isStyleLoading) && <Progress />}

            <TechDocsShadowDom element={dom} onAppend={handleAppend}>
              <TechDocsReaderPageContentAddons />
            </TechDocsShadowDom>
          </Grid>
        </Grid>
      </Content>
    );
  },
);

/**
 * Props for {@link Reader}
 *
 * @public
 * @deprecated use `TechDocsReaderPageContentProps` instead.
 */
export type ReaderProps = TechDocsReaderPageContentProps;

/**
 * Component responsible for rendering TechDocs documentation
 * @public
 * @deprecated use `TechDocsReaderPageContent` component instead.
 */
export const Reader = TechDocsReaderPageContent;
