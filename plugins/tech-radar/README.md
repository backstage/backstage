# @backstage/plugin-tech-radar

<img src="docs/screenshot.png" alt="Screenshot of Tech Radar plugin" />

The Backstage integration for the Tech Radar based on [Zalando's Tech Radar](https://opensource.zalando.com/tech-radar/) open sourced on [GitHub](https://github.com/zalando/tech-radar). This is used at [Spotify](https://spotify.github.io) for visualizing the official guidelines of different areas of software development such as languages, frameworks, infrastructure and processes.

## Purpose

Zalando has a fantastic description [on their website](https://opensource.zalando.com/tech-radar/):

> The Tech Radar is a tool to inspire and support engineering teams at Zalando to pick the best technologies for new projects; it provides a platform to share knowledge and experience in technologies, to reflect on technology decisions and continuously evolve our technology landscape. Based on the pioneering work of ThoughtWorks, our Tech Radar sets out the changes in technologies that are interesting in software development — changes that we think our engineering teams should pay attention to and consider using in their projects.

It serves and scales well for teams and companies of all sizes that want to have alignment across dozens of technologies and visualize it in a simple way.

## Getting Started

The Tech Radar can be used in two ways:

- **Simple (Recommended)** - This gives you an out-of-the-box Tech Radar experience. It lives on the `/tech-radar` URL of your Backstage installation, and you can set a variety of configuration directly in your `apis.ts`.
- **Advanced** - This gives you the React UI component directly. It enables you to insert the Radar on your own layout or page for a more customized feel.

### Install

For either simple or advanced installations, you'll need to add the dependency using Yarn:

```sh
yarn add @backstage/plugin-tech-radar
```

### Simple Configuration

In your `apis.ts` set up the simple "out of the box" implementation for Tech Radar:

```ts
import { ApiHolder, ApiRegistry } from '@backstage/core';
import {
  techRadarApiRef,
  TechRadar,
} from '@backstage/plugin-tech-radar';

const builder = ApiRegistry.builder();

builder.add(techRadarApiRef, new TechRadar({
  width: 1400,
  height: 800
));

export default builder.build() as ApiHolder;
```

Congrats, you're done! We'll just load it with [example data](src/sampleData.ts) to get you started. Just go to <http://localhost:3000/tech-radar> to see it live in action.

And if you'd like to configure it more, such as providing it with your own data, see the `TechRadarApi` TypeScript interface below for the options:

```ts
export interface TechRadarComponentProps {
  width: number;
  height: number;
  getData?: () => Promise<TechRadarLoaderResponse>;
  svgProps?: object;
}

export interface TechRadarApi extends TechRadarComponentProps {
  title?: string;
  subtitle?: string;
}
```

You can see the API directly over at [src/api.ts](./src/api.ts).

### Advanced Configuration

This way won't expose an `/tech-radar` path. Instead, you'll need to create your own Backstage plugin and use the Tech Radar as any other React UI component.

In your Backstage app, run the following command:

```sh
yarn create-plugin
```

In your plugin, in any React component you'd like to import the Tech Radar, do the following:

```tsx
import { TechRadarComponent } from '@backstage/plugin-tech-radar';

function MyCustomRadar() {
  return <TechRadarComponent width={1400} height={800} />;
}
```

If you'd like to configure it more, see the `TechRadarComponentProps` TypeScript interface for options:

```ts
export interface TechRadarComponentProps {
  width: number;
  height: number;
  getData?: () => Promise<TechRadarLoaderResponse>;
  svgProps?: object;
}
```

You can see the API directly over at [src/api.ts](./src/api.ts).

## Frequently Asked Questions

### Who created the Tech Radar?

[ThoughtWorks](https://thoughtworks.com/radar) created the Tech Radar concept, and [Zalando created the visualization](https://opensource.zalando.com/tech-radar/) that we use at Spotify and in this plugin.

### How do I load in my own data?

It's simple. In both the Simple (Backstage plugin) and Advanced (React component) configurations, you can pass through a `getData` prop which expects a `Promise<TechRadarLoaderResponse>` signature. See more in [src/api.ts](./src/api.ts).

Here's an example:

```tsx
const getHardCodedData = () =>
  Promise.resolve({
    quadrants: [{ id: 'infrastructure', name: 'Infrastructure' }],
    rings: [{ id: 'use', name: 'USE', color: '#93c47d' }],
    entries: [
      {
        moved: 0,
        ring: 'use',
        url: '#',
        key: 'github-actions',
        id: 'github-actions',
        title: 'GitHub Actions',
        quadrant: 'infrastructure',
      },
    ],
  });

// Simple
builder.add(techRadarApiRef, new TechRadar({
  width: 1400,
  height: 800,
  getData: getHardCodedData
));

// Advanced
<TechRadarComponent width={1400} height={800} getData={getHardCodedData} />
```

### How do I write tests?

You can use the `svgProps` option to pass custom React props to the `<svg>` element we create for the Tech Radar. This complements well with the `data-testid` attribute and the `@testing-library/react` library we use in Backstage.

```ts
// Simple
builder.add(
  techRadarApiRef,
  new TechRadar({
    width: 1400,
    height: 800,
    svgProps: {
      'data-testid': 'tech-radar-svg',
    },
  }),
);

// Advanced
<TechRadarComponent
  width={1400}
  height={800}
  svgProps={{
    'data-testid': 'tech-radar-svg',
  }}
/>;

// Then, in your tests...
// const { getByTestId } = render(...);
// expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
```
