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
import { useState } from 'react';
/* eslint-disable @backstage/no-relative-monorepo-imports */
import preview from '../../../../../.storybook/preview';
import { Button, Flex, Text } from '../../../../../packages/ui/src';
/* eslint-enable @backstage/no-relative-monorepo-imports */
import { ToastContainer, toastQueue } from './index';
import { MemoryRouter } from 'react-router-dom';

const meta = preview.meta({
  title: 'Plugins/App/Toast',
  component: ToastContainer,
  parameters: {
    layout: 'centered',
  },
});

const randomToasts = [
  // Title only - short
  { title: 'Saved', status: 'success' as const },
  { title: 'Error', status: 'danger' as const },
  { title: 'New notification', status: 'info' as const },
  { title: 'Warning', status: 'warning' as const },
  { title: 'Task completed', status: 'neutral' as const },
  // Title only - medium
  { title: 'Changes saved successfully', status: 'success' as const },
  { title: 'Connection restored', status: 'info' as const },
  { title: 'Action could not be completed', status: 'danger' as const },
  { title: 'Background sync in progress', status: 'neutral' as const },
  // Title + short description
  {
    title: 'Files uploaded',
    description: '3 files uploaded.',
    status: 'success' as const,
  },
  {
    title: 'Update available',
    description: 'Version 2.0 is ready.',
    status: 'info' as const,
  },
  {
    title: 'Request failed',
    description: 'Please try again.',
    status: 'danger' as const,
  },
  {
    title: 'Storage warning',
    description: '90% used.',
    status: 'warning' as const,
  },
  {
    title: 'Clipboard updated',
    description: 'Text copied.',
    status: 'neutral' as const,
  },
  // Title + medium description
  {
    title: 'Deployment complete',
    description:
      'Your application has been deployed to production successfully.',
    status: 'success' as const,
  },
  {
    title: 'Session expiring',
    description:
      'Your session will expire in 5 minutes. Please save your work.',
    status: 'warning' as const,
  },
  {
    title: 'Permission denied',
    description: 'You do not have access to perform this action.',
    status: 'danger' as const,
  },
  {
    title: 'Preferences updated',
    description: 'Your display settings have been saved to your profile.',
    status: 'neutral' as const,
  },
  // Title + long description
  {
    title: 'Sync completed',
    description:
      'All your files have been synchronized across devices. This includes 47 documents, 23 images, and 12 configuration files that were updated in the last hour.',
    status: 'success' as const,
  },
  {
    title: 'Rate limit exceeded',
    description:
      'You have exceeded the maximum number of API requests allowed. Please wait a few minutes before trying again or upgrade your plan for higher limits.',
    status: 'warning' as const,
  },
  {
    title: 'Critical error',
    description:
      'The server encountered an unexpected error while processing your request. Our team has been notified and is investigating the issue. Please try again later.',
    status: 'danger' as const,
  },
  // Long title only
  {
    title: 'Your subscription has been renewed successfully for another year',
    status: 'success' as const,
  },
  {
    title: 'Multiple users are currently editing this document',
    status: 'info' as const,
  },
  {
    title: 'Your workspace has been switched to the new project',
    status: 'neutral' as const,
  },
];

export const Default = meta.story({
  render: () => (
    <>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() => {
            const toast =
              randomToasts[Math.floor(Math.random() * randomToasts.length)];
            toastQueue.add(toast);
          }}
        >
          Add Random Toast
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            toastQueue.clear();
          }}
        >
          Clear All Toasts
        </Button>
      </Flex>
    </>
  ),
});

export const StatusVariants = meta.story({
  render: () => (
    <>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Neutral message',
              description: 'A simple notification without emphasis.',
              status: 'neutral',
            })
          }
        >
          Neutral Toast
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Informational message',
              description: 'Here is some helpful information.',
              status: 'info',
            })
          }
        >
          Info Toast
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Success!',
              description: 'Your changes have been saved.',
              status: 'success',
            })
          }
        >
          Success Toast
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Warning',
              description: 'This action may have consequences.',
              status: 'warning',
            })
          }
        >
          Warning Toast
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Error',
              description: 'Something went wrong.',
              status: 'danger',
            })
          }
        >
          Danger Toast
        </Button>
      </Flex>
    </>
  ),
});

