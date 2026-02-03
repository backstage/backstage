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
import preview from '../../../../../.storybook/preview';
import { ToastContainer, toastQueue } from './index';
import { Flex } from '../Flex';
import { Button } from '../Button';

const meta = preview.meta({
  title: 'Backstage UI/Toast',
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
  // Title only - medium
  { title: 'Changes saved successfully', status: 'success' as const },
  { title: 'Connection restored', status: 'info' as const },
  { title: 'Action could not be completed', status: 'danger' as const },
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

export const WithoutIcons = meta.story({
  render: () => (
    <>
      <ToastContainer queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Toast without icon',
              description: 'This toast has no icon displayed.',
              icon: false,
            })
          }
        >
          No Icon
        </Button>
        <Button
          onPress={() =>
            toastQueue.add({
              title: 'Success without icon',
              status: 'success',
              icon: false,
            })
          }
        >
          Success No Icon
        </Button>
      </Flex>
    </>
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

export const ProgrammaticDismiss = meta.story({
  render: () => {
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
  },
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
                  status: ['info', 'success', 'warning', 'danger'][
                    (i - 1) % 4
                  ] as 'info' | 'success' | 'warning' | 'danger',
                });
              }, i * 200);
            }
          }}
        >
          Show 5 Toasts
        </Button>
        <Button onPress={() => toastQueue.clear()}>Clear All Toasts</Button>
      </Flex>
    </>
  ),
});

export default meta;
