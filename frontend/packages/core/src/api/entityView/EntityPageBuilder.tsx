import React, { ComponentType } from 'react';
import DefaultEntityPage from '../../components/DefaultEntityPage';
import { App, AppComponentBuilder } from '../app/types';
import BackstagePlugin from '../plugin/Plugin';
import { EntityPageNavItem, EntityPageView } from './types';
import { IconComponent } from '../../icons';

// type AppComponents = {
//   EntityPage: ComponentType<EntityPageProps>;
//   EntityPageNavbar: ComponentType<EntityPageNavbarProps>;
//   EntityPageHeader: ComponentType<EntityPageHeaderProps>;
// };

type EntityPageRegistration =
  | {
      type: 'page';
      title: string;
      icon: IconComponent;
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
      icon: IconComponent;
      path: string;
      component: ComponentType<any>;
    };

export default class EntityPageBuilder extends AppComponentBuilder {
  private readonly registrations = new Array<EntityPageRegistration>();

  addPage(
    title: string,
    icon: IconComponent,
    path: string,
    page: AppComponentBuilder,
  ): EntityPageBuilder {
    this.registrations.push({ type: 'page', title, icon, path, page });
    return this;
  }

  addComponent(
    title: string,
    icon: IconComponent,
    path: string,
    component: ComponentType<any>,
  ): EntityPageBuilder {
    this.registrations.push({
      type: 'component',
      title,
      icon,
      path,
      component,
    });
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
          const { title, icon, path, page } = reg;
          navItems.push({ title, icon, target: path });
          views.push({ path, component: page.build(app) });
          break;
        }
        case 'component': {
          const { title, icon, path, component } = reg;
          navItems.push({ title, icon, target: path });
          views.push({ path, component });
          break;
        }
        case 'plugin': {
          let added = false;
          for (const output of reg.plugin.output()) {
            switch (output.type) {
              case 'entity-page-nav-item':
                const { title, icon, target } = output;
                navItems.push({ title, icon, target });
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
