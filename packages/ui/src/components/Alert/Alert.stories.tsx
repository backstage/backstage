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
import preview from '../../../../../.storybook/preview';
import { Alert } from './Alert';
import { Flex } from '../Flex';
import { Box } from '../Box';
import { Text } from '../Text';
import { Button } from '../Button';
import { RiCloudLine } from '@remixicon/react';

const meta = preview.meta({
  title: 'Backstage UI/Alert',
  component: Alert,
  argTypes: {
    status: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    icon: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
});

export const Default = meta.story({
  args: {
    title: 'This is an alert message',
    icon: true,
  },
});

export const StatusVariants = meta.story({
  args: {
    title: 'This is an alert message',
  },
  parameters: {
    argTypes: {
      status: {
        control: false,
      },
    },
  },
  render: () => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={true}
        title="This is an informational alert with helpful information."
      />
      <Alert
        status="success"
        icon={true}
        title="Your changes have been saved successfully."
      />
      <Alert
        status="warning"
        icon={true}
        title="This action may have unintended consequences."
      />
      <Alert
        status="danger"
        icon={true}
        title="An error occurred while processing your request."
      />
    </Flex>
  ),
});

export const WithDescription = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={true}
        title="New Feature Available"
        description="We've added support for custom table columns. Check the documentation to learn more."
      />
      <Alert
        status="success"
        icon={true}
        title="Deployment Successful"
        description="Your application has been deployed to production. All health checks passed."
      />
      <Alert
        status="warning"
        icon={true}
        title="Pending Review"
        description="Please review the following items before proceeding with the deployment."
      />
      <Alert
        status="danger"
        icon={true}
        title="Authentication Failed"
        description="Unable to verify your credentials. Please check your username and password and try again."
      />
    </Flex>
  ),
});

export const WithoutIcons = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={false}
        title="This is an informational alert without an icon."
      />
      <Alert
        status="success"
        icon={false}
        title="Your changes have been saved successfully."
      />
      <Alert
        status="warning"
        icon={false}
        title="This action may have unintended consequences."
      />
      <Alert
        status="danger"
        icon={false}
        title="An error occurred while processing your request."
      />
    </Flex>
  ),
});

export const CustomIcon = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={<RiCloudLine />}
        title="This alert uses a custom cloud icon instead of the default info icon."
      />
      <Alert
        status="success"
        icon={<RiCloudLine />}
        title="Custom icons work with any status variant."
      />
    </Flex>
  ),
});

export const WithActions = meta.story({
  render: args => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={true}
        title="This alert has a dismiss action on the right."
        customActions={
          <Button size="small" variant="tertiary">
            Dismiss
          </Button>
        }
        {...args}
      />
      <Alert
        status="success"
        icon={true}
        title="Your changes have been saved. Would you like to continue?"
        customActions={
          <>
            <Button size="small" variant="tertiary">
              Cancel
            </Button>
            <Button size="small" variant="primary">
              Continue
            </Button>
          </>
        }
        {...args}
      />
      <Alert
        status="danger"
        icon={true}
        title="An error occurred while processing your request. Please try again."
        customActions={
          <Button size="small" variant="primary">
            Retry
          </Button>
        }
        {...args}
      />
    </Flex>
  ),
});

export const WithActionsAndDescriptions = WithActions.extend({
  args: {
    description: 'This is a description of the alert.',
  },
});

export const LoadingVariants = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Text>Info</Text>
      <Alert
        status="info"
        icon={true}
        loading
        title="Processing your request..."
      />

      <Text>Success</Text>
      <Alert status="success" icon={true} loading title="Saving changes..." />

      <Text>Warning</Text>
      <Alert
        status="warning"
        icon={true}
        loading
        title="Checking for issues..."
      />

      <Text>Danger</Text>
      <Alert
        status="danger"
        icon={true}
        loading
        title="Attempting recovery..."
      />
    </Flex>
  ),
});

export const LoadingWithDescription = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={true}
        loading
        title="Processing your request"
        description="This may take a few moments. Please do not close this window."
      />
      <Alert
        status="success"
        icon={true}
        loading
        title="Deployment in Progress"
        description="Your application is being deployed to production. You'll receive a notification when complete."
      />
    </Flex>
  ),
});

export const LongContent = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={true}
        title="This is a longer alert message that demonstrates how the component handles multiple lines of text. The content will wrap naturally and maintain proper spacing with the icon and any actions. This is useful for providing detailed information to users when necessary."
      />
      <Alert
        status="warning"
        icon={true}
        title="This alert combines long content with actions. The actions remain aligned to the right even when the content wraps to multiple lines. This ensures a consistent and predictable layout regardless of content length."
        customActions={
          <Button size="small" variant="tertiary">
            Dismiss
          </Button>
        }
      />
    </Flex>
  ),
});

export const OnDifferentSurfaces = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default Surface</Text>
        <Flex direction="column" gap="2" p="4">
          <Alert status="info" icon={true} title="Alert on default surface" />
          <Alert
            status="success"
            icon={true}
            title="Alert on default surface"
          />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 0</Text>
        <Flex direction="column" gap="2" surface="0" p="4">
          <Alert status="info" icon={true} title="Alert on surface 0" />
          <Alert status="success" icon={true} title="Alert on surface 0" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex direction="column" gap="2" surface="1" p="4">
          <Alert status="info" icon={true} title="Alert on surface 1" />
          <Alert status="success" icon={true} title="Alert on surface 1" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex direction="column" gap="2" surface="2" p="4">
          <Alert status="info" icon={true} title="Alert on surface 2" />
          <Alert status="success" icon={true} title="Alert on surface 2" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex direction="column" gap="2" surface="3" p="4">
          <Alert status="info" icon={true} title="Alert on surface 3" />
          <Alert status="success" icon={true} title="Alert on surface 3" />
        </Flex>
      </Flex>
    </Flex>
  ),
});

export const Responsive = meta.story({
  args: {
    title: 'This alert changes status responsively',
    icon: true,
    status: {
      initial: 'info',
      sm: 'success',
      md: 'warning',
      lg: 'danger',
    },
  },
});

export const WithUtilityProps = meta.story({
  render: () => (
    <Box surface="1" py="4">
      <Alert
        status="success"
        icon={true}
        title="Alert with custom margin"
        mb="4"
        mx="4"
      />
      <Alert
        status="success"
        icon={true}
        title="Alert with custom margin"
        mx="4"
      />
    </Box>
  ),
});
