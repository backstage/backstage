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

import React, { PropsWithChildren } from 'react';

import { makeStyles, Grid } from '@material-ui/core';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { Content, ErrorPage } from '@backstage/core-components';
import {
  useTechDocsReaderPage,
  withTechDocsReaderPageContentProvider,
} from '@backstage/plugin-techdocs-react';

import { TechDocsSearch } from '../../../search';
import { TechDocsStateIndicator } from '../TechDocsStateIndicator';

const useStyles = makeStyles({
  search: {
    width: '100%',
    '@media (min-width: 76.1875em)': {
      width: 'calc(100% - 34.4rem)',
      margin: '0 auto',
    },
  },
});

/**
 * Props for {@link TechDocsReaderPageContent}
 * @public
 */
export type TechDocsReaderPageContentProps = PropsWithChildren<{
  /**
   * @deprecated No need to pass down entityRef as property anymore. Consumes the entityName from `TechDocsReaderPageContext`. Use the {@link @backstage/plugin-techdocs-react#useTechDocsReaderPage} hook for custom reader page content.
   */
  entityRef?: CompoundEntityRef;
  /**
   * Show or hide the search bar, defaults to true.
   */
  withSearch?: boolean;
  /**
   * @deprecated No need to pass down onReady as property anymore. Consumes the setReady from `TechDocsReaderPageContext`.
   */
  onReady?: () => void;
}>;

/**
 * Renders the reader page content
 * @public
 */
export const TechDocsReaderPageContent =
  withTechDocsReaderPageContentProvider<TechDocsReaderPageContentProps>(
    props => {
      const { withSearch = true, children } = props;

      const classes = useStyles();

      const {
        entityRef,
        entityMetadata: {
          value: entityMetadata,
          loading: entityMetadataLoading,
        },
      } = useTechDocsReaderPage();

      // No entity metadata = 404. Don't render content at all.
      if (entityMetadataLoading === false && !entityMetadata) {
        return <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />;
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
                />
              </Grid>
            )}
            <Grid xs={12} item>
              {children}
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
