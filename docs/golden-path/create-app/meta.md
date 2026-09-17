<!-- THIS FILE IS NOT INTENDED TO BE DISPLAYED ON THE DOCSITE -->

# Glossary

- Page: A single `md` file.
- Guide: A number of pages grouped under the same folder.

# Overall Writing Guidelines

The goal of these docs is to provide a comprehensive set of guides that any user can use to quickly get set up with a Backstage instance locally. Users should be assumed to have minimal knowledge of the Backstage ecosystem and may not even have the right tools installed (NodeJS, yarn, Docker, etc). This guide will be the first place we point them to, to get started and they should feel ready to take on the world after completing the entire golden path.

When writing guide pages, keep it light! These should be instructional docs, and at the same time conversational and a joy to read. Guides should build on each other, when reading through a progression, the reader should feel more comfortable and confident with concepts as they pop up across progression levels. Guides should be standalone but can link across.

# Sections

## Prerequisites

How to setup all of the dependencies. Installing NodeJS, versioning with nvm, installing brew and git. No stone to be left unturned, if it's a dependency of the project that gets used in the project output by the `create-app` script, it should be listed here with installation steps.

Some installation cases may be too complex to handle, like a bare bones VM or an air-gapped environment. This guide should generally focus on the primary developer environments, like Windows and Mac with an eye towards adding sections as demand grows for other technologies.

## `create-app`

How to run `create-app` and what the output means.

## Poking around your new application

How to login, how to navigate in the application.

### Common catalog use cases

### Common search use cases

### Common scaffolder use cases

## Development cycles

Hot reloading, webpack-dev-server, sqlite. What does the developer experience look like for local dev?

## Adding a frontend plugin

Walk through how to add a plugin, where it goes in the app, and what the additions in the lockfile mean.

## Adding a backend plugin

Walk through how to add a plugin to the backend, where it goes in the backend and what functionality is being added.

## Customizing the theme of your application

How to customize your application to match your organization's design system.

## Keeping Your Instance Up to Date

### New Backstage Releases

The main Backstage repository releases a new version every month with pre-release versions weekly. It is generally recommended to upgrade when the new release comes out every month.

Talk about the yarn plugin as an easier method here.

### Automatic Dependency Bumps

Backstage relies on a mountain of open source dependencies that make it as great as it is. As part of owning a deployed service, you also own the security posture - please make sure that you are observing best practices by bumping your dependencies through something like Dependabot or Renovate.
