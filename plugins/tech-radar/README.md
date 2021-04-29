# @backstage/plugin-tech-radar

<img src="docs/screenshot.png" alt="Screenshot of Tech Radar plugin" />

The Backstage integration for the Tech Radar based on [Zalando's Tech Radar](https://opensource.zalando.com/tech-radar/) open sourced on [GitHub](https://github.com/zalando/tech-radar). This is used at [Spotify](https://spotify.github.io) for visualizing the official guidelines of different areas of software development such as languages, frameworks, infrastructure and processes.

Read the [blog post on backstage.io about the Tech Radar](https://backstage.io/blog/2020/05/14/tech-radar-plugin).

## Purpose

Zalando has a fantastic description [on their website](https://opensource.zalando.com/tech-radar/):

> The Tech Radar is a tool to inspire and support engineering teams at Zalando to pick the best technologies for new projects; it provides a platform to share knowledge and experience in technologies, to reflect on technology decisions and continuously evolve our technology landscape. Based on the pioneering work of ThoughtWorks, our Tech Radar sets out the changes in technologies that are interesting in software development — changes that we think our engineering teams should pay attention to and consider using in their projects.

It serves and scales well for teams and companies of all sizes that want to have alignment across dozens of technologies and visualize it in a simple way.

## Getting Started

The Tech Radar can be used in two ways:

- **Simple (Recommended)** - This gives you an out-of-the-box Tech Radar experience. It lives on the `/tech-radar` URL of your Backstage installation.
- **Advanced** - This gives you the React UI component directly. It enables you to insert the Radar on your own layout or page for a more customized feel.

### Install

For either simple or advanced installations, you'll need to add the dependency using Yarn:

```sh
cd packages/app
yarn add @backstage/plugin-tech-radar
```

### Configuration

Modify your app routes to include the Router component exported from the tech radar, for example:

```tsx
// in packages/app/src/App.tsx
import { TechRadarPage } from '@backstage/plugin-tech-radar';

const routes = (
  <FlatRoutes>
    {/* ... */}
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
```

If you'd like to configure it more, see the `TechRadarPageProps` and `TechRadarComponentProps` types for options:

```ts
export type TechRadarPageProps = TechRadarComponentProps & {
  title?: string;
  subtitle?: string;
  pageTitle?: string;
};

export interface TechRadarPageProps {
  width: number;
  height: number;
  getData?: () => Promise<TechRadarLoaderResponse>;
  svgProps?: object;
}
```

## Frequently Asked Questions

### Who created the Tech Radar?

[ThoughtWorks](https://thoughtworks.com/radar) created the Tech Radar concept, and [Zalando created the visualization](https://opensource.zalando.com/tech-radar/) that we use at Spotify and in this plugin.

### How do I load in my own data?

It's simple, you can pass through a `getData` prop which expects a `Promise<TechRadarLoaderResponse>` signature.

Here's an example:

```tsx
const getHardCodedData = () =>
  Promise.resolve({
    quadrants: [{ id: 'infrastructure', name: 'Infrastructure' }],
    rings: [{ id: 'use', name: 'USE', color: '#93c47d' }],
    entries: [
      {
        url: '#',
        key: 'github-actions',
        id: 'github-actions',
        title: 'GitHub Actions',
        quadrant: 'infrastructure',
        timeline: [
          {
            moved: 0,
            ringId: 'use',
            date: new Date('2020-08-06'),
            description:
              'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
          },
        ],
      },
    ],
  });

<TechRadarComponent width={1400} height={800} getData={getHardCodedData} />;
```

### How do I write tests?

You can use the `svgProps` option to pass custom React props to the `<svg>` element we create for the Tech Radar. This complements well with the `data-testid` attribute and the `@testing-library/react` library we use in Backstage.

```tsx
<TechRadarComponent
  width={1400}
  height={800}
  svgProps={{
    'data-testid': 'tech-radar-svg',
  }}
/>

// Then, in your tests...
// const { getByTestId } = render(...);
// expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
```
