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

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { TechDocsShadowDom } from '@backstage/plugin-techdocs-react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Content, Progress } from '@backstage/core-components';

import { TechDocsSearch } from '../../../search';
import { TechDocsStateIndicator } from '../TechDocsStateIndicator';

import { withTechDocsReaderProvider } from '../TechDocsReaderProvider';
import { TechDocsReaderPageContentAddons } from './TechDocsReaderPageContentAddons';
import { useTechDocsReaderContentData } from '../../../hooks/useTechDocsReaderContentData';

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
   * Path in the docs to render by default. This should be used when rendering docs for an entity that specifies the
   * "backstage.io/techdocs-entity-path" annotation for deep linking into another entities docs.
   */
  defaultPath?: string;
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
    const { withSearch = true, searchResultUrlMapper } = props;
    const classes = useStyles();

    const {
      entityRef,
      entityMetadata,
      dom,
      handleAppend,
      isNotFound,
      isDomReady,
      showProgress,
      NotFoundErrorPage,
    } = useTechDocsReaderContentData({
      defaultPath: props.defaultPath,
      onReady: props.onReady,
    });

    if (isNotFound) return <NotFoundErrorPage />;

    if (!isDomReady) {
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
            {showProgress && <Progress />}

            <TechDocsShadowDom element={dom!} onAppend={handleAppend}>
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
