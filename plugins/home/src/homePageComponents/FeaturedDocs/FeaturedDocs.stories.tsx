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

import { FeaturedDocs } from '../../plugin';
import React, { ComponentType, PropsWithChildren } from 'react';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

const docsEntities = [
  {
    apiVersion: '1',
    kind: 'Location',
    metadata: {
      name: 'getting-started-with-backstage',
      title: 'Getting Started Docs',
      description:
        'An awesome doc you want to feature to help out your customers. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium magna ut molestie lacinia. Nullam eget bibendum est, vitae finibus neque.',
    },
    spec: {
      type: 'documentation',
    },
  },
];

const mockCatalogApi = {
  getEntities: async () => ({ items: docsEntities }),
};

const useStyles = makeStyles<Theme>(() => ({
  cardTitleIcon: {
    verticalAlign: 'bottom',
    marginLeft: '-4px',
  },
  docDescription: {
    marginBottom: '16px',
    marginTop: '12px',
  },
  docSubLink: {
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 2,
  },
  docsTitleLink: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 3,
  },
}));

export default {
  title: 'Plugins/Home/Components/FeaturedDocs',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
          <Story />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      ),
  ],
};

export const Default = () => {
  return (
    <Grid item xs={12} md={6}>
      <FeaturedDocs
        filter={{
          'spec.type': 'documentation',
          'metadata.name': 'getting-started-with-backstage',
        }}
        title="Featured Doc"
      />
    </Grid>
  );
};

export const ExampleCustomized = () => {
  const styles = useStyles();
  const cardTitle = (
    <>
      <WarningIcon fontSize="large" className={styles.cardTitleIcon} />
      &nbsp; Important
    </>
  );
  return (
    <Grid item xs={12} md={6}>
      <FeaturedDocs
        filter={{
          'spec.type': 'documentation',
          'metadata.name': 'getting-started-with-backstage',
        }}
        title={cardTitle}
        customStyles={styles}
        subLinkText="More Details"
        color="secondary"
      />
    </Grid>
  );
};
