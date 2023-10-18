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
  InfoCard,
  Progress,
  ErrorPanel,
} from '@backstage/core-components';
import { catalogApiRef, CatalogApi } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { EntityFilterQuery } from '@backstage/catalog-client';
import { ClassNameMap } from '@material-ui/styles';

import { makeStyles, Theme, Typography } from '@material-ui/core';

/**
 * Props customizing the <FeaturedDocs/> component.
 *
 * @public
 */
export type FeaturedDocsProps = {
  /** The entity filter used to display only the intended item/s */
  filter: EntityFilterQuery;
  /** An optional color which can be customized through themes */
  color?: 'inherit' | 'primary' | 'secondary' | undefined;
  /** An optional ClassNameMap created with makeStyles */
  customStyles?: ClassNameMap<string> | undefined;
  /** An optional ReactNode for empty states */
  emptyState?: React.ReactNode | undefined;
  /** An optional path to set for entity entry  */
  path?: string | undefined;
  /** An optional limit to set for link destination  */
  responseLimit?: number | undefined;
  /** An optional string to customize sublink text */
  subLinkText?: string | undefined;
  /** An optional string or ReactNode to customize the card title */
  title?: React.ReactNode | string | undefined;
};

const useStyles = makeStyles<Theme>(theme => ({
  docDescription: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
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
 *
 * @public
 */
export const FeaturedDocs = (props: FeaturedDocsProps) => {
  const {
    color,
    customStyles,
    emptyState,
    filter,
    path,
    responseLimit,
    subLinkText,
    title,
  } = props;
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
      limit: responseLimit || 10,
    });
    return response.items;
  });

  return (
    <InfoCard variant="gridItem" title={title || 'Featured Docs'}>
      {loading && <Progress />}
      {error && <ErrorPanel error={error} />}
      {entities?.length
        ? entities.map(d => (
            <div key={d.metadata.name} data-testid="docs-card-content">
              <Link
                className={styles.docsTitleLink}
                data-testid="docs-card-title"
                color={color || 'primary'}
                to={
                  path ||
                  `/docs/${d.metadata.namespace || 'default'}/${d.kind}/${
                    d.metadata.name
                  }/`
                }
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
                to={
                  path ||
                  `/docs/${d.metadata.namespace || 'default'}/${d.kind}/${
                    d.metadata.name
                  }/`
                }
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
