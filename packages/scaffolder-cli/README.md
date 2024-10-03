# @scaffolder/cli

This package provides a CLI for generating projects locally.

## Installation

Install the package via Yarn:

```sh
yarn add @scaffolder/cli
```

## Pre-requisites

The cli assumes a standard template directory structure containing a `template.yaml` file
as well as a `skeleton` folder, like this

```
my-software-template/
├── template.yaml
├── skeleton/
└── dry-run-data.json
```

In order to use the cli, you should add a `dry-run-data.json` file to the template directory. This file should contain the
data that will be used to render the template. The data should be in JSON format and should be an object with the
keys being the variable names used in the template and the values being the values that will be used to replace the
variables in the template. For example:

```json
{
  "name": "my-software",
  "description": "This is a description of my software"
}
```

## Usage

To run the cli you first have to have your `scaffolder-backend` running.

```bash
yarn install
yarn tsc
yarn build:backend
yarn start-backend
```

You can then open a new terminal and run:

```
scaffolder-cli generate path/to/directory/with/template
```

This will generate a new project inside a `dry-run-output` folder inside the template directory.
You can then `cd` into the `/dry-run-output` folder and try building and testing your project.

To try out the command locally, you can execute the following from the parent directory of this repo:

```bash
./backstage/packages/cli/bin/scaffolder-cli generate path/to/directory/with/template
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
