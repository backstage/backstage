export const snippet = `import { Flex, Button, Text } from '@backstage/ui';

<Flex>
  <Text>Hello World</Text>
  <Button>Click me</Button>
</Flex>;`;

export const analyticsSetupSnippet = `import { BUIProvider } from '@backstage/ui';
import { useAnalytics } from '@backstage/core-plugin-api';

// Wrap your app content with the provider
<BUIProvider useAnalytics={useAnalytics}>
  <AppContent />
</BUIProvider>`;

export const analyticsNoTrackSnippet = `// Suppress analytics for a specific link
<Link href="/internal" noTrack>
  Skip tracking
</Link>`;
