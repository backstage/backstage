/*
 * Copyright 2022 The Backstage Authors
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

// @ts-check

/** @type{import('prism-react-renderer').PrismTheme} **/
// @ts-ignore
import { themes } from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';
import { Config } from '@docusaurus/types';
import RedirectPlugin from '@docusaurus/plugin-client-redirects';
import { releases } from './releases';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

const backstageTheme = themes.vsDark;
backstageTheme.plain.backgroundColor = '#232323';

const useVersionedDocs = require('node:fs').existsSync('versions.json');

// This patches the redirect plugin to ignore the error when it tries to override existing fields.
// This lets us add redirects that only apply to the next docs, while the stable docs still contain the source path.
const PatchedRedirectPlugin: typeof RedirectPlugin = (ctx, opts) => {
  const plugin = RedirectPlugin(ctx, opts);

  return {
    ...plugin,
    async postBuild(...args) {
      try {
        await plugin.postBuild(...args);
      } catch (error) {
        if (
          error.message ===
          'The redirect plugin is not supposed to override existing files.'
        ) {
          // Bit of a hack to make sure all remaining redirects are written, since the write uses Promise.all
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          throw error;
        }
      }
    },
  };
};

const defaultOpenApiOptions = {
  hideSendButton: true,
  sidebarOptions: {
    groupPathsBy: 'tag',
    categoryLinkSource: 'tag',
  },
} satisfies OpenApiPlugin.Options;

