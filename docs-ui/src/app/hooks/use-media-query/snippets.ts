export const useMediaQueryUsageSnippet = `import { useMediaQuery } from '@backstage/ui';

function MyComponent() {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <p>
      {isDarkMode
        ? 'User prefers Dark mode'
        : 'User prefers Light mode'
      }
    </p>
  );
}`;

export const useMediaQueryResponsiveSnippet = `import { useMediaQuery } from '@backstage/ui';

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <p>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </p>
  );
}`;

export const useMediaQueryPreferencesSnippet = `import { useMediaQuery } from '@backstage/ui';

function AccessibleComponent() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <p className={prefersReducedMotion ? 'no-animations' : 'animated-border'}>
      Content
    </p>
  );
}`;

export const useMediaQueryOrientationSnippet = `import { useMediaQuery } from '@backstage/ui';

function OrientationAware() {
  const isPortrait = useMediaQuery('(orientation: portrait)');

  return (
    <p>
      {isPortrait ? 'Portrait mode' : 'Landscape mode'}
    </p>
  );
}`;
