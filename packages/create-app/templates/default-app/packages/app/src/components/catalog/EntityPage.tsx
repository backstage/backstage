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
import { Grid } from '@material-ui/core';
import {
  ApiEntity,
  DomainEntity,
  Entity,
  GroupEntity,
  SystemEntity,
  UserEntity,
} from '@backstage/catalog-model';
import {
  ApiDefinitionCard,
  ConsumedApisCard,
  ConsumingComponentsCard,
  EntityHasApisCard,
  ProvidedApisCard,
  ProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import {
  AboutCard,
  EntityHasComponentsCard,
  EntityHasSystemsCard,
  EntityPageLayout,
} from '@backstage/plugin-catalog';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  isPluginApplicableToEntity as isGitHubActionsAvailable,
  Router as GitHubActionsRouter,
} from '@backstage/plugin-github-actions';
import {
  GroupProfileCard,
  MembersListCard,
  OwnershipCard,
  UserProfileCard,
} from '@backstage/plugin-org';
import { EmbeddedDocsRouter as DocsRouter } from '@backstage/plugin-techdocs';

interface ComponentType {
  path: string;
  title: string;
  isApplicable(entity: Entity): boolean;
  content(entity: Entity): JSX.Element;
}

const Overview: ComponentType = {
  path: '/',
  title: 'Overview',
  isApplicable: (_entity: Entity) => true,
  content: (entity: Entity): JSX.Element => (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={12}>
        <AboutCard entity={entity} variant="gridItem" />
      </Grid>
    </Grid>
  ),
};

const Docs: ComponentType = {
  path: '/docs/*',
  title: 'Docs',
  isApplicable: entity =>
    Boolean(entity?.metadata.annotations?.['backstage.io/techdocs-ref']),
  content: entity => <DocsRouter entity={entity} />,
};

const ComponentApis: ComponentType = {
  path: '/api/*',
  title: 'API',
  isApplicable: entity =>
  Boolean(entity?.spec?.providesApis || entity?.spec?.consumesApis),
  content: entity => (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={6}>
        <ProvidedApisCard entity={entity} />
      </Grid>
      <Grid item md={6}>
        <ConsumedApisCard entity={entity} />
      </Grid>
    </Grid>
  ),
};

const CICD: ComponentType = {
  // This component is just an example of how you can implement your company's logic in entity page.
  // You can for example enforce that all components of type 'service' should use GitHubActions
  path: '/ci-cd/*',
  title: 'CI/CD',
  isApplicable: entity =>
  isGitHubActionsAvailable(entity),
  content: entity => {
    switch (true) {
      case isGitHubActionsAvailable(entity):
        return <GitHubActionsRouter entity={entity} />;
      default:
        return <></>;
    }
  },
};
  
const ApiOverview: ComponentType = {
  path: '/*',
  title: 'Overview',
  isApplicable: (entity: ApiEntity) => entity?.kind === 'API',
  content: (entity: ApiEntity) => (
    <Grid container spacing={3}>
      <Grid item md={6}>
        <AboutCard entity={entity} />
      </Grid>
      <Grid container item md={12}>
        <Grid item md={6}>
          <ProvidingComponentsCard entity={entity} />
        </Grid>
        <Grid item md={6}>
          <ConsumingComponentsCard entity={entity} />
        </Grid>
      </Grid>
    </Grid>
  ),
};
  
const ApiDefinition: ComponentType = {
  path: '/definition/*',
  title: 'Definition',
  isApplicable: (entity: ApiEntity) => entity?.kind === 'API',
  content: (entity: ApiEntity) => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ApiDefinitionCard apiEntity={entity} />
      </Grid>
    </Grid>
  ),
};
  
