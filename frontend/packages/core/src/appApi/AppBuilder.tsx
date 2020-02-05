import React, { ComponentType, FC } from 'react';
import { AppContextProvider } from './AppContext';
import { App, EntityConfig, AppComponentBuilder } from './types';
import { Route, Switch, useParams, Redirect } from 'react-router-dom';
import EntityKind from './EntityKind';
import { EntityContextProvider } from './EntityContext';
import { BackstagePlugin } from './types';

class AppImpl implements App {
  constructor(private readonly entities: Map<string, EntityKind>) {}

  getEntityConfig(kind: string): EntityConfig {
    const entity = this.entities.get(kind);
    if (!entity) {
      throw new Error('EntityKind not found');
    }
    return entity.config;
  }
}

function builtComponent(
  app: App,
  component: ComponentType<any> | AppComponentBuilder,
) {
  if (component instanceof AppComponentBuilder) {
    return component.build(app);
  }
  return component;
}

export default class AppBuilder {
  private readonly entities = new Map<string, EntityKind>();
  private readonly plugins = new Map<string, BackstagePlugin>();

  registerEntityKind(...entity: EntityKind[]) {
    for (const e of entity) {
      const { kind } = e.config;
      if (this.entities.has(e.config.kind)) {
        throw new Error(`EntityKind '${kind}' is already registered`);
      }
      this.entities.set(e.config.kind, e);
    }
  }

  registerPlugin(...plugin: BackstagePlugin[]) {
    for (const p of plugin) {
      const { id } = p;
      if (this.plugins.has(id)) {
        throw new Error(`Plugin '${id}' is already registered`);
      }
      this.plugins.set(id, p);
    }
  }

  build(): ComponentType<{}> {
    const app = new AppImpl(this.entities);

    const entityRoutes = new Array<JSX.Element>();

    for (const { config } of this.entities.values()) {
      const { kind, pages } = config;
      const basePath = `/entity/${kind}`;

      if (pages.list) {
        const ListComponent = builtComponent(app, pages.list);

        const Component: FC<{}> = () => (
          <EntityContextProvider config={config}>
            <ListComponent />
          </EntityContextProvider>
        );

        const path = basePath;
        entityRoutes.push(
          <Route key={path} path={path} component={Component} />,
        );
      }

      if (pages.view) {
        const ViewComponent = builtComponent(app, pages.view);

        const Component: FC<{}> = () => {
          const { entityId } = useParams<{ entityId: string }>();
          return (
            <EntityContextProvider config={config} id={entityId}>
              <ViewComponent />
            </EntityContextProvider>
          );
        };

        const path = `${basePath}/:entityId`;
        entityRoutes.push(
          <Route key={path} path={path} component={Component} />,
        );
      }
    }

    const pluginRoutes = new Array<JSX.Element>();

    for (const plugin of this.plugins.values()) {
      plugin.register({
        router: {
          registerRoute(path, component, options = {}) {
            if (path.startsWith('/entity/')) {
              throw new Error(
                `Plugin ${plugin.id} tried to register forbidden route ${path}`,
              );
            }
            pluginRoutes.push(
              <Route path={path} component={component} {...options} />,
            );
          },
          registerRedirect(path, target, options = {}) {
            if (path.startsWith('/entity/')) {
              throw new Error(
                `Plugin ${plugin.id} tried to register forbidden redirect ${path}`,
              );
            }
            pluginRoutes.push(
              <Redirect path={path} to={target} {...options} />,
            );
          },
        },
      });
    }

    const routes = [...pluginRoutes, ...entityRoutes];

    return () => (
      <AppContextProvider app={app}>
        <Switch>
          {routes}
          <Route component={() => <span>404 Not Found</span>} />
        </Switch>
      </AppContextProvider>
    );
  }
}
