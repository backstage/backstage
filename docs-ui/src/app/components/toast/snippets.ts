export const toastUsageSnippet = `import { ToastRegion, toastQueue } from '@backstage/ui';

// Place ToastRegion once in your app root
function App() {
  return (
    <>
      <ToastRegion queue={toastQueue} />
      <YourAppContent />
    </>
  );
}

// Trigger toasts from anywhere
toastQueue.add({ title: 'Success!', status: 'success' });`;

export const defaultSnippet = `import { ToastRegion, toastQueue, Button } from '@backstage/ui';

export function Example() {
  return (
    <>
      <ToastRegion queue={toastQueue} />
      <Button
        onPress={() =>
          toastQueue.add({
            title: 'Files uploaded',
            description: '3 files uploaded successfully.',
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}`;

export const statusVariantsSnippet = `import { ToastRegion, toastQueue, Button, Flex } from '@backstage/ui';

export function Example() {
  return (
    <>
      <ToastRegion queue={toastQueue} />
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
  );
}`;

export const withDescriptionSnippet = `import { ToastRegion, toastQueue, Button } from '@backstage/ui';

export function Example() {
  return (
    <>
      <ToastRegion queue={toastQueue} />
      <Button
        onPress={() =>
          toastQueue.add({
            title: 'Update available',
            description: 'A new version is ready to install.',
            status: 'info',
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}`;

export const withoutDescriptionSnippet = `import { ToastRegion, toastQueue, Button, Flex } from '@backstage/ui';

export function Example() {
  return (
    <>
      <ToastRegion queue={toastQueue} />
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
  );
}`;

export const autoDismissSnippet = `import { ToastRegion, toastQueue, Button, Flex } from '@backstage/ui';

export function Example() {
  return (
    <>
      <ToastRegion queue={toastQueue} />
      <Flex gap="3">
        <Button
          onPress={() =>
            toastQueue.add(
              {
                title: 'Auto dismiss in 3 seconds',
                description: 'This toast will disappear automatically.',
                status: 'info',
              },
              { timeout: 3000 }
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
              { timeout: 5000 }
            )
          }
        >
          5 Second Toast
        </Button>
      </Flex>
    </>
  );
}`;

export const programmaticControlSnippet = `import { useState } from 'react';
import { ToastRegion, toastQueue, Button } from '@backstage/ui';

export function Example() {
  const [toastKey, setToastKey] = useState<string | null>(null);

  return (
    <>
      <ToastRegion queue={toastQueue} />
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
              }
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
}`;

export const queueManagementSnippet = `import { ToastRegion, toastQueue, Button, Flex } from '@backstage/ui';

export function Example() {
  return (
    <>
      <ToastRegion queue={toastQueue} />
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
                  title: \`Toast #\${i}\`,
                  description: \`This is toast number \${i}.\`,
                  status: ['info', 'success', 'warning', 'danger'][(i - 1) % 4],
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
  );
}`;
