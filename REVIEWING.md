# Introduction

This file provides pointers for reviewing pull requests. While the main audience are reviewers, this can also be useful if you are contributing to this repository.

## Code Style

See our code style documented at [STYLE.md](./STYLE.md).

In particular when it comes to naming, make sure that naming follows established conventions within the project and/or package.

When adding new dependencies to packages it is always preferred to use version ranges that are already in use by other packages in the repository. This helps minimize lockfile changes and reduce package duplication, both in our repository as well as other Backstage installations.

## Secure Coding Practices

Be sure to familiarize yourself with our [secure coding practices](./SECURITY.md#coding-practices).

## Release & Versioning Policy

When reviewing pull requests it's important to consider our [versioning policy and release cycle](https://backstage.io/docs/overview/versioning-policy). Generally the most important bit is our [package versioning policy](https://backstage.io/docs/overview/versioning-policy#package-versioning-policy), which describes when and how we can ship breaking changes. We'll dive into how to identify breaking changes in a different section.

One other thing to keep in mind, especially when merging pull requests, is where in the release cycle we're currently at. In particular you want to avoid merging any large or risky changes towards the end of each release cycle. If there is a change that is ready to be merged, but you want to hold off until the next main line release, then you can label it with the `merge-after-release` label.

## Changesets

We use changesets to track changes in all published packages. Changesets both define what should go into the changelog of each package, but also what kind of version bump should be done for the next release.
An introduction to changesets can be found in our [contribution guidelines](./CONTRIBUTING.md#creating-changesets).

When reviewing a changeset, the most important things to look for are the bump levels, i.e. `major` / `minor` / `patch`, as well as whether the content is accurate and if it's written in a way that makes sense when reading it in the changelog for each package.

### Reviewing Changeset Bump Levels

The following table provides a reference for what type of version bump is needed for each package. This is applied separately to each individual package, it does not matter what the scope of a change is in any other broader context.

| Scope           | Current Package Version | Bump Level |
| --------------- | ----------------------- | ---------- |
| Breaking Change | `1.0` and above         | `major`    |
| New Feature     | `1.0` and above         | `minor`    |
| Fix             | `1.0` and above         | `patch`    |
| Breaking Change | `0.x`                   | `minor`    |
| New Feature     | `0.x`                   | `patch`    |
| Fix             | `0.x`                   | `patch`    |

The only situation where a package that is currently at `0.x` can have a `major` bump is if all owners and stakeholders of the package agree that the package is ready to be released as `1.0`.

### Reviewing Changeset Content

Each changeset should be written in a way that describes the impact of the change for the users of each package. The contents of the changesets will end up in the changelog of each package, for example [@backstage/core-plugin-api](./packages/core-plugin-api/CHANGELOG.md). The changelogs are intended to provide both a summary of the new features as well as guidance in the case of breaking changes or deprecations.

Some things that changeset should NOT contain are:

- Internal architecture details - these are generally not interesting to users, focus on the impact towards users of the package instead.
- Information related to a different package.
- A large amount of content, consider for example a separate migration guide instead, either in the package README or [./docs/](./docs/), and then link to that instead.
- Documentation - changesets can describe new features, but it should not be relied on for documenting them. Documentation should either be placed in [TSDoc](https://tsdoc.org) comments, package README, or [./docs/](./docs/).

### When is a changeset needed?

In general our changeset feedback bot will take care of informing whether a changeset is needed or not, but there are some edge cases. Whether a changeset is needed depends mostly on what files have been changed, but sometimes also on the kind of change that has been made.

Changes that do NOT need a new changeset:

- Changes to any test, storybook, or other local development files, for example, `MyComponent.test.tsx`, `MyComponent.stories.tsx`, `**mocks**/MyMock.ts`, `.eslintrc.js`, `setupTests.ts`, or `api-report.md`. Explained differently, it is only files that affect the published package that need changesets, such as source files and additional resources like `package.json`, `README.md`, `config.d.ts`, etc.
- When tweaking a change that has not yet been released, you can rely on and potentially modify the existing changeset instead.
- Changes that do not belong to a published packages, either because it's not a package at all, such as `docs/`, or because the package is private, such as `packages/app`.
- Changes that do not end up having an effect on the published package, such as whitespace fixes or code formatting changes. Although it's also fine to have a short changeset for these kind of changes too.

### Changeset Example

Consider the following scenario for a changeset:

A new `EntityList` component has been added to `plugins/catalog-react`.

Below are examples of a good and three bad changesets for that change.

**GOOD**

```md
---
'@backstage/plugin-catalog-react': minor
---

Added a new `EntityList` component that can be used to display detailed information about a list of entities.
```

The `@backstage/plugin-catalog-react` package has reached version `1.x`, which means that feature additions that aren't breaking should be a `minor` change. We don't bother with too much documentation, keeping it short and sweet. The main purpose is to inform users that this new component exists and to give them an idea of how they can use it.

**BAD**

```md
---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Added `EntityList` component.

Fixed a bug in the catalog index page.
```

This changeset is too short, it's best to give users an idea of how they can benefit from the new addition.

It also includes changes affecting both the Catalog and Catalog React library. It should be split into two separate changesets for each of the two packages, otherwise we'll end up with redundant and unrelated information in both changelogs.

**BAD**

```md
---
'@backstage/plugin-catalog-react': major
---

Added a new `EntityList` component that can be used to display detailed information about a list of entities. The component looks like this:

![EntityList screenshot](./docs/assets/headline.png)

It accepts the following properties:

- entities - The entities that should be listed.
- title - An optional formatting function for the list titles.
- dialog - An optional component that overrides the default details dialog.
```

This changeset is getting too detailed. It's not always bad to get this much into the weeds, but keep in mind that changesets are not easy to browse when searching for information about specific APIs. It's better to document things like this separately and keep the changeset more lean. Also avoid linking to assets in changesets, keep them text-only.

The change is also marked as a breaking `major` change. This should be changed to `minor` since adding new APIs is never a breaking change.

**BAD**

```md
---
'@backstage/plugin-catalog-react': patch
---

Added a new `EntityList` component that can be used to display detailed information about a list of entities. The `ListView` component was also refactored in order to make it possible to reuse it between the new `EntityList` and `KindList` components.
```

Assuming that the `ListView` component is not public API, this changeset goes into details that are not interesting to the user of the package. Internal changes do not need to be highlighted in changesets. If an internal refactor is the only change then it's alright to say something short like "Internal refactor to improve code reuse", but otherwise those details should be left out.

The `@backstage/plugin-catalog-react` package has also reached `1.x`, which means that new features should be introduced through a `minor` bump. We'd only use `patch` bumps for minor changes or fixes that do not affect the public API.

## Breaking Changes

Identifying breaking changes can be quite tricky. You need to look at the changes from both the point of view of consumers and producers of APIs, as well as behavioral changes. In this section we explore a couple of methods for identifying whether a change is breaking or not.

### Behavioral Changes

These are changes where the behavior of the code changes, but the public API is unchanged or doesn't have any breaking changes. They can be anything from tiny tweaks, like adding a bit of padding to a visual element, to a complete redesign and refactor of an entire plugin.

It's hard to set up exact rules for when a behavioral change is breaking or not. In some cases it's obvious, for example if you remove important functionality of a system, while in other cases it can be very hard to tell. In the end what's important is whether a significant number of users of the package will be negatively impacted by the change. One question that you can ask yourself here is "is it likely that there are users that don't want the new behavior, or will need to change their code to adapt to the new behavior?" If the answer is yes, then it's likely a breaking change. You do also want to keep [xkcd.com/1172](https://xkcd.com/1172/) in mind though.

Note that even a bug fix can be considered a breaking change in some situations. One thing to lean on in that case is what the _documented_ behavior is. If the current behavior does not match the documented behavior, then a change to match the documentation is generally not a breaking change. That is unless it is likely that there are a significant number of users that will be impacted by the change.

For tricky behavioral changes you may simply need to let end users provide feedback. This can be done either by hiding the new behavior behind an experimental feature switch, or by releasing the change early on in the release cycle, preferably in the first or second `next`-line release. Be ready to respond to feedback and potentially revert the change if needed.

### Public API Changes

Typescript is a huge help when it comes to identifying breaking changes, as well as the API Reports that we generate for all packages. Most of the time it is enough to only look at the API Reports to determine whether a change is breaking or not. If you determine that a change is breaking at the TypeScript level, then it is a breaking change.

In this section we will be talking about changed "types", but by that we mean any kind of exported symbol from packages, such as TypeScript types aliases or interfaces, functions, classes, constants, etc.

#### API Reports

We generate API Reports using the [API Extractor](https://api-extractor.com/) tool. These reports are generated for most packages in the Backstage repository, and are stored in the `api-report.md` file of each package. For CLI package we use custom tooling, and instead store the result in `cli-report.md`. Whenever the public API of a package changes, the API Report needs to be updated to reflect the new state of the API. Our CI checks will fail if the API reports are not up to date in a pull request.

Each API report contains a list of all the exported types of each package. As long as the API report does not have any warnings it will contain the full publicly facing API of the package, meaning you do not need to consider any other changes to the package from the point of view of TypeScript API stability.

Exported types can be marked with either `@public`, `@alpha` or `@beta` release tags. It is only the `@public` exports that we consider to be part of the stable API. The `@alpha` and `@beta` exports are considered unstable and can be changed at any time without needing a breaking package versions bump. However, this **ONLY** applies if the package has been configured to use experimental type builds, which looks like this in `package.json`:

```json
  "build": "backstage-cli package build --experimental-type-build"
```

If a package does not have this configuration, then all exported types are considered stable, even if they are marked as `@alpha` or `@beta`.

#### Changes that are Not Considered Breaking

There are a few exceptions that are not considered breaking in the [versioning policy](https://backstage.io/docs/overview/versioning-policy#changes-that-are-not-considered-breaking),
primarily regarding Utility APIs and Backend Service interfaces (referred to "contracts" below) that are supplied by the
Backstage core packages.

Example of a non-breaking change to a contract which has a default
implementation, since consumers typically only interact with that contract as
callers of existing methods:

```diff
 export interface MyService {
   oldMethod(): void;
+  newMethod(): void;
 }
```

Changes such as these must still be marked with `**BREAKING PRODUCERS**:` in the
changelog, to highlight them for those who might be implementing custom
implementations of those contracts or putting mocks of the contract in tests.

Example of a breaking change to a contract, which affects existing consumers and
therefore makes it NOT fall under these exceptions:

```diff
 export interface MyService {
-   oldMethod(): void;
+   oldMethod(): Promise<void>;
 }
```

#### Type Contract Direction

An important distinction to make when looking at changes to an API Report is the direction of the contract of a changed type, that is, whether it's used as input or output from the user's point of view. In the next two sections we'll dive into the different directions of a type contract, and how it affects whether a change is breaking or not.

#### Input Types

An input type is one where a value needs to be provided by users of the package. The most common form of input type are function, constructor, and method parameters.

The following is an example where `MyComponentProps` is an input type:

```ts
type MyComponentProps = {
  title: string;
  size?: 'small' | 'medium' | 'large';
};

function MyComponent(props: MyComponentProps): JSX.Element;
```

And from the package user's point of view it would look something like this:

```tsx
<MyComponent title="Hello World" size="medium" />
```

When modifying an input type, any change that increases constraints are breaking. For example, if we made the `size` prop required, that would be a breaking change. Likewise, if we changed the type of `size` to `'small' | 'large'`, that would also be breaking.

On the other hand, it's fine to relax constraints without it being a breaking change. For example, if we made the `title` prop optional, that would not be breaking. Likewise, if we changed the type of `size` to `'small' | 'medium' | 'large' | 'huge'`, that would not be breaking either. It is also possible to add new properties without it being a breaking change, as long as they are optional.

There's an edge-case where completely removing a property is also considered a breaking change. That's because of TypeScript being strict and refusing unknown properties, rather than a runtime breaking change. It is typically an easy thing for consumers to fix though.

Another way to think about the rules for evolving input types is that the old type must be assignable to the new type. In this case for example `_props: NewComponentProps = {} as OldComponentProps`. It's not a silver bullet though, because of edge-cases like the one mentioned above.

#### Output Types

An output type is one that the user receives from the packages. One of the most obvious examples here are the top-level exports from the package itself, but it also includes for example function return types.

The following is an example where both `useBox` and `Box` are output types:

```ts
type Box = {
  title: string;
  shape?: 'square' | 'rounded';
};

function useBox(): Box;
```

And from the consumer's point of view it would look something like this:

```ts
const { title, shape } = useBox();
```

When modifying an output type, any change that reduces constraints are breaking. For example, if we made the `title` property optional, that would be a breaking change, or if we changed the type of `shape` to `'square' | 'rounded' | 'octagon'`.

Adding new properties is not a breaking change, regardless of whether they are optional or not. Removing properties is on the other hand always breaking.

It is generally fine to increase constraints without it being a breaking change. For example, if we made the `shape` property required, that would not be breaking.

There are some edge-cases though, for example if `shape` was changed to just `'square'`, that would be a breaking change because consumers might be checking for `box.shape === 'rounded'`, which would then be breaking. It's typically a quite easy thing for consumers to fix though. More generally, type unions and discriminated unions are quite troublesome in output types, as both adding and removing types from them are considered breaking changes.

Another way to think about the rules for evolving output types is that the new type must be assignable to the old type. In this case for example `_box: OldBox = {} as NewBox`. It's not a silver bullet though, because of edge-cases like the one mentioned above.

#### I/O Types

Some types are considered both input and output types. For example, consider the following example:

```ts
type Point = {
  x: number;
  y: number;
};

function trimCoords(point: Point): Point;
```

In this case `Point` is both an input and output type. This means that the only changes we can make to the type that aren't breaking are the intersection of allowed changes between input and output types. In practice this only allows for the addition of new optional properties. Because of this constraint it is generally best to avoid using I/O types, and keep the input separated from the output.

There are some cases where I/O types favor either input or output when it comes to API stability. For example, all types used by Utility APIs are I/O types, but the stability of the output is a lot more important than the stability of the input. That is because it's a lot easier for the single producer of the input interface to adapt to changes compared to all consumers of the API that use it as an output type.

#### Identifying the Contract Direction

The only way to identify the contract direction of a type is to look at the context in which it's being used. In particular this can be tricky when looking at individual type aliases and interfaces, as you need to look at the rest of the package exports to see how the type is being used.

One important rule is that the context considered for any type is limited to only the package in which the type is declared. Just because a type is imported in a different package and used as an input type does not make it an input type.

The following rules can be used to identify the direction of a type alias or interface:

- If the type is used in an input context, for example function parameter, then it's an input type.
- If the type is used in an output context, for example function return type, then it's an output type.
- If the type is referenced by another type, then it inherits the direction of that type, except if referenced through a function callback, in which case the direction is reversed.
- If the type is used or inherits both input and output contexts, then it's an I/O type.
- If the type is not referenced anywhere else, then it's an I/O type.

Below is an example of the public API of a package, with type directions assigned to each export:

```ts
// I/O, used by getPoint as return type and referenced by BoxProps, an input type
interface Point {
  x: number;
  y: number;
}

// Output, since it's an exported function
function getPoint(): Point;

// Input, used by Box as parameter type
interface BoxProps {
  point?: Point
}

// Output, since it's an exported function
function Box(props: BoxProps): JSX.Element;

// Output, used by createWidget as return type
interface Widget {
  ...
}

// Output, as it's referenced by WidgetOptions, which is an input
// type, but the render callback causes a direction reversal
interface WidgetProps {
  ...
}

// Input, just like WidgetProps this is due to the direction reversal
// caused by the render callback
type RenderedWidget = JSX.Element | null;

// Input, used by createWidget parameter type
interface WidgetOptions {
  render(props: WidgetProps): RenderedWidget;
}

// Output, since it's an exported function
function createWidget(options: WidgetOptions): Widget;

// I/O, since it's not referenced anywhere else
type LabelStyle = 'normal' | 'thin';

// Output, since it's an exported constant
const LABEL_SIZE: number;
```
