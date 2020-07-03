/*
 * Copyright 2020 Spotify AB
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
import { useNavigate } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { ItemCard } from '@backstage/core';
import { TechDocsPageWrapper } from './TechDocsPageWrapper';

type DocumentationSite = {
  title: string;
  description: string;
  tags: Array<string>;
  path: string;
  btnLabel: string;
};

const documentationSites: Array<DocumentationSite> = [
  {
    title: 'MkDocs',
    description:
      "MkDocs is a fast, simple and downright gorgeous static site generator that's geared towards building project documentation. ",
    tags: ['Developer Tool'],
    path: '/docs/mkdocs',
    btnLabel: 'Read Docs',
  },
  {
    title: 'Backstage Docs',
    description:
      'Getting started guides, API Overview, documentation around how to Create a Plugin and more. ',
    tags: ['Service'],
    path: '/docs/backstage-microsite',
    btnLabel: 'Read Docs',
  },
];
export const TechDocsHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <TechDocsPageWrapper
        title="Documentation"
        subtitle="Documentation available in Backstage"
      >
        <Grid container data-testid="docs-explore">
          {documentationSites.map((site: DocumentationSite, index: number) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              <ItemCard
                onClick={() => navigate(site.path)}
                tags={site.tags}
                title={site.title}
                label={site.btnLabel}
                description={site.description}
              />
            </Grid>
          ))}
        </Grid>
      </TechDocsPageWrapper>
    </>
  );
};
