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
import { useState } from 'react';

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
    children: 'This is an alert message',
    icon: true,
  },
});

export const StatusVariants = meta.story({
  args: {
    children: 'This is an alert message',
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
      <Alert status="info" icon={true}>
        This is an informational alert with helpful information.
      </Alert>
      <Alert status="success" icon={true}>
        Your changes have been saved successfully.
      </Alert>
      <Alert status="warning" icon={true}>
        This action may have unintended consequences.
      </Alert>
      <Alert status="danger" icon={true}>
        An error occurred while processing your request.
      </Alert>
    </Flex>
  ),
});

export const WithoutIcons = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert status="info" icon={false}>
        This is an informational alert without an icon.
      </Alert>
      <Alert status="success" icon={false}>
        Your changes have been saved successfully.
      </Alert>
      <Alert status="warning" icon={false}>
        This action may have unintended consequences.
      </Alert>
      <Alert status="danger" icon={false}>
        An error occurred while processing your request.
      </Alert>
    </Flex>
  ),
});

export const CustomIcon = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert status="info" icon={<RiCloudLine />}>
        This alert uses a custom cloud icon instead of the default info icon.
      </Alert>
      <Alert status="success" icon={<RiCloudLine />}>
        Custom icons work with any status variant.
      </Alert>
    </Flex>
  ),
});

export const WithActions = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={true}
        customActions={
          <>
            <Button size="small" variant="tertiary">
              Dismiss
            </Button>
          </>
        }
      >
        This alert has a dismiss action on the right.
      </Alert>
      <Alert
        status="success"
        icon={true}
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
      >
        Your changes have been saved. Would you like to continue?
      </Alert>
      <Alert
        status="danger"
        icon={true}
        customActions={
          <>
            <Button size="small" variant="primary">
              Retry
            </Button>
          </>
        }
      >
        An error occurred while processing your request. Please try again.
      </Alert>
    </Flex>
  ),
});

export const Loading = meta.story({
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLoad = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    return (
      <Flex direction="column" gap="4">
        <Alert
          status="info"
          icon={true}
          loading={isLoading}
          customActions={
            <Button size="small" variant="primary" onPress={handleLoad}>
              Load
            </Button>
          }
        >
          Click the button to see the loading state
        </Alert>
      </Flex>
    );
  },
});

export const LoadingVariants = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Text>Info</Text>
      <Alert status="info" icon={true} loading>
        Processing your request...
      </Alert>

      <Text>Success</Text>
      <Alert status="success" icon={true} loading>
        Saving changes...
      </Alert>

      <Text>Warning</Text>
      <Alert status="warning" icon={true} loading>
        Checking for issues...
      </Alert>

      <Text>Danger</Text>
      <Alert status="danger" icon={true} loading>
        Attempting recovery...
      </Alert>
    </Flex>
  ),
});

export const LongContent = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Alert status="info" icon={true}>
        This is a longer alert message that demonstrates how the component
        handles multiple lines of text. The content will wrap naturally and
        maintain proper spacing with the icon and any actions. This is useful
        for providing detailed information to users when necessary.
      </Alert>
      <Alert
        status="warning"
        icon={true}
        customActions={
          <Button size="small" variant="tertiary">
            Dismiss
          </Button>
        }
      >
        This alert combines long content with actions. The actions remain
        aligned to the right even when the content wraps to multiple lines. This
        ensures a consistent and predictable layout regardless of content
        length.
      </Alert>
    </Flex>
  ),
});

export const OnDifferentSurfaces = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default Surface</Text>
        <Flex direction="column" gap="2" p="4">
          <Alert status="info" icon={true}>
            Alert on default surface
          </Alert>
          <Alert status="success" icon={true}>
            Alert on default surface
          </Alert>
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 0</Text>
        <Flex direction="column" gap="2" surface="0" p="4">
          <Alert status="info" icon={true}>
            Alert on surface 0
          </Alert>
          <Alert status="success" icon={true}>
            Alert on surface 0
          </Alert>
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex direction="column" gap="2" surface="1" p="4">
          <Alert status="info" icon={true}>
            Alert on surface 1
          </Alert>
          <Alert status="success" icon={true}>
            Alert on surface 1
          </Alert>
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex direction="column" gap="2" surface="2" p="4">
          <Alert status="info" icon={true}>
            Alert on surface 2
          </Alert>
          <Alert status="success" icon={true}>
            Alert on surface 2
          </Alert>
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex direction="column" gap="2" surface="3" p="4">
          <Alert status="info" icon={true}>
            Alert on surface 3
          </Alert>
          <Alert status="success" icon={true}>
            Alert on surface 3
          </Alert>
        </Flex>
      </Flex>
    </Flex>
  ),
});

export const Responsive = meta.story({
  args: {
    children: 'This alert changes status responsively',
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
    <Flex direction="column" gap="4">
      <Alert status="info" icon={true} mb="4" p="5">
        Alert with custom margin and padding using utility props
      </Alert>
      <Box surface="1" p="4">
        <Alert status="success" icon={true} mb="0">
          Alert with zero margin bottom
        </Alert>
      </Box>
    </Flex>
  ),
});
