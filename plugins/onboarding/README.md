# Onboarding

Welcome to the onboarding plugin!

_This plugin was created through the Backstage CLI_

## Goal

To automate the processes of onboarding by which new hires are integrated into the organization. It includes activities that allow new employees to complete an initial new-hire orientation process, as well as learn about the organization and its structure, culture, vision, mission, and values. By automating this onboarding process, organizations can reduce administrative tasks, improve efficiency, and provide new employees with a better experience. This can help to improve retention rates and reduce the time and resources needed for onboarding, ultimately leading to cost savings for the company.

## Features

1. Easy to onboard new and existing members.
2. All the prerequisites are available in one place.
3. Track the status of the onboarding procedure.
4. Easy to manage checklist.
5. Reminder for pending checklist every time member visits the application by opening a popup.
6. The user has the freedom to skip the onboarding at the moment.
7. Organized and optimized data flow.
8. Better performance with user-friendly UI.

## Setup

The following sections will help you set up the onboarding plugin.

1. Install the plugin by running this command.

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-onboarding
```

## Create a route for the plugin

1. Import the Onboarding from `@backstage/plugin-onboarding`.
2. You can then provide a route to `Onboarding` in the backstage front end.

```tsx
import { Onboarding } from '@backstage/plugin-onboarding';
<Route path="/Onboarding" element={<Onboarding />} />;
```

## Add Onboarding react component

1. Import the Onboarding React component from `@backstage/plugin-onboarding`.
2. You can then use the provided React component `Onboarding` in the backstage front end where ever you want.

```tsx
import { Onboarding } from `@backstage/plugin-onboarding`;
// ...
<Grid item xs={12} md={4}>
  <Onboarding />
</Grid>;
// ...
```

## Dependencies

> Material-ui

## Getting started

Your plugin has been added to the onboarding app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/onboarding](http://localhost:3000/onboarding).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
