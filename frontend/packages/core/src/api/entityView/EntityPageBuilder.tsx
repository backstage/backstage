import React, { ComponentType, FC } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { AppComponentBuilder, App } from '../app/types';
import { useEntity, useEntityUri, useEntityConfig } from './EntityContext';
import EntityLink from '../../components/EntityLink/EntityLink';
import BackstagePlugin from '../plugin/Plugin';

const EntityLayout: FC<{}> = ({ children }) => {
  const config = useEntityConfig();
  return (
    <div style={{ backgroundColor: config.color.primary }}>{children}</div>
  );
};

const EntitySidebar: FC<{}> = ({ children }) => {
  return <List>{children}</List>;
};

const EntitySidebarItem: FC<{ title: string; path: string }> = ({
  title,
  path,
}) => {
  const entityUri = useEntityUri();

  return (
    <ListItem>
      <EntityLink uri={entityUri} subPath={path}>
        {title}
      </EntityLink>
    </ListItem>
  );
};

type EntityPageNavItem = {
  title: string;
  target: string;
};

type EntityPageView = {
  path: string;
  component: ComponentType<any>;
};

type Props = {
  navItems: EntityPageNavItem[];
  views: EntityPageView[];
};

const EntityPageComponent: FC<Props> = ({ navItems, views }) => {
  const { kind, id } = useEntity();
  const basePath = `/entity/${kind}/${id}`;

  return (
    <EntityLayout>
      <EntitySidebar>
        {navItems.map(({ title, target }) => (
          <EntitySidebarItem key={target} title={title} path={target} />
        ))}
      </EntitySidebar>
      <Switch>
        {views.map(({ path, component }) => (
          <Route
            key={path}
            exact
            path={`${basePath}${path}`}
            component={component}
          />
        ))}
        <Redirect from={basePath} to={`${basePath}${views[0].path}`} />
      </Switch>
    </EntityLayout>
  );
};

type EntityPageRegistration =
  | {
      type: 'page';
      title: string;
      path: string;
      page: AppComponentBuilder;
    }
  | {
      type: 'plugin';
      plugin: BackstagePlugin;
    }
  | {
      type: 'component';
      title: string;
      path: string;
      component: ComponentType<any>;
    };

export default class EntityPageBuilder extends AppComponentBuilder {
  private readonly registrations = new Array<EntityPageRegistration>();

  addPage(
    title: string,
    path: string,
    page: AppComponentBuilder,
  ): EntityPageBuilder {
    this.registrations.push({ type: 'page', title, path, page });
    return this;
  }

  addComponent(
    title: string,
    path: string,
    component: ComponentType<any>,
  ): EntityPageBuilder {
    this.registrations.push({ type: 'component', title, path, component });
    return this;
  }

  register(plugin: BackstagePlugin): EntityPageBuilder {
    this.registrations.push({ type: 'plugin', plugin });
    return this;
  }

  build(app: App): ComponentType<any> {
    const navItems = new Array<EntityPageNavItem>();
    const views = new Array<EntityPageView>();

    for (const reg of this.registrations) {
      switch (reg.type) {
        case 'page': {
          const { title, path, page } = reg;
          navItems.push({ title, target: path });
          views.push({ path, component: page.build(app) });
          break;
        }
        case 'component': {
          const { title, path, component } = reg;
          navItems.push({ title, target: path });
          views.push({ path, component });
          break;
        }
        case 'plugin': {
          let added = false;
          for (const output of reg.plugin.output()) {
            switch (output.type) {
              case 'entity-page-nav-item':
                const { title, target } = output;
                navItems.push({ title, target });
                added = true;
                break;
              case 'entity-page-view-route':
                const { path, component } = output;
                views.push({ path, component });
                added = true;
                break;
            }
          }
          if (!added) {
            throw new Error(
              `Plugin ${reg.plugin} was registered as entity view, but did not provide any output`,
            );
          }
          break;
        }
      }
    }

    return () => <EntityPageComponent navItems={navItems} views={views} />;
  }
}
