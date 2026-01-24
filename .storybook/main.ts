// This file has been automatically migrated to valid ESM format by Storybook.
import { defineMain } from '@storybook/react-vite/node';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { join, dirname, posix } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const isChromatic = process.env.STORYBOOK_STORY_SET === 'chromatic';

// All stories for full development
const allStories = isChromatic
  ? ['packages/ui']
  : [
      'packages/ui',
      'packages/core-components',
      'packages/app',
      'plugins/org',
      'plugins/search',
      'plugins/search-react',
      'plugins/home',
      'plugins/catalog-react',
    ];

const rootPath = '../';
const storiesSrcMdx = 'src/**/*.mdx';
const storiesSrcGlob = 'src/**/*.stories.@(js|jsx|mjs|ts|tsx)';

const getStoriesPath = (element: string, pattern: string) =>
  posix.join(rootPath, element, pattern);

const stories = allStories.flatMap(element => [
  getStoriesPath(element, storiesSrcMdx),
  getStoriesPath(element, storiesSrcGlob),
]);

// Resolve absolute path of a package. Needed in monorepos.
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

export default defineMain({
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-mcp'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  features: {
    experimentalComponentsManifest: true,
    experimentalCodeExamples: true, // optional
  },
  viteFinal: async (config, { configType }) => {
    // Add Node.js polyfills for browser compatibility
    //
    // When upgrading from Storybook 8 to 9 with the react-vite framework,
    // Node.js polyfills are no longer automatically included by Vite.
    // This causes "ReferenceError: process is not defined" errors in the browser
    // when code tries to access Node.js globals like `process` and `util`.
    //
    // The @vitest/mocker (included with Storybook 9) expects MSW v2 APIs,
    // but we want to keep MSW v1 for the rest of the monorepo to avoid
    // breaking changes. This configuration provides the necessary polyfills
    // and handles the MSW compatibility issue specifically for Storybook.
    //
    // These polyfills provide browser-compatible versions of Node.js globals:
    // - process: Node.js process object with env
    // - global -> globalThis: Maps Node.js global to browser's globalThis
    //
    // Without these, Backstage components that rely on Node.js APIs will fail
    // to load in Storybook's browser environment.
    // Different configurations for development vs production
    if (configType === 'DEVELOPMENT') {
      // Development: Include process polyfill to prevent runtime errors
      config.define = {
        ...config.define,
        global: 'globalThis',
        'process.env': {},
        process: '({ env: {}, browser: true })',
      };
    } else if (configType === 'PRODUCTION') {
      // Production: Minimal define to avoid esbuild errors
      config.define = {
        ...config.define,
        global: 'globalThis',
        'process.env': {},
        // No process polyfill in production build
      };
    }

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // Provide Node.js polyfills for browser
        process: 'process/browser',
        util: 'util',
        buffer: 'buffer',
        stream: 'stream-browserify',
        // Fix MSW v2 imports for @vitest/mocker compatibility
        // @vitest/mocker expects MSW v2 APIs but we want to keep MSW v1 for the rest of the monorepo
        'msw/browser': join(__dirname, 'msw-browser-shim.js'),
        'msw/core/http': join(__dirname, 'msw-http-shim.js'),
      },
    };

    // Optimize dependencies for better performance
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include || []),
        'process/browser',
        'util',
        'buffer',
        'stream-browserify',
      ],
      // Exclude MSW to prevent optimization conflicts with our shims
      exclude: [
        ...(config.optimizeDeps?.exclude || []),
        'msw',
        'msw/browser',
        'msw/core/http',
      ],
    };

    return config;
  },
});
