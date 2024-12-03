/*
 * Copyright 2021 The Backstage Authors
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

import { rootDocsRouteRef } from '../../../routes';
import { toLowerMaybe } from '../../../helpers';
import { Entity } from '@backstage/catalog-model';
import { useApi, useRouteRef, configApiRef } from '@backstage/core-plugin-api';
import { ItemCardGrid, InfoCard, Link } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

/** @public */
export type InfoCardGridClassKey = 'linkSpacer' | 'readMoreLink';

const useStyles = makeStyles(
  theme => ({
    linkSpacer: {
      paddingTop: theme.spacing(0.2),
    },
    readMoreLink: {
      paddingTop: theme.spacing(0.2),
    },
  }),
  { name: 'BackstageInfoCardGrid' },
);

/**
 * Props for {@link InfoCardGrid}
 *
 * @public
 */
export type InfoCardGridProps = {
  entities: Entity[] | undefined;
  linkContent?: string | JSX.Element;
  linkDest?: (entity: Entity) => string;
};

/**
 * Component which accepts a list of entities and renders a info card for each entity
 *
 * @public
 */
export const InfoCardGrid = (props: InfoCardGridProps) => {
  const { entities, linkContent, linkDest } = props;
  const classes = useStyles();
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);
  const config = useApi(configApiRef);
  const linkDestination = (entity: Entity) =>
    typeof linkDest === 'function'
      ? linkDest(entity)
      : getRouteToReaderPageFor({
          namespace: toLowerMaybe(
            entity.metadata.namespace ?? 'default',
            config,
          ),
          kind: toLowerMaybe(entity.kind, config),
          name: toLowerMaybe(entity.metadata.name, config),
        });

  if (!entities) return null;
  return (
    <ItemCardGrid data-testid="info-card-container">
      {!entities?.length
        ? null
        : entities.map(entity => (
            <InfoCard
              key={entity.metadata.name}
              data-testid={entity?.metadata?.title}
              title={entity?.metadata?.title || entity?.metadata?.name}
            >
              <div>{entity?.metadata?.description}</div>
              <div className={classes.linkSpacer} />
              <Link
                to={linkDestination(entity)}
                className={classes.readMoreLink}
                data-testid="read-docs-link"
              >
                {linkContent || 'Read Docs'}
              </Link>
            </InfoCard>
          ))}
    </ItemCardGrid>
  );
};
