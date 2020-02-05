import React, { ComponentType, FC } from 'react';
import { AppComponentBuilder, App } from './types';
import { useEntity, useEntityUri, useEntityConfig } from './EntityContext';
import { Route, Redirect, Switch } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import EntityLink from './EntityLink';

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

type EntityViewPage = {
  title: string;
  path: string;
  component: ComponentType<any>;
};

type Props = {
  pages: EntityViewPage[];
};

const EntityViewComponent: FC<Props> = ({ pages }) => {
  const { kind, id } = useEntity();
  const basePath = `/entity/${kind}/${id}`;

  return (
    <EntityLayout>
      <EntitySidebar>
        {pages.map(({ title, path }) => (
          <EntitySidebarItem key={path} title={title} path={path} />
        ))}
      </EntitySidebar>
      <Switch>
        {pages.map(({ path, component }) => (
          <Route
            key={path}
            exact
            path={`${basePath}/${path}`}
            component={component}
          />
        ))}
        <Redirect from={basePath} to={`${basePath}/${pages[0].path}`} />
      </Switch>
    </EntityLayout>
  );
};

type EntityViewRegistration =
  | {
      type: 'page';
      title: string;
      path: string;
      page: AppComponentBuilder;
    }
  | {
      type: 'component';
      title: string;
      path: string;
      component: ComponentType<any>;
    };

export default class EntityViewBuilder extends AppComponentBuilder {
  private readonly registrations = new Array<EntityViewRegistration>();

  addPage(
    title: string,
    path: string,
    page: AppComponentBuilder,
  ): EntityViewBuilder {
    this.registrations.push({ type: 'page', title, path, page });
    return this;
  }

  addComponent(
    title: string,
    path: string,
    component: ComponentType<any>,
  ): EntityViewBuilder {
    this.registrations.push({ type: 'component', title, path, component });
    return this;
  }

  build(app: App): ComponentType<any> {
    const pages = this.registrations.map(registration => {
      switch (registration.type) {
        case 'page': {
          const { title, path, page } = registration;
          return { title, path, component: page.build(app) };
        }
        case 'component': {
          const { title, path, component } = registration;
          return { title, path, component };
        }
        default:
          throw new Error(`Unknown EntityViewBuilder registration`);
      }
    });

    return () => <EntityViewComponent pages={pages} />;
  }
}
