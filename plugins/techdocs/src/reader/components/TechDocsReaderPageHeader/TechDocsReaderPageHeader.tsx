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

import { PropsWithChildren } from 'react';
import Helmet from 'react-helmet';

import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import CodeIcon from '@material-ui/icons/Code';

import {
  TechDocsAddonLocations as locations,
  TechDocsEntityMetadata,
  TechDocsMetadata,
} from '@backstage/plugin-techdocs-react';
import {
  EntityRefLink,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY, CompoundEntityRef } from '@backstage/catalog-model';
import { Header, HeaderLabel } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';

import capitalize from 'lodash/capitalize';

import { rootRouteRef } from '../../../routes';
import { useTechDocsReaderHeaderData } from '../../../hooks/useTechDocsReaderHeaderData';

const skeleton = <Skeleton animation="wave" variant="text" height={40} />;

/**
 * Props for {@link TechDocsReaderPageHeader}
 *
 * @public
 * @deprecated No need to pass down properties anymore. The component consumes data from `TechDocsReaderPageContext` instead. Use the {@link @backstage/plugin-techdocs-react#useTechDocsReaderPage} hook for custom header.
 */
export type TechDocsReaderPageHeaderProps = PropsWithChildren<{
  entityRef?: CompoundEntityRef;
  entityMetadata?: TechDocsEntityMetadata;
  techDocsMetadata?: TechDocsMetadata;
}>;

/**
 * Renders the reader page header.
 * This component does not accept props, please use
 * the Tech Docs add-ons to customize it
 * @public
 */
export const TechDocsReaderPageHeader = (
  props: TechDocsReaderPageHeaderProps,
) => {
  const { children } = props;
  const {
    title,
    subtitle,
    entityRef,
    entityMetadata,
    tabTitle,
    hidden,
    showSourceLink,
    sourceLink,
    addons,
  } = useTechDocsReaderHeaderData();

  const docsRootLink = useRouteRef(rootRouteRef)();

  if (hidden) return null;

  const { spec } = entityMetadata || {};
  const lifecycle = spec?.lifecycle;

  const ownedByRelations = entityMetadata
    ? getEntityRelations(entityMetadata, RELATION_OWNED_BY)
    : [];

  const labels = (
    <>
      <HeaderLabel
        label={capitalize(entityMetadata?.kind || 'entity')}
        value={
          <EntityRefLink
            color="inherit"
            entityRef={entityRef}
            title={entityMetadata?.metadata.title}
            defaultKind="Component"
          />
        }
      />
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label="Owner"
          value={
            <EntityRefLinks
              color="inherit"
              entityRefs={ownedByRelations}
              defaultKind="group"
            />
          }
        />
      )}
      {lifecycle ? (
        <HeaderLabel label="Lifecycle" value={String(lifecycle)} />
      ) : null}
      {showSourceLink ? (
        <HeaderLabel
          label=""
          value={
            <Grid container direction="column" alignItems="center">
              <Grid style={{ padding: 0 }} item>
                <CodeIcon style={{ marginTop: '-25px' }} />
              </Grid>
              <Grid style={{ padding: 0 }} item>
                Source
              </Grid>
            </Grid>
          }
          url={sourceLink}
        />
      ) : null}
    </>
  );

  return (
    <Header
      type="Documentation"
      typeLink={docsRootLink}
      title={title || skeleton}
      subtitle={subtitle === '' ? undefined : subtitle || skeleton}
    >
      <Helmet titleTemplate="%s">
        <title>{tabTitle}</title>
      </Helmet>
      {labels}
      {children}
      {addons.renderComponentsByLocation(locations.Header)}
    </Header>
  );
};
