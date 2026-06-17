/*
 * Copyright 2025 The Backstage Authors
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

import preview from '../../../../.storybook/preview';
import type { StoryFn } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Grid,
  Flex,
  Text,
  MenuItem,
  TagGroup,
  Tag,
  List,
  ListRow,
} from '..';
import {
  RiAccountCircleLine,
  RiCloudLine,
  RiCodeLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiGitBranchLine,
  RiJavascriptLine,
  RiReactjsLine,
  RiServerLine,
  RiShareBoxLine,
  RiShieldLine,
  RiTerminalLine,
} from '@remixicon/react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface ServiceItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactElement;
  tags: string[];
}

const frontendServices: ServiceItem[] = [
  {
    id: 'portal',
    label: 'developer-portal',
    description: 'Internal developer portal built on Backstage',
    icon: <RiAccountCircleLine />,
    tags: ['website', 'production'],
  },
  {
    id: 'design-system',
    label: 'design-system',
    description: 'Shared UI components and design tokens',
    icon: <RiReactjsLine />,
    tags: ['library', 'production'],
  },
  {
    id: 'docs-site',
    label: 'docs-site',
    description: 'Engineering documentation and runbooks',
    icon: <RiCodeLine />,
    tags: ['website', 'production'],
  },
  {
    id: 'admin-ui',
    label: 'admin-ui',
    description: 'Internal tooling for platform administrators',
    icon: <RiJavascriptLine />,
    tags: ['website', 'experimental'],
  },
  {
    id: 'onboarding-flow',
    label: 'onboarding-flow',
    description: 'New hire onboarding wizard and checklist',
    icon: <RiAccountCircleLine />,
    tags: ['website', 'experimental'],
  },
];

const backendServices: ServiceItem[] = [
  {
    id: 'auth',
    label: 'authentication-service',
    description: 'Handles user authentication, sessions and token refresh',
    icon: <RiShieldLine />,
    tags: ['service', 'production'],
  },
  {
    id: 'api-gateway',
    label: 'api-gateway',
    description: 'Routes and validates all inbound API requests',
    icon: <RiServerLine />,
    tags: ['service', 'production'],
  },
  {
    id: 'search',
    label: 'search-indexer',
    description: 'Indexes catalog entities for full-text search',
    icon: <RiTerminalLine />,
    tags: ['service', 'experimental'],
  },
  {
    id: 'ci-runner',
    label: 'ci-runner',
    description: 'Orchestrates and executes CI pipeline jobs',
    icon: <RiGitBranchLine />,
    tags: ['service', 'production'],
  },
  {
    id: 'infra-provisioner',
    label: 'infra-provisioner',
    description: 'Terraform-based cloud resource provisioner',
    icon: <RiCloudLine />,
    tags: ['service', 'experimental'],
  },
];

// ---------------------------------------------------------------------------
// Service list card
// ---------------------------------------------------------------------------

interface ServiceListCardProps {
  title: string;
  items: ServiceItem[];
  description?: boolean;
  icons?: boolean;
}

const ServiceListCard = ({
  title,
  items,
  description = false,
  icons = true,
}: ServiceListCardProps) => (
  <Card>
    <CardHeader>
      <Flex direction="row" align="center" justify="between" gap="2">
        <Flex direction="column" gap="1">
          <Text variant="body-large" weight="bold">
            {title}
          </Text>
        </Flex>
      </Flex>
    </CardHeader>
    <CardBody>
      <List aria-label={title}>
        {items.map(item => (
          <ListRow
            key={item.id}
            id={item.id}
            icon={icons ? item.icon : undefined}
            description={description ? item.description : undefined}
            menuItems={
              <>
                <MenuItem iconStart={<RiEdit2Line />}>Edit</MenuItem>
                <MenuItem iconStart={<RiShareBoxLine />}>Share</MenuItem>
                <MenuItem iconStart={<RiDeleteBinLine />} color="danger">
                  Delete
                </MenuItem>
              </>
            }
            customActions={
              <TagGroup aria-label={`Tags for ${item.label}`}>
                {item.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagGroup>
            }
          >
            {item.label}
          </ListRow>
        ))}
      </List>
    </CardBody>
  </Card>
);

const withRouter = (Story: StoryFn) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const meta = preview.meta({
  title: 'Recipes/Cards with List',
  parameters: {
    layout: 'fullscreen',
  },
});

export const Default = meta.story({
  decorators: [withRouter],
  render: () => (
    <Container pt="6">
      <Grid.Root columns="2" gap="4">
        <ServiceListCard title="Frontend services" items={frontendServices} />
        <ServiceListCard title="Backend services" items={backendServices} />
      </Grid.Root>
    </Container>
  ),
});

export const WithNoIcons = meta.story({
  decorators: [withRouter],
  args: {
    icons: false,
    description: true,
  },
  render: args => (
    <Container pt="6">
      <Grid.Root columns="2" gap="4">
        <ServiceListCard
          title="Frontend services"
          items={frontendServices}
          description={args.description}
          icons={args.icons}
        />
        <ServiceListCard
          title="Backend services"
          items={backendServices}
          description={args.description}
          icons={args.icons}
        />
      </Grid.Root>
    </Container>
  ),
});

export const WithDescription = meta.story({
  args: {
    description: true,
  },
  render: args => (
    <Container pt="4">
      <Grid.Root columns="2" gap="4">
        <ServiceListCard
          title="Frontend services"
          items={frontendServices}
          description={args.description}
        />
        <ServiceListCard
          title="Backend services"
          items={backendServices}
          description={args.description}
        />
      </Grid.Root>
    </Container>
  ),
});
