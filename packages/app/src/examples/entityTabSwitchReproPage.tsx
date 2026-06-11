/*
 * Copyright 2026 The Backstage Authors
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

/**
 * Minimal catalog entity page used to reproduce TechDocs regressions when
 * switching entity tabs (RoutedTabs unmounts tab content — same pattern as
 * production apps using legacy EntityLayout, e.g. Beacon).
 *
 * Enabled in example-app when `BACKSTAGE_TECHDOCS_TAB_REPRO=true` (see
 * `yarn start:techdocs-repro:example-app`).
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import Grid from '@material-ui/core/Grid';
import {
  errorApiRef,
  useApi,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import {
  EntityAboutCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasSubcomponentsCard,
  EntityLayout,
  EntityLinksCard,
  EntitySwitch,
  isKind,
} from '@backstage/plugin-catalog';
import {
  AsyncEntityProvider,
  catalogApiRef,
  entityRouteRef,
  type EntityLoadingStatus,
} from '@backstage/plugin-catalog-react';
import { EntityCatalogGraphCard } from '@backstage/plugin-catalog-graph';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import {
  LightBox,
  ReportIssue,
} from '@backstage/plugin-techdocs-module-addons-contrib';

const useEntityFromUrl = (): EntityLoadingStatus => {
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const {
    value: entity,
    error,
    loading,
    retry: refresh,
  } = useAsyncRetry(
    () => catalogApi.getEntityByRef({ kind, namespace, name }),
    [catalogApi, kind, namespace, name],
  );

  useEffect(() => {
    if (!name) {
      errorApi.post(new Error('No name provided!'));
      navigate('/');
    }
  }, [errorApi, navigate, name]);

  return { entity, loading, error, refresh };
};

const techdocsContent = (
  <EntityTechdocsContent>
    <TechDocsAddons>
      <ReportIssue />
      <LightBox />
    </TechDocsAddons>
  </EntityTechdocsContent>
);

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <EntityAboutCard />
    </Grid>
    <Grid item md={6} xs={12}>
      <EntityCatalogGraphCard height={400} />
    </Grid>
    <Grid item md={4} xs={12}>
      <EntityLinksCard />
    </Grid>
    <Grid item md={8} xs={12}>
      <EntityHasSubcomponentsCard />
    </Grid>
  </Grid>
);

const componentEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/dependencies" title="Dependencies">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityDependsOnComponentsCard />
        </Grid>
        <Grid item md={6}>
          <EntityDependsOnResourcesCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

const defaultEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case
      if={isKind('component')}
      children={componentEntityPage}
    />
    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);

export const EntityTabSwitchReproPage = () => {
  const entityFromUrl = useEntityFromUrl();

  return (
    <AsyncEntityProvider {...entityFromUrl}>{entityPage}</AsyncEntityProvider>
  );
};
