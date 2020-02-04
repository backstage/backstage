import React from 'react';
import {
  AppIcon,
  AppFeatureIcon,
  CdnIcon,
  DataEndpointsIcon,
  GcpProjectIcon,
  GroupIcon,
  LibraryIcon,
  OtherIcon,
  ServiceIcon,
  SystemIcon,
  TechDocsIcon,
  UserIcon,
  WebsiteIcon,
  WorkflowIcon,
  SdkIcon,
  MachineLearningIcon,
} from 'shared/icons';
import Link from 'shared/components/Link';
import { theme } from 'core/app/PageThemeProvider';
import FeatureFlags from '../featureFlags/featureFlags';

// The type that needs to be declared for every component type below.
// Indexable will be one of the indexable types below.
type SearchTypeDefinition<I extends ComponentResult | ResultTypes[keyof ResultTypes]> = {
  title: string;
  icon: JSX.Element;
  theme?: keyof typeof theme;
  shorthands: string[];
  buildUrl(indexable: I): string;
  buildTitle(indexable: I): string;
  buildSubtitle(indexable: I): string;
};

// This is the search result item type for generic component-like search results.
type ComponentResult = {
  id: string;
  description: string;
  componentType: string;
};

// These are custom types for other indexed resources, keyed by componentType
type ResultTypes = {
  user: {
    id: string;
    fullName: string;
    componentType: 'user';
  };
  'tech-doc': {
    title: string;
    location: string;
    componentId: string;
    componentType: 'tech-doc';
  };
  'ml-project': {
    id: string;
    name: string;
    description: string;
    componentType: 'ml-project';
  };
};

// Helps infer the type of all definitions below.
// The result is an object type where the key is a union of component type strings
// and the value is the type definition for that component type.
type Definitions<T extends string> = {
  [key in T]: SearchTypeDefinition<key extends keyof ResultTypes ? ResultTypes[key] : ComponentResult>;
};

// Typescript needs a function to be able to infer the type of each definition
const inferDefinitions = <T extends string>(definitions: Definitions<T>) => definitions;

export const componentTypes = inferDefinitions({
  // TechDocs have a custom search results page, so this is only for SearchBox
  'tech-doc': {
    title: 'Documentation',
    icon: <TechDocsIcon />,
    theme: 'documentation',
    shorthands: ['doc', 'docs'],
    buildUrl: ({ location }) => `/docs/${location}`,
    buildTitle: ({ title, componentId }) => `${componentId} - ${title}`,
    buildSubtitle: ({ location }) => `docs/${location}`,
  },
  service: {
    title: 'Services',
    icon: <ServiceIcon data-testid="service" />,
    shorthands: ['srv'],
    buildUrl: ({ id }) => `/services/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  dataset: {
    title: 'Data Endpoints',
    icon: <DataEndpointsIcon />,
    theme: 'endpoint',
    shorthands: ['data'],
    buildUrl: ({ id }) => `/data-endpoints/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  workflow: {
    title: 'Workflows',
    icon: <WorkflowIcon />,
    shorthands: ['work'],
    buildUrl: ({ id }) => `/workflows/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  app: {
    title: 'Apps',
    icon: <AppIcon />,
    theme: 'app',
    shorthands: ['app'],
    buildUrl: ({ id }) => `/apps/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  'app-feature': {
    title: 'App Features',
    icon: <AppFeatureIcon />,
    theme: 'appFeature',
    shorthands: ['feat'],
    buildUrl: ({ id }) => `/app-features/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  website: {
    title: 'Websites',
    icon: <WebsiteIcon data-testid="website" />,
    shorthands: ['web'],
    buildUrl: ({ id }) => `/websites/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  library: {
    title: 'Libraries',
    icon: <LibraryIcon data-testid="library" />,
    shorthands: ['lib'],
    buildUrl: ({ id }) => `/libraries/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  'client-sdk': {
    title: 'Client SDK',
    icon: <SdkIcon data-testid="sdk" />,
    shorthands: ['sdk'],
    buildUrl: ({ id }) => `/client-sdks/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  'gcp-project': {
    title: 'GCP Projects',
    icon: <GcpProjectIcon data-testid="gcp-project" />,
    theme: 'project',
    shorthands: ['proj'],
    buildUrl: ({ id }) => `/projects/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  system: {
    title: 'Systems',
    icon: <SystemIcon data-testid="system" />,
    shorthands: ['sys'],
    buildUrl: ({ id }) => `/system/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  squad: {
    title: 'Groups & Squads',
    icon: <GroupIcon data-testid="squad" />,
    theme: 'org',
    shorthands: ['group', 'squad'],
    buildUrl: ({ id }) => `/org/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  user: {
    title: 'Users',
    icon: <UserIcon data-testid="user" />,
    theme: 'tool',
    shorthands: ['user'],
    buildUrl: ({ id }) => `/groups/users/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ fullName }) => fullName,
  },
  other: {
    title: 'Other',
    icon: <OtherIcon data-testid="other" />,
    shorthands: ['other'],
    buildUrl: ({ id }) => `/components/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  cdn: {
    title: 'CDN',
    icon: <CdnIcon />,
    shorthands: ['cdn'],
    buildUrl: ({ id }) => `/components/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id,
    buildSubtitle: ({ description }) => description,
  },
  'ml-project': {
    title: 'ML Projects',
    icon: <MachineLearningIcon data-testid="ml-project" />,
    shorthands: ['ml'],
    buildUrl: ({ id }) => `/machine-learning/projects/${encodeURIComponent(id)}`,
    buildTitle: ({ name }) => name,
    buildSubtitle: ({ description }) => description,
  },
  'sciencebox-project': {
    title: 'ScienceBox Projects',
    icon: <OtherIcon />, // We don't have a ScienceBox icon yet.
    shorthands: ['sb'],
    buildUrl: ({ id }) => `/sciencebox-projects/${encodeURIComponent(id)}`,
    buildTitle: ({ id }) => id, // ScienceBox ids are human-readable.
    buildSubtitle: ({ description }) => description,
  },
});

if (!FeatureFlags.getItem('machine-learning')) {
  delete componentTypes['ml-project'];
}

export function ComponentTypeLink({
  componentType,
  id,
}: {
  componentType: Exclude<keyof typeof componentTypes, keyof ResultTypes>;
  id: string;
}) {
  const comp = componentTypes[componentType] !== null ? componentTypes[componentType] : componentTypes['other'];
  return <Link to={comp.buildUrl({ id } as ComponentResult)}>{id}</Link>;
}