const UserOverview: ComponentType = {
  path: '/*',
  title: 'Overview',
  isApplicable: (entity: UserEntity) => entity?.kind === 'User',
  content: (entity: UserEntity) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <UserProfileCard entity={entity} variant="gridItem" />
      </Grid>
      <Grid item xs={12} md={6}>
        <OwnershipCard entity={entity} variant="gridItem" />
      </Grid>
    </Grid>
  ),
};

const GroupOverview: ComponentType = {
  path: '/*',
  title: 'Overview',
  isApplicable: (entity: GroupEntity) => entity?.kind === 'Group',
  content: (entity: GroupEntity) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <GroupProfileCard entity={entity} variant="gridItem" />
      </Grid>
      <Grid item xs={12} md={6}>
        <OwnershipCard entity={entity} variant="gridItem" />
      </Grid>
      <Grid item xs={12}>
        <MembersListCard entity={entity} />
      </Grid>
    </Grid>
  ),
};


const SystemOverview: ComponentType = {
  path: '/*',
  title: 'Overview',
  isApplicable: (entity: SystemEntity) => entity?.kind === 'System',
  content: (entity: SystemEntity) => (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={6}>
        <AboutCard entity={entity} variant="gridItem" />
      </Grid>
      <Grid item md={6}>
        <EntityHasComponentsCard variant="gridItem" />
      </Grid>
      <Grid item md={6}>
        <EntityHasApisCard variant="gridItem" />
      </Grid>
    </Grid>
  ),
};


const DomainOverview: ComponentType = {
  path: '/*',
  title: 'Overview',
  isApplicable: (entity: DomainEntity) => entity?.kind === 'Domain',
  content: (entity: DomainEntity) => (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={6}>
        <AboutCard entity={entity} variant="gridItem" />
      </Grid>
      <Grid item md={6}>
        <EntityHasSystemsCard variant="gridItem" />
      </Grid>
    </Grid>
  ),
};

interface ComponentMap {
  [key: string]: ComponentType[];
}

const COMPONENT_MAP: ComponentMap = {
  default: [Overview, Docs],
  service: [Overview, CICD, ComponentApis, Docs],
  website: [Overview, CICD, Docs],
  api: [ApiOverview, ApiDefinition],
  user: [UserOverview],
  group: [GroupOverview],
  system: [SystemOverview],
  domain: [DomainOverview],
  docs: [
    Object.assign({}, Docs, { path: '/*' }),
    Object.assign({}, Overview, { path: '/about' }),
  ],
};

const Page = ({
  entity,
  components,
}: {
  entity: Entity;
  components: ComponentType[];
}) => (
  <EntityPageLayout>
    {components
      .map(c =>
        entity && c.isApplicable(entity) ? (
          <EntityPageLayout.Content
            path={c.path}
            title={c.title}
            element={c.content(entity)}
          />
        ) : (
          void 1
        ),
      )
      .filter(c => c)}
      </EntityPageLayout>
);

export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  switch (entity?.spec?.type) {
    case 'service':
      return <Page entity={entity} components={COMPONENT_MAP.service} />;
    case 'website':
      return <Page entity={entity} components={COMPONENT_MAP.website} />;
    default:
      return <Page entity={entity} components={COMPONENT_MAP.default} />;
  }
};

export const EntityPage = () => {
  const { entity } = useEntity();

  switch (entity?.kind?.toLocaleLowerCase('en-US')) {
    case 'component':
      return <ComponentEntityPage entity={entity} />;
    case 'api':
      return <Page entity={entity} components={COMPONENT_MAP.api} />;
    case 'group':
      return <Page entity={entity} components={COMPONENT_MAP.group} />;
    case 'user':
      return <Page entity={entity} components={COMPONENT_MAP.user} />;
    case 'system':
      return <Page entity={entity} components={COMPONENT_MAP.system} />;
    case 'domain':
      return <Page entity={entity} components={COMPONENT_MAP.domain} />;
    case 'location':
    case 'resource':
    case 'template':
    default:
      return <Page entity={entity} components={COMPONENT_MAP.default} />;
  }
};
