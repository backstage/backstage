/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [];

const siteConfig = {
  title: 'Backstage', // Title for your website.
  tagline: 'An open platform for building developer portals',
  url: 'https://backstage.io', // Your website URL
  cname: 'backstage.io',
  baseUrl: '/', // Base URL for your project */
  editUrl: 'https://github.com/spotify/backstage/tree/master/docs/',

  // Used for publishing and more
  projectName: 'backstage',
  organizationName: 'Spotify',
  fossWebsite: 'https://spotify.github.io/',

  // Google Analytics
  gaTrackingId: 'UA-48912878-10',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {
      href: 'https://github.com/spotify/backstage',
      label: 'GitHub',
    },
    {
      doc: 'overview/what-is-backstage',
      href: '/docs',
      label: 'Docs',
    },
    {
      page: 'blog',
      blog: true,
      label: 'Blog',
    },
    {
      page: 'demos',
      label: 'Demos',
    },
    {
      href: 'https://mailchi.mp/spotify/backstage-community',
      label: 'Newsletter',
    },
  ],

  /* path to images for header/footer */
  // headerIcon: "img/android-chrome-192x192.png",
  footerIcon: 'img/android-chrome-192x192.png',
  favicon: 'img/favicon.svg',

  /* Colors for website */
  colors: {
    primaryColor: '#36BAA2',
    secondaryColor: '#121212',
    textColor: '#FFFFFF',
    navigatorTitleTextColor: '#9e9e9e',
    navigatorItemTextColor: '#616161',
  },

  /* Colors for syntax highlighting */
  highlight: {
    theme: 'dark',
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Spotify AB`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'monokai',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/logo-gradient-on-dark.svg',
  twitterImage: 'img/logo-gradient-on-dark.svg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/spotify/backstage',
  twitterUsername: 'SpotifyEng',

  stylesheets: [
    'https://fonts.googleapis.com/css?family=IBM+Plex+Mono:500,700&display=swap',
  ],

  algolia: {
    apiKey: '8d115c9875ba0f4feaee95bab55a1645',
    indexName: 'backstage',
    searchParameters: {}, // Optional (if provided by Algolia)
  },
};

module.exports = siteConfig;
