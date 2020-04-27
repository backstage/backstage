# @backstage/plugin-tech-radar

<img src="docs/screenshot.png" width="700" alt="Screenshot of Tech Radar plugin" />

The Backstage integration for the Tech Radar based on [Zalando's Tech Radar](https://opensource.zalando.com/tech-radar/) open sourced on [GitHub](https://github.com/zalando/tech-radar). This is used at [Spotify](https://spotify.github.io) for visualizing the official guidelines of different areas of software development such as languages, frameworks, infrastructure and processes.

## Purpose

Zalando explains it very well on their website:

> The Tech Radar is a tool to inspire and support engineering teams at Zalando to pick the best technologies for new projects; it provides a platform to share knowledge and experience in technologies, to reflect on technology decisions and continuously evolve our technology landscape. Based on the pioneering work of ThoughtWorks, our Tech Radar sets out the changes in technologies that are interesting in software development — changes that we think our engineering teams should pay attention to and consider using in their projects.

It serves well for teams and companies of all sizes that want to have alignment and wish to visualize it. It scales well for companies who have dozens of different technologies in place.

## Getting Started

In your installation, add the dependency to your Backstage installation:

```sh
yarn add @backstage/plugin-tech-radar
```

In your `apis.ts` set up the "out of the box" implementation for Tech Radar:

```ts
import { ApiHolder, ApiRegistry } from '@backstage/core';
import {
  techRadarApiRef,
  TechRadar,
  loadSampleData,
} from '@backstage/plugin-tech-radar';

const builder = ApiRegistry.builder();

builder.add(techRadarApiRef, new TechRadar(1400, 800, loadSampleData));

export default builder.build() as ApiHolder;
```

It will then be available on your Backstage installation over at <http://localhost:3000/tech-radar>

## Configuration

The implementation for the TechRadar class is:

```ts
export interface TechRadarAdditionalOptions {
  title?: string;
  subtitle?: string;
  svgProps?: object;
}

export interface TechRadarLoaderResponse {
  quadrants: RadarQuadrant[];
  rings: RadarRing[];
  entries: RadarEntry[];
}

export interface TechRadarApi {
  width: number;
  height: number;
  load: () => Promise<TechRadarLoaderResponse>;
  additionalOpts: TechRadarAdditionalOptions;
}

// Constructor signature for the `TechRadar` class
// constructor(
//   public width: number,
//   public height: number,
//   public load: () => Promise<TechRadarLoaderResponse>,
//   public additionalOpts: TechRadarAdditionalOptions = {},
// )
```

The source code is available in [api.ts](src/api.ts).

## Code Samples

### Set up Tech Radar with sample data

See example above.

### Set up Tech Radar with hard-coded values

```ts
const hardCodedData = () =>
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

builder.add(techRadarApiRef, new TechRadar(1400, 800, hardCodedData));
```

### Set up Tech Radar with an API call

```ts
const apiRetrievedData = async () => {
  const response = await fetch('http://example.com/tech-radar-values.json');
  const json = await response.json();
  return json as TechRadarLoaderResponse;
};

builder.add(techRadarApiRef, new TechRadar(1400, 800, apiRetrievedData));
```

### Use a custom title and subtitle

```ts
builder.add(
  techRadarApiRef,
  new TechRadar(1400, 800, loadSampleData, {
    title: 'My Company Tech Radar',
    subtitle: 'Learn about what technologies we use at My Company.',
  }),
);
```

### Use custom props

Great for testing through adding a `data-testid` for being able to test with `@testing-library/react`

```ts
builder.add(
  techRadarApiRef,
  new TechRadar(1400, 800, loadSampleData, {
    svgProps: {
      // for the main <svg> tag of the visualization
      'data-testid': 'tech-radar-svg',
    },
  }),
);

// Then, in your tests...
// const { getByTestId } = render(...);
// expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
```
