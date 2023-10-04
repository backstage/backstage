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
import useAsync from 'react-use/lib/useAsync';
import {
  LinkButton,
  EmptyState,
  Link,
  CodeSnippet,
  InfoCard,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { catalogApiRef, CatalogApi } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { EntityFilterQuery } from '@backstage/catalog-client';
import { ClassNameMap } from '@material-ui/styles';

import { makeStyles, Theme, Typography } from '@material-ui/core';

type DocsCardProps = {
  filter: EntityFilterQuery;
  color?: 'inherit' | 'primary' | 'secondary' | undefined;
  customStyles?: ClassNameMap<string> | undefined;
  emptyState?: React.ReactNode | undefined;
  subLinkText?: string | undefined;
  title?: React.ReactNode | string | undefined;
};

const useStyles = makeStyles<Theme>(() => ({
  docDescription: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: '16px',
    marginTop: '12px',
  },
  docSubLink: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 2,
  },
  docsTitleLink: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 2,
  },
}));

/**
 * A component to display specific Featured Docs.
 * @param {EntityFilterQuery} filter - The entity filter used to display only the intended item/s
 * @param {'inherit' | 'primary' | 'secondary' | undefined} [color] - An optional color which can be customized through themes
 * @param {ClassNameMap<string> | undefined} [customStyles] - An optional ClassNameMap created with makeStyles
 * @param {React.ReactNode | undefined} [emptyState] - An optional ReactNode for empty states
 * @param {string | undefined} [subLinkText] - An optional string to customize sublink text
 * @param {React.ReactNode | string | undefined} [title] - An optional string or ReactNode to customize the card title
 *
 * @public
 */
export const FeaturedDocs = (props: DocsCardProps) => {
  const { color, customStyles, emptyState, filter, subLinkText, title } = props;
  const linkText = subLinkText || 'LEARN MORE';
  const defaultStyles = useStyles();
  const styles = customStyles || defaultStyles;
  const catalogApi: CatalogApi = useApi(catalogApiRef);
  const {
    value: entities,
    loading,
    error,
  } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: filter,
    });
    return response.items;
  });

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <WarningPanel
        severity="error"
        title="Could not load available documentation."
      >
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  return (
    <InfoCard variant="gridItem" title={title || 'Featured Docs'}>
      {entities?.length
        ? entities.map(d => (
            <div key={d.metadata.name} data-testid="docs-card-content">
              <Link
                className={styles.docsTitleLink}
                data-testid="docs-card-title"
                color={color || 'primary'}
                to={`/docs/${d.metadata.namespace || 'default'}/${d.kind}/${
                  d.metadata.name
                }/`}
              >
                {d.metadata.title}
              </Link>
              <Typography className={styles.docDescription}>
                {d.metadata.description}
              </Typography>
              <Link
                className={styles.docSubLink}
                data-testid="docs-card-sub-link"
                color={color || 'primary'}
                to={`/docs/${d.metadata.namespace || 'default'}/${d.kind}/${
                  d.metadata.name
                }/`}
              >
                {linkText}
              </Link>
            </div>
          ))
        : emptyState || (
            <EmptyState
              missing="data"
              title="No documents to show"
              description="Create your own document. Check out our Getting Started Information"
              action={
                <LinkButton
                  color={color || 'primary'}
                  to="https://backstage.io/docs/features/techdocs/getting-started"
                  variant="contained"
                >
                  DOCS
                </LinkButton>
              }
            />
          )}
    </InfoCard>
  );
};