export const WithoutDescription = meta.story({
  render: () => (
    <>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'File saved',
              status: 'success',
            })
          }
        >
          Simple Success
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Check for updates',
              status: 'info',
            })
          }
        >
          Simple Info
        </Button>
      </Flex>
    </>
  ),
});

export const NeutralStatus = meta.story({
  render: () => (
    <>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Neutral toast',
              description: 'This toast has no icon and uses the primary color.',
              status: 'neutral',
            })
          }
        >
          Neutral
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Simple neutral message',
              status: 'neutral',
            })
          }
        >
          Neutral Simple
        </Button>
      </Flex>
    </>
  ),
});

export const WithLinks = meta.story({
  render: () => (
    <MemoryRouter>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Deployment complete',
              description: 'Your application has been deployed.',
              status: 'success',
              links: [
                { label: 'View logs', href: '/logs' },
                { label: 'Open dashboard', href: '/dashboard' },
              ],
            })
          }
        >
          Toast with Links
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Error occurred',
              description: 'Something went wrong during the build.',
              status: 'danger',
              links: [{ label: 'View error details', href: '/errors' }],
            })
          }
        >
          Single Link
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'New update available',
              status: 'info',
              links: [
                { label: 'Release notes', href: '/releases' },
                { label: 'Update now', href: '/update' },
              ],
            })
          }
        >
          Links without Description
        </Button>
      </Flex>
    </MemoryRouter>
  ),
});

export const AutoDismiss = meta.story({
  render: () => (
    <>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() =>
            toastQueue.add(
              {
                title: 'Auto dismiss in 3 seconds',
                description: 'This toast will disappear automatically.',
                status: 'info',
              },
              { timeout: 3000 },
            )
          }
        >
          3 Second Toast
        </Button>
        <Button
          onPress={() =>
            toastQueue.add(
              {
                title: 'Auto dismiss in 5 seconds',
                description: 'Recommended minimum timeout for accessibility.',
                status: 'success',
              },
              { timeout: 5000 },
            )
          }
        >
          5 Second Toast
        </Button>
        <Button
          onPress={() =>
            toastQueue.add(
              {
                title: 'Auto dismiss in 10 seconds',
                description: 'Longer timeout for more content.',
                status: 'warning',
              },
              { timeout: 10000 },
            )
          }
        >
          10 Second Toast
        </Button>
      </Flex>
    </>
  ),
});

function ProgrammaticDismissStory() {
  const [toastKey, setToastKey] = useState<string | null>(null);

  return (
    <>
      <ToastContainer queue={toastQueue} />
      <Button
        onPress={() => {
          if (!toastKey) {
            const key = toastQueue.add(
              {
                title: 'Processing...',
                description: 'Click the button again to dismiss.',
                status: 'info',
              },
              {
                onClose: () => setToastKey(null),
              },
            );
            setToastKey(key);
          } else {
            toastQueue.close(toastKey);
          }
        }}
      >
        {toastKey ? 'Dismiss Toast' : 'Show Toast'}
      </Button>
    </>
  );
}

export const ProgrammaticDismiss = meta.story({
  render: () => <ProgrammaticDismissStory />,
});

export const QueueManagement = meta.story({
  render: () => (
    <>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() => {
            toastQueue.add({
              title: 'First toast',
              description: 'This is the first toast in the queue.',
              status: 'info',
            });
            setTimeout(() => {
              toastQueue.add({
                title: 'Second toast',
                description: 'This is the second toast.',
                status: 'success',
              });
            }, 300);
            setTimeout(() => {
              toastQueue.add({
                title: 'Third toast',
                description: 'This is the third toast.',
                status: 'warning',
              });
            }, 600);
          }}
        >
          Show Multiple Toasts
        </Button>
        <Button
          onPress={() => {
            for (let i = 1; i <= 5; i++) {
              setTimeout(() => {
                toastQueue.add({
                  title: `Toast #${i}`,
                  description: `This is toast number ${i}.`,
                  status: ['neutral', 'info', 'success', 'warning', 'danger'][
                    (i - 1) % 5
                  ] as 'neutral' | 'info' | 'success' | 'warning' | 'danger',
                });
              }, i * 200);
            }
          }}
        >
          Show 5 Toasts
        </Button>
        <Button variant="secondary" onPress={() => toastQueue.clear()}>
          Clear All Toasts
        </Button>
      </Flex>
    </>
  ),
});

