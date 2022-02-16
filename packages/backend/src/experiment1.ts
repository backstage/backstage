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
import express, { NextFunction, Request, Response } from 'express';
import Router from 'express-promise-router';
/*
Things to consider:

  - Make the router accessible? Allow integrators to add their own middleware
  - The backend entrypoint should make it clear what routes are available
  - Modules should not be required to have a router
  - Internal modules that extend the functionality of plugins?
    - Exposed on under the plugin route, access to same resources?

*/

const routes = {
  '/': [/* something */],
} as const;

interface BackendModule {
    routes?: () => [string, (request: Request, response: Response, next: NextFunction) => void];
    start?: () => Promise<void>;
    stop?: () => Promise<void>;
}

const theBackend: BackendModule = {
    const modules: Module[];
    async start() {
        modules.forEach(it => it.start())
    }
    routes() {
        return modules.reduce((acc, it) => ({...acc, [it.name]: it.routes()}), {})
    }
}

async function main_version1() {
  const backend: BackendModule = createBackend({

  })

  // -> modules install routes and other stuff too?
  backend.installModule(catalogPlugin.modules.entitiesCatalog({ startEngine: false }))
  backend.installModule(catalogPlugin.modules.locationService({...config}))

  const app = express()

  // Probably problematic to have the installation be too deep
  app.use('/catalog/entities', catalogPlugin.modules.entitiesCatalog({ startEngine: false }))

  app.use('/catalog', catalogPlugin.modules.entitiesCatalog({ startEngine: false }))

  const entitiesCatalogModule = catalogPlugin.modules.entitiesCatalog({ startEngine: false })
  for (const route of entitiesCatalogModule.routes) {
    app.use(route.path, route.handler)
  }

  const entitiesCatalogController = createController(catalogPlugin.modules.entitiesCatalog({ startEngine: false }))
  app.use('/catalog/entities', entitiesCatalogController.entities)

  app.use('/catalog', createPluginRouter(entitiesCatalogModule.routes()));
  // Get router from startup?
  // Hiding creation of router might be bad

  Object.entries(backend.routes()).forEach(([module, routes]) => console.log(`Registering route ${route.join(', ')} for module ${module}`)))

  const { router } = await backend.start()

  // Or access the router directly?
  const router = backend.getRouter();




  app.use(router);
}


async function main_version2() {
  const backend = createBackend({
    modules: [
      catalogPlugin.modules.entitiesCatalog(),
      catalogPlugin.modules.locationService(),
    ],
  })

  await backend.start()
}


async function main_version3() {
  const backend = createBackend({
    modules: {
      '/catalog': [
        catalogPlugin.modules.entitiesCatalog(),
        catalogPlugin.modules.locationService(),
      ],
    },
  })

  await backend.start()
}


async function main_version4() {
  const backend = createBackend({
    modules: {
      '/catalog/entities':  catalogPlugin.modules.entitiesCatalog(),
      '/catalog/locations': catalogPlugin.modules.locationService(),
      '/catalog/extensions': roadieCatalogPlugin.modules.catalogExtensions(),
    },
  })

  await backend.start()
}


async function main_version5() {
  const backend = createBackend({
    plugins: [
      catalogPlugin(),
    ],
  })

  await backend.start()
}


async function main_version5b() {
  const backend = createBackend({
    plugins: [
      catalogPlugin.modules.entitiesCatalog(),
      catalogPlugin.modules.locationService(),
      scaffolderPlugin,
    ],
  })

  await backend.start()
}


async function main_version5c() {
  const backend = createBackend({
    plugins: [
      scaffolderPlugin,
    ],
    modules: [
      catalogPlugin.modules.entitiesCatalog(),
      catalogPlugin.modules.locationService(),
    ]
  })

  await backend.start()
}


async function main_version6() {
  const backend = createBackend({
    plugins: [
      catalogPlugin({ extensions }),
    ],
  })

  await backend.start()
}

async function main_version7() {
  type CatalogExtension = ({ database, orchestrator, }: any) => () => Promise<{ router: Router }>;

  const extensions: CatalogExtension[] = [
      ({ database, orchestrator }) => async () => {
          const router = Router();
          router.post('/stop-orchestrator', () => orchestrator.stop())

          return { router };
      }
  ];

  // /extensions/stop-orch


  const backend = createBackend({
    plugins: [
      catalogPlugin({ extensions }),
    ],
  })

  await backend.start()
}

async function main_version7b() {
  type CatalogExtension = ({ container }: any) => () => Promise<void>;

  const extensions: CatalogExtension[] = [
      (container) => async () => {
        const pluginRouter = container.get('pluginRouter')
        const orchestrator = container.get('orchestrator')

        const router = Router();
        router.post('/stop-orchestrator', () => orchestrator.stop())

        pluginRouter.use(router)
      }
  ];

  // /extensions/stop-orch


  const backend = createBackend({
    plugins: [
      catalogPlugin({ extensions }),
    ],
  })

  await backend.start()
}













// Catalog Plugin implementation

const myModule = createCatalogExtension({
  entityProviders: [MyProviderFactory],
  entityProcessors: [],
});

class MyProviderFactory {
  constructor(registry: ProviderRegistry /* from the catalog */, things: Thing[] /* from the adopter */) {
    registry.add(...things.map(t => t.create(...)))
  }
}

class MyProviderFactory {
  constructor(ctx: Context, registry: ProviderRegistry, things: Thing[]) {
    registry.add(...things.map(thing => ctx.get('catalog-provider-api').withTag(thing)))
  }
}


const myEntityProvider = createBackendModule({
  factory: (container) => {
    const api = container.get('catalog-provider-api')
    ///...
    return // ???
  }
})

const myEntityProvider = createCatalogEntityProviderExtension({
  ...,
});

const catalogPlugin = createBackendPlugin({
  modules: [
    myModule
  ]
})

// How do you install additional features into the catalog?


import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import { githubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';

async function main_version10() {
  const backend = createBackend({
    modules: [
      catalogPlugin.modules.entitiesCatalog({
        providers: [githubEntityProvider],
      }),
      catalogPlugin.modules.locationService(),
    ]
  })

  await backend.start()
}


async function main_version10a() {
  const backend = createBackend({
    modules: [
      catalogPlugin.modules.entitiesCatalog(),
      catalogPlugin.modules.locationService(),
      githubEntityProvider,
    ]
  })

  await backend.start()
}


async function main_version10b() {
  const backend = createBackend({
    modules: [
      catalogPlugin.modules.entitiesCatalog(),
      catalogPlugin.modules.locationService(),
      githubEntityProvider,
    ]
  })

  await backend.start()
}

async function main_version10c() {
  const backend = createBackend({
    modules: [
      catalogPlugin(),
      searchPlugin({
        collators: new CatalogCollator(), // :(
      }),
    ]
  })

  await backend.start()
}



// possible DI way to do that @johan, nice maaan!
container.add<SearchCollator>(someCollator);
container.add<SearchCollator>(otherCOllator);
...
container.getAll<SearchCollator>();

// types are build time ;) :shakefist:
container.add(SearchCollator, someCollator);
container.add(SearchCollator, otherCOllator);
...
container.getAll(SearchCollator);
