/*
 * Copyright 2020 Spotify AB
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
module.exports = {
  title: "Backstage",
  tagline: "An open platform for building developer portals",
  url: "https://backstage.io",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  onBrokenLinks: "throw",
  organizationName: "Spotify", // Usually your GitHub org/user name.
  projectName: "backstage", // Usually your repo name.
  stylesheets: [
    "https://fonts.googleapis.com/css?family=IBM+Plex+Mono:500,700&display=swap",
  ],
  scripts: [
    "https://platform.twitter.com/widgets.js",
    "https://buttons.github.io/buttons.js",
  ],
  themeConfig: {
    twitterImage: "logo_assets/png/Backstage_Identity_Assets_Artwork_RGB_04_Icon_Teal.png",
    ogImage: "logo_assets/png/Backstage_Identity_Assets_Artwork_RGB_04_Icon_Teal.png",
    algolia: {
      apiKey: "8d115c9875ba0f4feaee95bab55a1645",
      indexName: "backstage",
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
    },
    googleAnalytics: {
      trackingID: 'UA-163836834-5',
    },
    image:
      "logo_assets/png/Backstage_Identity_Assets_Artwork_RGB_04_Icon_Teal.png",
    navbar: {
      logo: {
        alt: "Backstage Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          href: "https://github.com/spotify/backstage",
          label: "GitHub",
          position: "left",
        },
        {
          to: "/docs/overview/what-is-backstage",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          to: "/plugins",
          label: "Plugins",
          position: "left",
        },
        {
          to: "/blog",
          label: "Blog",
          position: "left",
        },
        {
          to: "/demos",
          label: "Demos",
          position: "left",
        },
        {
          href: "https://mailchi.mp/spotify/backstage-community",
          label: "Newsletter",
          position: "left",
        },
      ],
    },
    prism: {
      theme: require("prism-react-renderer/themes/github"),
      darkTheme: require("prism-react-renderer/themes/dracula"),
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: './docs',
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/spotify/backstage/edit/master/docs",
        },
        blog: {
          postsPerPage: 4,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
