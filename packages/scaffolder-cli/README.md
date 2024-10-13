# @scaffolder/cli

This package provides a CLI for generating projects locally.

## Installation

Install the package via Yarn:

```sh
yarn add @scaffolder/cli
```

## Pre-requisites

By default, the cli assumes a standard template directory structure containing a `template.yaml` file
as well as a `skeleton` folder, like this

```
my-software-template/
├── template.yaml
├── skeleton/
```

## Usage

To run the cli you first have to have your `scaffolder-backend` running. This is because the
cli needs to communicate with the scaffolder api to generate the project.

Either use the example backend and run it locally,

```bash
yarn install
yarn tsc
yarn build:backend
yarn start-backend
```

or run toward another backstage instance by specifying the `--url` option.

If you are using the example backend, you can skip auth. But if you are running your own backend,
you will need to provide a token. Do so by setting a `BACKSTAGE_TOKEN` environment variable which will be used if present.

```
export BACKSTAGE_TOKEN=<your-token>
```

You can then open a new terminal and run:

```
scaffolder-cli generate path/to/directory/with/template --values '{"key1": value1, "key2": "value2"}'
```

where the values should be in JSON format with the keys being the variable names
used in the template and the values being the values to be rendered.

If you have a lot of values, it can be easier to put these values into a yaml file instead, like this

```

key1: value1
key2: value2

```

and store it in your directory

```

my-software-template/
├── template.yaml
├── skeleton/
├── dry-run-data.yaml

```

for future usage.

Then call the cli with the file path as the values argument

```

scaffolder-cli generate path/to/directory/with/template --values path/to/directory/with/template/dry-run-data.yaml

```

The output of the command should be a message that the project has been generated successfully, as such:

```

Project generated successfully in path/to/directory/with/template/dry-run-output

```

You can then `cd` into the `/dry-run-output` folder and try building and testing your project.

To try out the command locally, you can execute the following from the parent directory of this repo:

```bash
./backstage/packages/cli/bin/scaffolder-cli generate path/to/directory/with/template
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
