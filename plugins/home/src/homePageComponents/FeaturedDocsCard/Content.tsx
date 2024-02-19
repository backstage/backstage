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
  Progress,
  ErrorPanel,
} from '@backstage/core-components';
import {
  catalogApiRef,
  CatalogApi,
  EntityDisplayName,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { EntityFilterQuery } from '@backstage/catalog-client';

import { makeStyles, Typography } from '@material-ui/core';
import { stringifyEntityRef } from '@backstage/catalog-model';

/**
 * Props customizing the <FeaturedDocsCard/> component.
 *
 * @public
 */
export type FeaturedDocsCardProps = {
  /** The entity filter used to display only the intended item/s */
  filter: EntityFilterQuery;
  /** An optional ReactNode for empty states */
  emptyState?: React.JSX.Element;
  /** An optional linkDestination to set for the Featured Doc  */
  linkDestination?: string;
  /** An optional limit to set for link destination  */
  responseLimit?: number;
  /** An optional string to customize sublink text */
  subLinkText?: string;
};

const useStyles = makeStyles(
  theme => ({
    docDescription: {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.body1.fontWeight,
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    docSubLink: {
      fontSize: theme.typography.subtitle1.fontSize,
      fontWeight: theme.typography.subtitle1.fontWeight,
      lineHeight: theme.typography.subtitle1.lineHeight,
    },
    docsTitleLink: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.h6.fontWeight,
      lineHeight: theme.typography.h6.lineHeight,
    },
  }),
  { name: 'HomeFeaturedDocsCard' },
);

/**
 * A component to display specific Featured Docs.
 *
 * @public
 */
export const Content = (props: FeaturedDocsCardProps): JSX.Element => {
  const { emptyState, filter, linkDestination, responseLimit, subLinkText } =
    props;
  const linkText = subLinkText || 'LEARN MORE';
  const styles = useStyles();
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

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel error={error} />;
  }

  return entities?.length ? (
    <>
      {entities.map(d => (
        <div
          key={`${d.metadata.name}-${d.kind}-${d.metadata.namespace}`}
          data-testid="docs-card-content"
        >
          <Link
            className={styles.docsTitleLink}
            data-testid="docs-card-title"
            to={
              linkDestination ||
              `/docs/${d.metadata.namespace || 'default'}/${d.kind}/${
                d.metadata.name
              }/`
            }
          >
            <EntityDisplayName entityRef={stringifyEntityRef(d)} />
          </Link>
          {d.metadata.description && (
            <Typography className={styles.docDescription}>
              {d.metadata.description}
            </Typography>
          )}
          <Link
            className={styles.docSubLink}
            data-testid="docs-card-sub-link"
            to={
              linkDestination ||
              `/docs/${d.metadata.namespace || 'default'}/${d.kind}/${
                d.metadata.name
              }/`
            }
          >
            {linkText}
          </Link>
        </div>
      ))}
    </>
  ) : (
    emptyState || (
      <EmptyState
        missing="data"
        title="No documents to show"
        description="Create your own document. Check out our Getting Started Information"
        action={
          <LinkButton
            to="https://backstage.io/docs/features/techdocs/getting-started"
            variant="contained"
          >
            DOCS
          </LinkButton>
        }
      />
    )
  );
};
