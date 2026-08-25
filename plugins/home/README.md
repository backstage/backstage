# Home

The Home plugin introduces a system for composing a Home Page for Backstage in order to surface relevant info and provide convenient shortcuts for common tasks. It's designed with composability in mind with an open ecosystem that allows anyone to contribute with any component, to be included in any Home Page.

For App Integrators, the system is designed to be composable to give total freedom in designing a Home Page that suits the needs of the organization. From the perspective of a Component Developer who wishes to contribute with building blocks to be included in Home Pages, there's a convenient interface for bundling the different parts and exporting them with both error boundary and lazy loading handled under the surface.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-home
```

Once installed, the plugin is automatically available in your app through the default feature discovery. For more details and alternative installation methods, see [installing plugins](https://backstage.io/docs/frontend-system/building-apps/installing-plugins).

The plugin will automatically provide:

- A homepage at `/home` with customizable widget grid
- A "Home" navigation item in the sidebar

## Documentation

For full setup instructions, available widgets, configuration options, and how to create custom widgets and layouts, see the [Homepage documentation](https://backstage.io/docs/getting-started/homepage).

## Contributing

### Homepage Components

We believe that people have great ideas for what makes a useful Home Page, and we want to make it easy for everyone to benefit from the effort you put in to create something cool for the Home Page. Therefore, a great way of contributing is by simply creating more Home Page Components that can then be used by everyone when composing their own Home Page. If they are tightly coupled to an existing plugin, it is recommended to allow them to live within that plugin, for convenience and to limit complex dependencies. On the other hand, if there's no clear plugin that the component is based on, it's also fine to contribute them into the [home plugin](/plugins/home/src/homePageComponents)

Additionally, the API is at a very early state, so contributing additional use cases may expose weaknesses in the current solution that we may iterate on to provide more flexibility and ease of use for those who wish to develop components for the Home Page.

### Homepage Templates

We are hoping that we together can build up a collection of Homepage templates. We therefore put together a place where we can collect all the templates for the Home Plugin in the [storybook](https://backstage.io/storybook/?path=/story/plugins-home-templates).
If you would like to contribute with a template, start by taking a look at the [DefaultTemplate storybook example](/packages/app-legacy/src/components/home/templates/DefaultTemplate.stories.tsx) or [CustomizableTemplate storybook example](/packages/app-legacy/src/components/home/templates/CustomizableTemplate.stories.tsx) to create your own, and then open a PR with your suggestion.

## Old Frontend System

For setup and usage with the old frontend system, see the [old frontend system homepage guide](https://backstage.io/docs/getting-started/homepage--old).
