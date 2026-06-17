export const snippet = `import { Flex, Button, Text } from '@backstage/ui';

<Flex>
  <Text>Hello World</Text>
  <Button>Click me</Button>
</Flex>;`;

export const analyticsSetupSnippet = `import { BUIProvider } from '@backstage/ui';
import { useAnalytics } from '@backstage/core-plugin-api';
import { BrowserRouter } from 'react-router-dom';

// BUIProvider must be inside a Router for client-side navigation
<BrowserRouter>
  <BUIProvider useAnalytics={useAnalytics}>
    <AppContent />
  </BUIProvider>
</BrowserRouter>`;

export const analyticsNoTrackSnippet = `// Suppress analytics for a specific link
<Link href="/internal" noTrack>
  Skip tracking
</Link>`;