export const AlertApiIntegration = meta.story({
  name: 'AlertApi Integration',
  render: () => {
    // This story demonstrates how alerts posted via the AlertApi
    // would be displayed using the ToastDisplay component.
    // The ToastDisplay bridges AlertApi.post() calls to the toast queue.

    return (
      <>
        <ToastContainer queue={toastQueue} />
        <Flex direction="column" gap="4">
          <Flex direction="column" gap="2">
            <Text variant="body-medium" weight="bold">
              AlertApi Severity Mapping:
            </Text>
            <Text variant="body-small">success → success (green)</Text>
            <Text variant="body-small">info → info (blue)</Text>
            <Text variant="body-small">warning → warning (orange)</Text>
            <Text variant="body-small">error → danger (red)</Text>
            <Text variant="body-small">
              (ToastApi also supports neutral - no icon, primary color)
            </Text>
          </Flex>
          <Flex gap="3">
            <Button
              onPress={() =>
                toastQueue.add({
                  title: 'Workspace switched',
                  status: 'neutral',
                })
              }
            >
              Neutral Toast
            </Button>
            <Button
              onPress={() =>
                toastQueue.add({
                  title: 'Entity saved successfully',
                  status: 'success',
                })
              }
            >
              Success Alert
            </Button>
            <Button
              onPress={() =>
                toastQueue.add({
                  title: 'Catalog refresh in progress',
                  status: 'info',
                })
              }
            >
              Info Alert
            </Button>
            <Button
              onPress={() =>
                toastQueue.add({
                  title: 'Entity validation has warnings',
                  status: 'warning',
                })
              }
            >
              Warning Alert
            </Button>
            <Button
              onPress={() =>
                toastQueue.add({
                  title: 'Failed to fetch entity',
                  status: 'danger',
                })
              }
            >
              Error Alert
            </Button>
          </Flex>
        </Flex>
      </>
    );
  },
});

/**
 * This story tests the real AlertApi integration.
 * It uses the alertApi from the TestApiProvider (set up in storybook preview)
 * and shows how alerts posted via alertApi.post() appear.
 *
 * Note: The storybook preview.tsx renders AlertDisplay from core-components,
 * which still uses Material UI. To test the new ToastDisplay, run the actual
 * Backstage app where the app plugin's elements.tsx is used.
 */
function RealAlertApiStory() {
  // eslint-disable-next-line @backstage/no-relative-monorepo-imports
  const { useApi, alertApiRef } = require('@backstage/core-plugin-api');
  const alertApi = useApi(alertApiRef);

  return (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="2">
        <Text variant="body-medium" weight="bold">
          Real AlertApi Test
        </Text>
        <Text variant="body-small">
          These buttons call alertApi.post() directly. Alerts appear in the OLD
          AlertDisplay (top of screen) because Storybook uses core-components.
        </Text>
        <Text variant="body-small">
          To test the NEW ToastDisplay, run: yarn start
        </Text>
      </Flex>
      <Flex gap="3">
        <Button
          onPress={() =>
            alertApi.post({
              message: 'Entity saved successfully!',
              severity: 'success',
              display: 'transient',
            })
          }
        >
          Success (transient)
        </Button>
        <Button
          onPress={() =>
            alertApi.post({
              message: 'Catalog refresh in progress',
              severity: 'info',
              display: 'transient',
            })
          }
        >
          Info (transient)
        </Button>
        <Button
          onPress={() =>
            alertApi.post({
              message: 'Entity validation has warnings',
              severity: 'warning',
              display: 'transient',
            })
          }
        >
          Warning (transient)
        </Button>
        <Button
          onPress={() =>
            alertApi.post({
              message: 'Failed to fetch entity from catalog',
              severity: 'error',
              display: 'transient',
            })
          }
        >
          Error (transient)
        </Button>
      </Flex>
      <Flex gap="3">
        <Button
          variant="secondary"
          onPress={() =>
            alertApi.post({
              message: 'This alert stays until dismissed',
              severity: 'info',
              display: 'permanent',
            })
          }
        >
          Permanent Alert
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            alertApi.post({
              message: 'Critical error - requires attention!',
              severity: 'error',
              display: 'permanent',
            })
          }
        >
          Permanent Error
        </Button>
      </Flex>
    </Flex>
  );
}

export const RealAlertApi = meta.story({
  name: 'Real AlertApi Test',
  render: () => <RealAlertApiStory />,
});

export default meta;
