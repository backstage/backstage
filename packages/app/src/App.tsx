/*
 * Copyright 2023 The Backstage Authors
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

import { createApp } from '@backstage/frontend-defaults';
import { guestSignInPageModule } from './GuestSignInPage';
import notFoundErrorPage from './examples/notFoundErrorPageExtension';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import homePlugin from '@backstage/plugin-home/alpha';

import { createFrontendModule } from '@backstage/frontend-plugin-api';

import {
  HomePageLayoutBlueprint,
  type HomePageLayoutProps,
} from '@backstage/plugin-home-react/alpha';
import { Fragment } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import {
  CustomHomepageGrid,
  WelcomeTitle,
  HeaderWorldClock,
  type ClockConfig,
} from '@backstage/plugin-home';
import {
  techdocsPlugin,
  TechDocsIndexPage,
  TechDocsReaderPage,
  EntityTechdocsContent,
} from '@backstage/plugin-techdocs';
import appVisualizerPlugin from '@backstage/plugin-app-visualizer';
import {
  techDocsMermaidAddonModule,
  techDocsLightBoxAddonModule,
} from '@backstage/plugin-techdocs-module-addons-contrib/alpha';
import {
  convertLegacyPageExtension,
  convertLegacyPlugin,
} from '@backstage/core-compat-api';
import { convertLegacyEntityContentExtension } from '@backstage/plugin-catalog-react/alpha';
import { pluginInfoResolver } from './pluginInfoResolver';
import { appModuleNav } from './modules/appModuleNav';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

/*

# Notes

TODO:
 - proper createApp
 - connect extensions and plugins, provide method?
 - higher level API for creating standard extensions + higher order framework API for creating those?
 - extension config schema + validation
 - figure out how to resolve configured extension ref to runtime value, e.g. '@backstage/plugin-graphiql#GraphiqlPage'
 - make sure all shorthands work + tests
 - figure out package structure / how to ship, frontend-plugin-api/frontend-app-api
 - figure out routing, useRouteRef in the new system
 - Legacy plugins / interop
 - dynamic updates, runtime API

*/

/* core */

// const discoverPackages = async () => {
//   // stub for now, deferring package discovery til later
//   return ['@backstage/plugin-graphiql'];
// };

/* graphiql package */

/* app.tsx */

/**
 * TechDocs does support the new frontend system so this conversion is not
 * strictly necessary, but it's left here to provide a demo of the utilities for
 * converting legacy plugins.
 *
 * Both TechDocsIndexPage and TechDocsReaderPage are registered as independent
 * page extensions.  The reader path omits the trailing wildcard because the
 * AppRoutes extension already appends "/*" to every route path — including a
 * duplicate wildcard would produce an invalid double-star pattern that React
 * Router v6 cannot match correctly.
 */
const convertedTechdocsPlugin = convertLegacyPlugin(techdocsPlugin, {
  extensions: [
    convertLegacyPageExtension(TechDocsIndexPage, {
      name: 'index',
      path: '/docs',
    }),
    convertLegacyPageExtension(TechDocsReaderPage, {
      name: 'reader',
      path: '/docs/:namespace/:kind/:name',
    }),
    convertLegacyEntityContentExtension(EntityTechdocsContent),
  ],
});

const clockConfigs: ClockConfig[] = [
  { label: 'NYC', timeZone: 'America/New_York' },
  { label: 'UTC', timeZone: 'UTC' },
  { label: 'STO', timeZone: 'Europe/Stockholm' },
  { label: 'TYO', timeZone: 'Asia/Tokyo' },
];

const lifecycleStages = [
  {
    label: 'Ingestion',
    color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
    description: 'Codebase mapping and dependency analysis',
  },
  {
    label: 'Tech Spec',
    color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
    description: 'Automated documentation generation',
  },
  {
    label: 'Prompt Review',
    color: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
    description: 'Requirements refinement and validation',
  },
  {
    label: 'AAP Generation',
    color: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
    description: 'Architect Action Plan creation',
  },
  {
    label: 'Project Guide Review',
    color: 'bg-red-500/15 text-red-700 dark:text-red-400',
    description: 'The critical 20% - human expertise required',
  },
  {
    label: 'Code Review',
    color: 'bg-green-500/15 text-green-700 dark:text-green-400',
    description: 'Production-ready reference implementation',
  },
];

