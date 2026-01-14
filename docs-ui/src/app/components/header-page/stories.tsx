'use client';

import * as stories from '@backstage/ui/src/components/HeaderPage/HeaderPage.stories';

const {
  WithEverything: WithEverythingStory,
  WithLongBreadcrumbs: WithLongBreadcrumbsStory,
  WithTabs: WithTabsStory,
  WithCustomActions: WithCustomActionsStory,
  WithMenuItems: WithMenuItemsStory,
} = stories;

export const WithEverything = () => <WithEverythingStory.Component />;
export const WithLongBreadcrumbs = () => <WithLongBreadcrumbsStory.Component />;
export const WithTabs = () => <WithTabsStory.Component />;
export const WithCustomActions = () => <WithCustomActionsStory.Component />;
export const WithMenuItems = () => <WithMenuItemsStory.Component />;