const config: Config = {
  title: 'Backstage Software Catalog and Developer Platform',
  tagline: 'An open source framework for building developer portals',
  url: 'https://backstage.io',
  baseUrl: '/',
  organizationName: 'Spotify',
  projectName: 'backstage',
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://unpkg.com/medium-zoom@1.0.6/dist/medium-zoom.min.js',
    '/js/medium-zoom.js',
    '/js/dismissable-banner.js',
    '/js/scroll-nav-to-view-in-docs.js',
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=IBM+Plex+Mono:500,700&display=swap',
  ],
  favicon: 'img/favicon.ico',
  customFields: {
    fossWebsite: 'https://spotify.github.io/',
    repoUrl: 'https://github.com/backstage/backstage',
  },
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
    },
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true,
      rspackPersistentCache: true,
      // TODO: React has an issue with server rendering here.
      // ssgWorkerThreads: true,
      // TODO: This prints extra warnings in the console, add back when we have a fix.
      // swcHtmlMinimizer: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          editUrl: ({ docPath }) => {
            // Always point to the non-versioned directory when editing a doc page
            return `https://github.com/backstage/backstage/edit/master/docs/${docPath}`;
          },
          path: '../docs',
          sidebarPath: 'sidebars.ts',
          ...(useVersionedDocs
            ? {
                includeCurrentVersion: true,
                lastVersion: 'stable',
                versions: {
                  stable: {
                    label: 'Stable',
                    path: '/',
                    banner: 'none',
                    badge: false,
                  },
                  current: {
                    label: 'Next',
                    path: '/next',
                    banner: 'unreleased',
                    badge: true,
                  },
                },
              }
            : undefined),
          docItemComponent: '@theme/ApiItem',
        },
        blog: {
          path: 'blog',
          // Gets rid of the following:
          // Warning:  Some blog authors used in "2024-12-18-backstage-wrapped-2024.mdx" are not defined in "authors.yml":
          // - {"name":"Patrik Oldsberg, Spotify & Ben Lambert, Spotify","key":null,"page":null}
          // Note that we recommend to declare authors once in a "authors.yml" file and reference them by key in blog posts front matter to avoid author info duplication.
          onInlineAuthors: 'ignore',
        },
        theme: {
          customCss: 'src/theme/customTheme.scss',
        },
        gtag: {
          trackingID: 'G-KSEVGGNCJW',
        },
      },
    ],
  ],
  markdown: {
    preprocessor({ fileContent }) {
      // Replace all HTML comments with empty strings as these are not supported by MDXv2.
      function removeHtmlComments(input) {
        let previous;
        do {
          previous = input;
          input = input.replace(/<!--.*?-->/gs, '');
        } while (input !== previous);
        return input;
      }
      return removeHtmlComments(fileContent);
    },
    format: 'detect',
  },
  plugins: [
    'docusaurus-plugin-sass',
    function disableExpensiveBundlerOptimizationPlugin() {
      return {
        name: 'disable-expensive-bundler-optimizations',
        configureWebpack(_config) {
          return {
            optimization: {
              concatenateModules: false,
            },
          };
        },
      };
    },
    () => ({
      name: 'yaml-loader',
      configureWebpack() {
        return {
          module: {
            rules: [
              {
                test: /\.ya?ml$/,
                use: 'yaml-loader',
              },
            ],
          },
        };
      },
    }),
    ctx =>
      PatchedRedirectPlugin(ctx, {
        id: '@docusaurus/plugin-client-redirects',
        toExtensions: [],
        fromExtensions: [],
        redirects: [
          {
            from: '/docs',
            to: '/docs/overview/what-is-backstage',
          },
          {
            from: '/docs/features/software-catalog/software-catalog-overview',
            to: '/docs/features/software-catalog/',
          },
          {
            from: '/docs/features/software-templates/software-templates-index',
            to: '/docs/features/software-templates/',
          },
          {
            from: '/docs/features/techdocs/techdocs-overview',
            to: '/docs/features/techdocs/',
          },
          {
            from: '/docs/features/kubernetes/overview',
            to: '/docs/features/kubernetes/',
          },
          {
            from: '/docs/features/search/search-overview',
            to: '/docs/features/search/',
          },
          {
            from: '/docs/getting-started/running-backstage-locally',
            to: '/docs/getting-started/',
          },
          {
            from: '/docs/features/software-templates/testing-scaffolder-alpha',
            to: '/docs/features/software-templates/migrating-to-rjsf-v5',
          },
          {
            from: '/docs/auth/glossary',
            to: '/docs/references/glossary',
          },
          {
            from: '/docs/overview/glossary',
            to: '/docs/references/glossary',
          },
          {
            from: '/docs/getting-started/create-an-app',
            to: '/docs/getting-started/',
          },
          {
            from: '/docs/getting-started/configuration',
            to: '/docs/getting-started/#next-steps',
          },
          {
            from: '/docs/features/software-templates/authorizing-parameters-steps-and-actions',
            to: '/docs/features/software-templates/authorizing-scaffolder-template-details',
          },
          {
            from: '/docs/local-dev/cli-commands/',
            to: '/docs/tooling/cli/commands/',
          },
          {
            from: '/docs/local-dev/cli-build-system/',
            to: '/docs/tooling/cli/build-system/',
          },
          {
            from: '/docs/local-dev/cli-overview/',
            to: '/docs/tooling/cli/overview/',
          },
          {
            from: '/docs/local-dev/linking-local-packages/',
            to: '/docs/tooling/local-dev/linking-local-packages',
          },
          {
            from: '/docs/local-dev/debugging/',
            to: '/docs/tooling/local-dev/debugging',
          },
          {
            from: '/docs/plugins/url-reader/',
            to: '/docs/backend-system/core-services/url-reader',
          },
          {
            from: '/docs/getting-started/app-custom-theme',
            to: '/docs/conf/user-interface',
          },
          {
            from: '/docs/plugins/existing-plugins',
            to: '/docs/plugins/',
          },
        ],
      }),
    [
      'docusaurus-pushfeedback',
      {
        project: 'q8w1i6cair',
        hideIcon: true,
        customFont: true,
        buttonStyle: 'dark',
        ratingMode: 'stars',
      },
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api', // plugin id
        docsPluginId: 'classic', // configured for preset-classic
        config: {
          catalog: {
            ...defaultOpenApiOptions,
            specPath: '../plugins/catalog-backend/src/schema/openapi.yaml',
            outputDir: '../docs/features/software-catalog/api',
          } satisfies OpenApiPlugin.Options,
          search: {
            ...defaultOpenApiOptions,
            specPath: '../plugins/search-backend/src/schema/openapi.yaml',
            outputDir: '../docs/features/search/api',
          } satisfies OpenApiPlugin.Options,
          scaffolder: {
            ...defaultOpenApiOptions,
            specPath: '../plugins/scaffolder-backend/src/schema/openapi.yaml',
            outputDir: '../docs/features/software-templates/api',
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],
  themes: ['docusaurus-theme-openapi-docs'],
  themeConfig: {
    languageTabs: [
      {
        highlight: 'javascript',
        language: 'javascript',
        logoClass: 'javascript',
      },
      {
        highlight: 'bash',
        language: 'curl',
        logoClass: 'curl',
      },
      {
        highlight: 'powershell',
        language: 'powershell',
        logoClass: 'powershell',
      },
      {
        highlight: 'python',
        language: 'python',
        logoClass: 'python',
      },
      {
        highlight: 'java',
        language: 'java',
        logoClass: 'java',
        variant: 'unirest',
      },
      {
        highlight: 'go',
        language: 'go',
        logoClass: 'go',
      },
      {
        highlight: 'rust',
        language: 'rust',
        logoClass: 'rust',
      },
    ],

    colorMode: {
      disableSwitch: false,
      defaultMode: 'dark',
    },
    navbar: {
      logo: {
        alt: 'Backstage Software Catalog and Developer Platform',
        src: 'img/logo-black.svg',
        srcDark: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/overview/what-is-backstage',
          label: 'Docs',
          position: 'left',
        },
        {
          to: '/plugins',
          label: 'Plugins',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Reference',
          position: 'left',
          items: [
            {
              label: `Stable (${releases[0]})`,
              href: 'https://backstage.io/api/stable',
              target: '_self',
            },
            {
              label: 'Next',
              href: 'https://backstage.io/api/next',
              target: '_self',
            },
          ],
        },
        {
          to: `docs/releases/${releases[0]}`,
          label: 'Releases',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          to: '/demos',
          label: 'Demos',
          position: 'left',
        },
        {
          to: '/community',
          label: 'Community',
          position: 'left',
        },
        {
          href: 'https://github.com/backstage/backstage',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://discord.gg/backstage-687207715902193673',
          position: 'right',
          className: 'header-discord-link',
          'aria-label': 'Discord community',
        },
        ...(useVersionedDocs
          ? [
              {
                type: 'docsVersionDropdown',
                position: 'right' as const,
              },
            ]
          : []),
      ],
    },
    image: 'img/sharing-opengraph.png',
    footer: {
      links: [
        {
          items: [
            {
              html: `
                <a href="/" aria-label="Backstage Home">
                  <div class="footerLogo"></div>
                </a>`,
            },
          ],
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'What is Backstage?',
              to: 'docs/overview/what-is-backstage',
            },
            {
              label: 'Getting started',
              to: 'docs/getting-started/',
            },
            {
              label: 'Software Catalog',
              to: 'docs/features/software-catalog/',
            },
            {
              label: 'Create a Plugin',
              to: 'docs/plugins/create-a-plugin',
            },
            {
              label: 'Designing for Backstage',
              to: 'docs/dls/design',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Support chatroom',
              to: 'https://discord.gg/backstage-687207715902193673',
            },
            {
              label: 'Contributing',
              to: 'https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md',
            },
            {
              label: 'Adopting',
              to: 'https://backstage.io/docs/getting-started/',
            },
            {
              label: 'Subscribe to our newsletter',
              to: 'https://spoti.fi/backstagenewsletter',
            },
            {
              label: 'CNCF Incubation',
              to: 'https://www.cncf.io/projects/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/backstage/',
            },
            {
              label: 'Assets',
              to: 'https://github.com/cncf/artwork/tree/main/projects/backstage',
            },
          ],
        },
      ],
      copyright: `<p style="text-align:center"><a href="https://spotify.github.io/">Made with ❤️ at Spotify</a></p><p class="copyright">Copyright © ${new Date().getFullYear()} Backstage Project Authors. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page: <a href="https://www.linuxfoundation.org/trademark-usage" />https://www.linuxfoundation.org/trademark-usage</a></p>`,
    },
    algolia: {
      apiKey: '60d2643a9c6306463f15f8c3556e7f2e', // Owned by @Rugvip
      indexName: 'crawler_Backstage Docusaurus 2',
      appId: 'JCMFNHCHI8',
      searchParameters: {},
    },
    prism: {
      theme: backstageTheme,
      // Supported languages: https://prismjs.com/#supported-languages
      // Default languages: https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/generate-prism-languages/index.ts#L9-L23
      additionalLanguages: ['docker', 'bash'],
      magicComments: [
        // Extend the default highlight class name
        {
          className: 'code-block-highlight-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-add-line',
          line: 'highlight-add-next-line',
          block: { start: 'highlight-add-start', end: 'highlight-add-end' },
        },
        {
          className: 'code-block-remove-line',
          line: 'highlight-remove-next-line',
          block: {
            start: 'highlight-remove-start',
            end: 'highlight-remove-end',
          },
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};
export default config;
