import { type PropDef } from '@/utils/propDefs';

export const useMediaQueryParamDefs: Record<string, PropDef> = {
  query: {
    type: 'string',
    description: 'The CSS media query to evaluate',
  },
  options: {
    type: 'complex',
    complexType: {
      name: 'UseMediaQueryOptions',
      properties: {
        defaultValue: {
          type: 'boolean',
          required: false,
          description:
            'Default value to use when rendering on the server, defaults to false',
        },
        initializeWithValue: {
          type: 'boolean',
          required: false,
          description:
            'Whether to initialize with the current value of the media query, or use the default value initially',
        },
      },
    },
    default: 'defaultValue: false\ninitializeWithValue: true',
  },
};

export const useMediaQueryReturnDefs: Record<string, PropDef> = {
  matches: {
    type: 'boolean',
    description: 'True if the media query currently matches',
  },
};

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
