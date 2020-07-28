import { ExtensionPoint, RouteRef } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';

type TabExtension = (
  entity?: Entity,
) =>
  | {
      id: string;
      label: string;
      route: RouteRef;
      isActive?: (currentLocation: string) => boolean;
    }
  | undefined;

type SubrouteExtension = (
  entity?: Entity,
) => { route: RouteRef; component: React.ComponentType } | undefined;

export const tabsExtensionPoint = new ExtensionPoint<TabExtension>(
  'catalog/entity-tabs',
);
export const subrouteExtensionPoint = new ExtensionPoint<SubrouteExtension>(
  'catalog/entity-subroutes',
);

type OverviewCardExtension = (
  entity?: Entity,
) => { component: React.ComponentType } | undefined;

export const overviewCardExtensionPoint = new ExtensionPoint<
  OverviewCardExtension
>('catalog/entity-overview-card');
