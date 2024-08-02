---
id: database
title: Database
description: How to set up PostgreSQL for your Backstage instance.
---

Audience: Admins

### Summary

This guide walks through how to set up a PostgreSQL database to host your Backstage data. It assumes you've already have a scaffolded Backstage app from following the [Standalone Install](../index.md) guide.

By the end of this tutorial, you will have a working PostgreSQL database hooked up to your Backstage install.

### Prerequisites

This guide assumes a basic understanding of working on a Linux based operating system and have some experience with the terminal, specifically, these commands: `apt-get`, `psql`, `yarn`.

- Access to a Linux-based operating system, such as Linux, MacOS or
  [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)
- An account with elevated rights to install prerequisites on your operating
  system
- If the database is not hosted on the same server as the Backstage app, the
  PostgreSQL port needs to be accessible (the default is `5432` or `5433`)

### 1. Install and configure PostgreSQL

:::tip Already configured your database?

If you've already installed PostgreSQL and created a schema and user, you can skip to [Step 2](#2-configuring-backstage-pg-client).

:::

Let's install PostgreSQL and get it set up for our Backstage app. First, we'll need to actually install the SQL server.

:::caution

The command below is for Linux. If you're not on Linux or having issues with package managers, check out [how to install PostgreSQL](https://www.postgresql.org/download/) to help you get sorted.

:::

```shell
sudo apt-get install postgresql
```

To test if your database is working:

```shell
sudo -u postgres psql
```

You should see a very welcoming message, like:

```shell
psql (12.9 (Ubuntu 12.9-0ubuntu0.20.04.1))
Type "help" for help.

postgres=#
```

For this tutorial we're going to use the existing postgres user. The next step is to set the password for this user. You'll want to replace the `<secret>` with a real password in the command below. Keep note of the password you choose here, you'll need it later.

```shell
postgres=# ALTER USER postgres PASSWORD '<secret>';
```

That's enough database administration to get started. Type `\q`, followed by
pressing the enter key. Then again type `exit` and press enter. Next, you need
to install and configure the client.

### 2. Configuring Backstage `pg` Client

Go to the root directory of your freshly installed Backstage
App. Run the following to install the PostgreSQL client into your backend:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add pg
```

Use your favorite editor to open `app-config.yaml` and add your PostgreSQL
configuration in the root directory of your Backstage app using the credentials from the previous steps.

```yaml title="app-config.yaml"
backend:
  database:
    # highlight-remove-start
    client: better-sqlite3
    connection: ':memory:'
    # highlight-remove-end
    # highlight-add-start
    # config options: https://node-postgres.com/apis/client
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
    # highlight-add-end
```

The `${...}` syntax denotes environment variables, specifically,

1. `POSTGRES_HOST` - The URL/IP to access your PostgreSQL database at. If you've installed PostgreSQL locally, this will likely be 127.0.0.1.
2. `POSTGRES_PORT` - The port to access your PostgreSQL database on. If you've installed PostgreSQL locally, this will be `5432` or `5433`.
3. `POSTGRES_USER` - The user from the SQL command above, `postgres`.
4. `POSTGRES_PASSWORD` - The password you set in the SQL command above.

When filling these out, you have 2 choices,

1. Use environment variables when you launch Backstage, either using an environment variable injector like [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) or [`env-cmd`](https://www.npmjs.com/package/env-cmd) or loading the variables directly with `EXPORT POSTGRES_...=...`.
2. Replacing the entire `${POSTGRES_...}` string with the value you identified earlier. This is the less secure option, but worth doing if you don't have much experience with environment variables.

:::danger

If you opt for the second option of replacing the entire string, take care to not commit your `app-config.yaml` to source control. It may contain passwords that you don't want leaked.

:::

[Start the Backstage app](../index.md#2-run-the-backstage-app):

```shell
yarn dev
```

After the Backstage frontend launches, you should notice that nothing has changed. This is a good sign. If everything is setup correctly above, this means that the data is flowing from the demo data files directly into your database!

We've now made your data persist in your Backstage database.

## Next Steps

We recommend you read [Setting up authentication](./authentication.md) next.

## Further Reading

If you want to read more about the database configuration, here are some helpful links:

- [Configuring Plugin Databases](../../tutorials/configuring-plugin-databases.md#privileges)
- [Read more about Knex](http://knexjs.org/), the database wrapper that we use.