function BlitzySandboxWelcome() {
  return (
    <div className="flex flex-col items-center px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold tracking-tight mb-3">
          Blitzy Sandbox
        </h1>
        <p className="text-xl text-muted-foreground italic">
          The Testing Ground for AI-Native Development
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
          Explore autonomous code generation at scale &mdash; production-grade
          repositories, zero friction
        </p>
      </div>

      <div className="w-16 h-px bg-border mb-10" />

      {/* What You Get */}
      <div className="w-full mb-10">
        <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto mb-6">
          Neutral, production-grade codebases where you can explore AI-native
          development workflows. Standalone repositories, ready to explore, no
          setup friction.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { title: 'Hands-on', desc: 'Real codebases in various states' },
            { title: 'Learning', desc: 'Practical AI-native examples' },
            { title: 'Experiment', desc: 'Test prompts and iterate' },
            { title: 'Insights', desc: 'Generation quality and patterns' },
          ].map(item => (
            <div key={item.title} className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-16 h-px bg-border mb-10" />

      {/* The 80/20 Principle */}
      <div className="w-full text-center mb-10">
        <h2 className="text-lg font-semibold mb-2">The 80/20 Principle</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-4">
          Blitzy automates{' '}
          <span className="font-semibold text-foreground">80%</span> of
          development through AI agents, leaving the critical{' '}
          <span className="font-semibold text-foreground">20%</span> for human
          expertise.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-2xl mx-auto">
          {[
            'System 2 Thinking',
            'Multi-Agent Orchestration',
            'Runtime Validation',
            'Human-in-the-Loop',
          ].map(concept => (
            <div
              key={concept}
              className="text-xs text-muted-foreground bg-muted/50 rounded px-3 py-2 text-center"
            >
              {concept}
            </div>
          ))}
        </div>
      </div>

      <div className="w-16 h-px bg-border mb-10" />

      {/* Project Lifecycle */}
      <div className="w-full mb-10">
        <h2 className="text-lg font-semibold text-center mb-4">
          Project Lifecycle
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {lifecycleStages.map(stage => (
            <div
              key={stage.label}
              className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30"
            >
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${stage.color}`}
              >
                {stage.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {stage.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-16 h-px bg-border mb-10" />

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-8 mb-10 text-center">
        <a
          href="/catalog"
          className="group flex flex-col items-center gap-2 no-underline"
        >
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <span className="text-xl">&#9776;</span>
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Catalog
          </span>
        </a>
        <a
          href="/docs"
          className="group flex flex-col items-center gap-2 no-underline"
        >
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <span className="text-xl">&#128214;</span>
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Docs
          </span>
        </a>
      </div>

      {/* Resources */}
      <div className="w-full mb-8">
        <div className="flex flex-wrap justify-center gap-3 text-xs">
          <a
            href="https://docs.blitzy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Platform Docs
          </a>
          <a
            href="https://platform.blitzy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Blitzy Platform
          </a>
          <a
            href="https://docs.blitzy.com/templates"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Prompt Library
          </a>
          <a
            href="https://docs.blitzy.com/prompt-engineering/golden-rules"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Best Practices
          </a>
          <a
            href="https://blitzy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            About Blitzy
          </a>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/50 mb-4">
        Where AI-native development meets Open Source Enterprise Software
      </p>
    </div>
  );
}

const customHomePageModule = createFrontendModule({
  pluginId: 'home',
  extensions: [
    HomePageLayoutBlueprint.make({
      params: {
        loader: async () =>
          function CustomHomePageLayout({ widgets }: HomePageLayoutProps) {
            return (
              <Page themeId="home">
                <Header title={<WelcomeTitle />} pageTitleOverride="Home">
                  <HeaderWorldClock clockConfigs={clockConfigs} />
                </Header>
                <Content>
                  <BlitzySandboxWelcome />
                  {widgets.length > 0 && (
                    <div className="max-w-full overflow-x-hidden [&_pre]:overflow-x-auto [&_pre]:max-w-full mt-8">
                      <CustomHomepageGrid>
                        {widgets.map((widget, index) => (
                          <Fragment key={widget.name ?? index}>
                            {widget.component}
                          </Fragment>
                        ))}
                      </CustomHomepageGrid>
                    </div>
                  )}
                </Content>
              </Page>
            );
          },
      },
    }),
  ],
});

// customize catalog example
const customizedCatalog = catalogPlugin.withOverrides({
  extensions: [
    catalogPlugin.getExtension('entity-content:catalog/overview').override({
      params: {
        icon: <FontAwesomeIcon icon={faCircleInfo} />,
      },
    }),
  ],
});

const notFoundErrorPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [notFoundErrorPage],
});

const app = createApp({
  features: [
    customizedCatalog,
    convertedTechdocsPlugin,
    userSettingsPlugin,
    homePlugin,
    appVisualizerPlugin,
    notFoundErrorPageModule,
    appModuleNav,
    customHomePageModule,
    guestSignInPageModule,
    techDocsMermaidAddonModule,
    techDocsLightBoxAddonModule,
  ],
  advanced: {
    pluginInfoResolver,
  },
  /* Handled through config instead */
  // bindRoutes({ bind }) {
  //   bind(pagesPlugin.externalRoutes, { pageX: pagesPlugin.routes.pageX });
  // },
});

// const legacyApp = createLegacyApp({ plugins: [legacyGraphiqlPlugin] });

export default app.createRoot();

// const routes = (
//   <FlatRoutes>
//     {/* <Route path="/" element={<Navigate to="catalog" />} />
//     <Route path="/catalog" element={<CatalogIndexPage />} />
//     <Route
//       path="/catalog/:namespace/:kind/:name"
//       element={<CatalogEntityPage />}
//     >
//       <EntityLayout>
//         <EntityLayout.Route path="/" title="Overview">
//           <Grid container spacing={3} alignItems="stretch">
//             <Grid item md={6} xs={12}>
//               <EntityAboutCard variant="gridItem" />
//             </Grid>

//             <Grid item md={4} xs={12}>
//               <EntityLinksCard />
//             </Grid>
//           </Grid>
//         </EntityLayout.Route>

//         <EntityLayout.Route path="/todos" title="TODOs">
//           <EntityTodoContent />
//         </EntityLayout.Route>
//       </EntityLayout>
//     </Route>
//     <Route
//       path="/catalog-import"
//       element={
//           <CatalogImportPage />
//       }
//     /> */}
//     {/* <Route
//       path="/tech-radar"
//       element={<TechRadarPage width={1500} height={800} />}
//     /> */}
//     <Route path="/graphiql" element={<GraphiQLPage />} />
//   </FlatRoutes>
// );

// export default app.createRoot(
//   <>
//     {/* <AlertDisplay transientTimeoutMs={2500} />
//     <OAuthRequestDialog /> */}
//     <AppRouter>{routes}</AppRouter>
//   </>,
// );
