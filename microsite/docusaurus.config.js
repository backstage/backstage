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
const prismTheme = require('prism-react-renderer/themes/vsDark');
prismTheme.plain.backgroundColor = '#232323';

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'Backstage Software Catalog and Developer Platform',
  tagline: 'An open platform for building developer portals',
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
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          editUrl: 'https://github.com/backstage/backstage/edit/master/docs/',
          path: '../docs',
          sidebarPath: 'sidebars.json',
        },
        blog: {
          path: 'blog',
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
    preprocessor({ filePath, fileContent }) {
      // Replace all HTML comments with emtpy strings as these are not supported by MDXv2.
      return fileContent.replace(/<!--.*?-->/gs, '');
    },
    format: 'md',
  },
  webpack: {
    jsLoader: isServer => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },
  plugins: [
    'docusaurus-plugin-sass',
    () => ({
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
    [
      '@docusaurus/plugin-client-redirects',
      {
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
        ],
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
      },
      navbar: {
        logo: {
          alt: 'Backstage Software Catalog and Developer Platform',
          src: 'img/logo.svg',
        },
        items: [
          {
            href: 'https://github.com/backstage/backstage',
            label: 'GitHub',
            position: 'left',
          },
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
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
          {
            to: 'docs/releases/v1.22.0',
            label: 'Releases',
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
                to: 'https://backstage.spotify.com',
              },
              {
                label: 'Subscribe to our newsletter',
                to: 'https://info.backstage.spotify.com/newsletter_subscribe',
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
                label: 'Open Source @ Spotify',
                to: 'https://spotify.github.io/',
              },
              {
                label: 'Spotify Engineering Blog',
                to: 'https://engineering.atspotify.com/',
              },
              {
                label: 'Spotify for Developers',
                to: 'https://developer.spotify.com/',
              },
              {
                label: 'GitHub',
                to: 'https://github.com/backstage/',
              },
            ],
          },
        ],
        copyright:
          '<p style="text-align:center"><a href="https://spotify.github.io/">Made with ❤️ at Spotify</a></p><p class="copyright">Copyright © 2024 Backstage Project Authors. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page: https://www.linuxfoundation.org/trademark-usage</p>',
      },
      algolia: {
        apiKey: '1f0ba86672ccfc3576faa94583e5b318',
        indexName: 'crawler_Backstage Docusaurus 2',
        appId: 'JCMFNHCHI8',
        searchParameters: {},
      },
      prism: {
        theme: prismTheme,
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
    },
};
