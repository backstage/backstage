import React, { ComponentType, FC } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { AppComponentBuilder, App } from '../app/types';
import { useEntity, useEntityUri, useEntityConfig } from './EntityContext';
import EntityLink from '../../components/EntityLink/EntityLink';
import BackstagePlugin from '../plugin/Plugin';
import { Header } from '../..';
import {
  EntityPageNavbarProps,
  EntityPageHeaderProps,
  EntityPageProps,
  EntityPageNavItem,
  EntityPageView,
} from './types';

// type AppComponents = {
//   EntityPage: ComponentType<EntityPageProps>;
//   EntityPageNavbar: ComponentType<EntityPageNavbarProps>;
//   EntityPageHeader: ComponentType<EntityPageHeaderProps>;
// };

const DefaultEntityPageNavbar: FC<EntityPageNavbarProps> = ({ navItems }) => {
  const entityUri = useEntityUri();

  return (
    <List>
      {navItems.map(({ title, target }) => (
        <ListItem key={target}>
          <EntityLink uri={entityUri} subPath={target}>
            {title}
          </EntityLink>
        </ListItem>
      ))}
    </List>
  );
};

const DefaultEntityPageHeader: FC<EntityPageHeaderProps> = () => {
  const { id } = useEntity();
  const config = useEntityConfig();
  return <Header title={`${config.title} - ${id}`} />;
};

const DefaultEntityPage: FC<EntityPageProps> = ({ navItems, views }) => {
  const { kind, id } = useEntity();
  const basePath = `/entity/${kind}/${id}`;

  return (
    <div>
      <DefaultEntityPageHeader />
      <DefaultEntityPageNavbar navItems={navItems} />
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
    </div>
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

    return () => <DefaultEntityPage navItems={navItems} views={views} />;
  }
}
