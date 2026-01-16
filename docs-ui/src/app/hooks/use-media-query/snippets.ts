export const useMediaQueryUsageSnippet = `import { useMediaQuery } from '@backstage/ui';

function MyComponent() {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div>
      {isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'}
    </div>
  );
}`;

export const useMediaQueryResponsiveSnippet = `import { useMediaQuery } from '@backstage/ui';

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}`;

export const useMediaQueryPreferencesSnippet = `import { useMediaQuery } from '@backstage/ui';

function AccessibleComponent() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div
      className={prefersReducedMotion ? 'no-animations' : ''}
    >
      Content
    </div>
  );
}`;

export const useMediaQueryOrientationSnippet = `import { useMediaQuery } from '@backstage/ui';

function OrientationAware() {
  const isPortrait = useMediaQuery('(orientation: portrait)');

  return (
    <div>
      {isPortrait ? 'Portrait mode' : 'Landscape mode'}
    </div>
  );
}`;
