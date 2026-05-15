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

import preview from '../../../../.storybook/preview';
import type { StoryFn } from '@storybook/react-vite';
import { parseDate } from '@internationalized/date';
import { Form } from 'react-aria-components';
import { MemoryRouter } from 'react-router-dom';
import { Children } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { BUIProvider } from '../provider';
import {
  Box,
  Button,
  Checkbox,
  Combobox,
  DatePicker,
  DateRangePicker,
  Flex,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  Switch,
  Text,
  TextField,
  PasswordField,
} from '..';
import {
  RiCloudLine,
  RiDeleteBinLine,
  RiRefreshLine,
  RiSaveLine,
} from '@remixicon/react';

const meta = preview.meta({
  title: 'Recipes/Controls and Forms',
  parameters: {
    layout: 'fullscreen',
  },
});

const withLayout = (Story: StoryFn) => (
  <MemoryRouter>
    <BUIProvider>
      <Story />
    </BUIProvider>
  </MemoryRouter>
);

const environments = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
];

const owners = [
  { value: 'platform', label: 'Platform Team' },
  { value: 'catalog', label: 'Catalog Team' },
  { value: 'security', label: 'Security Team' },
  { value: 'developer-experience', label: 'Developer Experience' },
];

const regions = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-west', label: 'EU West' },
  { value: 'ap-south', label: 'AP South' },
];

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};

const FieldStack = ({ children }: { children: ReactNode }) => (
  <Flex direction="column" align="start" gap="4">
    {Children.map(children, child => (
      <Box style={{ width: '100%', maxWidth: 360 }}>{child}</Box>
    ))}
  </Flex>
);

const ServiceRequestForm = () => (
  <Form onSubmit={handleSubmit}>
    <Flex direction="column" gap="4">
      <FieldStack>
        <TextField
          label="Service name"
          name="service-name"
          placeholder="checkout-api"
          icon={<RiCloudLine />}
          isRequired
        />
        <Select
          label="Environment"
          name="environment"
          options={environments}
          defaultSelectedKey="production"
        />
        <Combobox
          label="Owning team"
          name="owner"
          options={owners}
          placeholder="Search teams"
          defaultValue="platform"
        />
        <DatePicker
          label="Launch date"
          name="launch-date"
          defaultValue={parseDate('2026-06-01')}
        />
        <DateRangePicker
          label="Maintenance window"
          name="maintenance-window"
          defaultValue={{
            start: parseDate('2026-06-10'),
            end: parseDate('2026-06-12'),
          }}
        />
        <SearchField
          label="Related entity"
          name="related-entity"
          placeholder="Search catalog"
        />
        <RadioGroup
          label="Visibility"
          name="visibility"
          defaultValue="internal"
          description="Choose who can discover this service."
        >
          <Radio value="internal">Internal</Radio>
          <Radio value="restricted">Restricted</Radio>
          <Radio value="public">Public</Radio>
        </RadioGroup>
        <Checkbox name="terms" isSelected>
          Include this service in catalog search
        </Checkbox>
      </FieldStack>
      <Flex justify="start" gap="2">
        <Button variant="secondary" type="reset">
          Reset
        </Button>
        <Button variant="primary" type="submit" iconStart={<RiSaveLine />}>
          Save request
        </Button>
      </Flex>
    </Flex>
  </Form>
);

const AccessSettingsForm = () => (
  <Form onSubmit={handleSubmit}>
    <Flex direction="column" gap="4">
      <FieldStack>
        <TextField
          label="Username"
          name="username"
          defaultValue="charlie"
          description="Used for audit logs."
        />
        <PasswordField
          label="Access token"
          name="access-token"
          defaultValue="backstage-token"
          description="Rotate this token after sharing access."
        />
        <Combobox
          label="Default region"
          name="default-region"
          options={regions}
          defaultValue="eu-west"
        />
        <Select
          label="Backup owner"
          name="backup-owner"
          options={owners}
          placeholder="Select a team"
          isDisabled
        />
        <Switch label="Enable production access" defaultSelected />
        <Checkbox name="notifications" defaultSelected>
          Send access change notifications
        </Checkbox>
      </FieldStack>
      <Flex justify="start" align="center" gap="2">
        <Button variant="secondary">Preview access</Button>
        <Button variant="primary" type="submit">
          Update access
        </Button>
        <Button variant="tertiary" iconStart={<RiRefreshLine />}>
          Rotate later
        </Button>
      </Flex>
    </Flex>
  </Form>
);

const ValidationForm = () => (
  <Form
    onSubmit={handleSubmit}
    validationErrors={{
      repository: 'Repository URL is required.',
      token: 'Token must be rotated before saving.',
    }}
  >
    <Flex direction="column" gap="4">
      <FieldStack>
        <TextField
          label="Repository URL"
          name="repository"
          placeholder="https://github.com/backstage/backstage"
        />
        <PasswordField
          label="Deployment token"
          name="token"
          defaultValue="expired-token"
        />
        <DatePicker
          label="Blocked date"
          name="blocked-date"
          isInvalid
          errorMessage="This date conflicts with a freeze window."
          defaultValue={parseDate('2026-07-04')}
        />
        <DateRangePicker
          label="Unavailable range"
          name="unavailable-range"
          isInvalid
          errorMessage="The selected range includes a weekend."
          defaultValue={{
            start: parseDate('2026-07-03'),
            end: parseDate('2026-07-06'),
          }}
        />
        <RadioGroup
          label="Release approval"
          name="approval"
          isInvalid
          defaultValue="none"
        >
          <Radio value="none">No approval</Radio>
          <Radio value="team">Team approval</Radio>
          <Radio value="security">Security approval</Radio>
        </RadioGroup>
        <Checkbox name="confirm" isInvalid>
          Confirm these changes have been reviewed
        </Checkbox>
        <Switch label="Force deployment" isDisabled />
      </FieldStack>
      <Flex justify="start" gap="2">
        <Button variant="secondary" destructive iconStart={<RiDeleteBinLine />}>
          Delete draft
        </Button>
        <Button variant="primary" type="submit">
          Save anyway
        </Button>
      </Flex>
    </Flex>
  </Form>
);

const RecipePage = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <Box bg="app" p="4" style={{ minHeight: '100vh' }}>
    <Flex
      direction="column"
      gap="4"
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      <Flex direction="column" gap="2">
        <Text>{title}</Text>
        <Text>{description}</Text>
      </Flex>
      {children}
    </Flex>
  </Box>
);

export const ServiceRequest = meta.story({
  decorators: [withLayout],
  render: () => (
    <RecipePage
      title="Service request"
      description="Inspect field borders in a dense service request form."
    >
      <ServiceRequestForm />
    </RecipePage>
  ),
});

export const AccessSettings = meta.story({
  decorators: [withLayout],
  render: () => (
    <RecipePage
      title="Access settings"
      description="Inspect field borders with credentials, disabled fields, and action buttons."
    >
      <AccessSettingsForm />
    </RecipePage>
  ),
});

export const ValidationStates = meta.story({
  decorators: [withLayout],
  render: () => (
    <RecipePage
      title="Validation states"
      description="Inspect invalid field borders and destructive secondary button borders."
    >
      <ValidationForm />
    </RecipePage>
  ),
});
