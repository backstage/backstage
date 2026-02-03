'use client';

import { useState } from 'react';
import { ToastContainer, toastQueue, Button, Flex } from '@backstage/ui';
import type { ToastContent } from '@backstage/ui';
import { MemoryRouter } from 'react-router-dom';

/**
 * Single shared ToastContainer for all examples on this page.
 * This prevents duplicate toasts when multiple examples share the same queue.
 * Wrapped in MemoryRouter to support Link components inside toasts.
 */
export function SharedToastContainer() {
  return (
    <MemoryRouter>
      <ToastContainer queue={toastQueue} />
    </MemoryRouter>
  );
}

const randomToasts: ToastContent[] = [
  // Info toasts
  { title: 'New notification', status: 'info' },
  {
    title: 'Update available',
    description: 'A new version is ready to install.',
    status: 'info',
  },
  {
    title: 'Tip',
    description: 'You can use keyboard shortcuts to navigate faster.',
    status: 'info',
    links: [{ label: 'View shortcuts', href: '/shortcuts' }],
  },
  // Success toasts
  { title: 'Saved', status: 'success' },
  {
    title: 'Files uploaded',
    description: '3 files uploaded successfully.',
    status: 'success',
  },
  {
    title: 'Deployment complete',
    description: 'Your application has been deployed to production.',
    status: 'success',
    links: [
      { label: 'View logs', href: '/logs' },
      { label: 'Open app', href: '/app' },
    ],
  },
  // Warning toasts
  { title: 'Storage almost full', status: 'warning' },
  {
    title: 'Session expiring',
    description: 'Your session will expire in 5 minutes.',
    status: 'warning',
  },
  {
    title: 'Rate limit warning',
    description: 'You are approaching your API rate limit.',
    status: 'warning',
    links: [{ label: 'Upgrade plan', href: '/billing' }],
  },
  // Danger toasts
  { title: 'Connection lost', status: 'danger' },
  {
    title: 'Error',
    description: 'Something went wrong. Please try again.',
    status: 'danger',
  },
  {
    title: 'Build failed',
    description: 'The build process encountered an error.',
    status: 'danger',
    links: [{ label: 'View error details', href: '/errors' }],
  },
];

export function Default() {
  return (
    <Flex gap="3">
      <Button
        onPress={() => {
          const toast =
            randomToasts[Math.floor(Math.random() * randomToasts.length)];
          toastQueue.add(toast);
        }}
      >
        Show Random Toast
      </Button>
      <Button onPress={() => toastQueue.clear()}>Clear</Button>
    </Flex>
  );
}

export function StatusVariants() {
  return (
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
  );
}

export function WithoutDescription() {
  return (
    <Flex gap="3">
      <Button
        onPress={() =>
          toastQueue.add({
            title: 'File saved',
            description: 'Your changes have been saved successfully.',
            status: 'success',
          })
        }
      >
        Success
      </Button>
      <Button
        onPress={() =>
          toastQueue.add({
            title: 'Check for updates',
            description: 'A new version is available.',
            status: 'info',
          })
        }
      >
        Info
      </Button>
    </Flex>
  );
}

export function WithLinks() {
  return (
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
        Multiple Links
      </Button>
      <Button
        onPress={() =>
          toastQueue.add({
            title: 'New update available',
            status: 'info',
            links: [{ label: 'View release notes', href: '/releases' }],
          })
        }
      >
        Single Link
      </Button>
    </Flex>
  );
}

export function AutoDismiss() {
  return (
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
    </Flex>
  );
}

export function ProgrammaticControl() {
  const [toastKey, setToastKey] = useState<string | null>(null);

  return (
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
  );
}

export function QueueManagement() {
  return (
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
                ] as unknown as ToastContent['status'],
              });
            }, i * 200);
          }
        }}
      >
        Show 5 Toasts
      </Button>
      <Button onPress={() => toastQueue.clear()}>Clear All Toasts</Button>
    </Flex>
  );
}
