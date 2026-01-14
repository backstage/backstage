'use client';

import * as stories from '@backstage/ui/src/components/Header/Header.stories';

const {
  WithAllOptionsAndTabs: WithAllOptionsAndTabsStory,
  WithAllOptions: WithAllOptionsStory,
  WithBreadcrumbs: WithBreadcrumbsStory,
  WithHeaderPage: WithHeaderPageStory,
} = stories;

export const WithAllOptionsAndTabs = () => (
  <WithAllOptionsAndTabsStory.Component />
);
export const WithAllOptions = () => <WithAllOptionsStory.Component />;
export const WithBreadcrumbs = () => <WithBreadcrumbsStory.Component />;
export const WithHeaderPage = () => <WithHeaderPageStory.Component />;
