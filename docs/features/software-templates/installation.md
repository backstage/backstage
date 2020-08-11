# Installing in your Backstage App

The scaffolder plugin comes in two packages, `@backstage/plugin-scaffolder` and
`@backstage/plugin-scaffolder-backend`. Each has their own installation steps,
outlined below.

The Scaffolder plugin also depends on the Software Catalog. Instructions for how
to set that up can be found [here](./TODO.md).

## Installing @backstage/plugin-scaffolder

`The scaffolder frontend plugin should be installed in your`app`package, which is created as a part of`@backstage/create-app`.
To install the package, run:

```bash
cd packages/app
yarn add @backstage/plugin-scaffolder
```

Make sure the version of `@backstage/plugin-scaffolder` matches the version of
other `@backstage` packages. You can update it in `packages/app/package.json` if
it doesn't.

### Adding the Plugin to your `packages/app`

Add the following entry to the head of your `packages/app/src/plugins.ts`:

```ts
export { plugin as ScaffolderPlugin } from '@backstage/plugin-scaffolder';
```

Add the following to your `packages/app/src/apis.ts`:

```ts
import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';

// Inside the ApiRegistry builder function ...

builder.add(
  scaffolderApiRef,
  new ScaffolderApi({
    apiOrigin: backendUrl,
    basePath: '/scaffolder/v1',
  }),
);
```

Where `backendUrl` is the `backend.baseUrl` from config, i.e.
`const backendUrl = config.getString('backend.baseUrl')`.

This is all that is needed for the frontend part of the Scaffolder plugin to
work!

## Installing @backstage/plugin-scaffolder-backend

The scaffolder backend should be installed in your `backend` package, which is
created as a part of `@backstage/create-app`. To install the package, run:

```bash
cd packages/backend
yarn add @backstage/plugin-scaffolder-backend
```

Make sure the version of `@backstage/plugin-scaffolder-backend` matches the
version of other `@backstage` packages. You can update it in
`packages/backend/package.json` if it doesn't.

### Adding the Plugin to your `packages/backend`

You'll need to add the plugin to the `backend`'s router. You can do this by
creating a file called `packages/backend/src/plugins/scaffolder.ts` with the
following contents to get you up and running quickly.

```ts
import {
  CookieCutter,
  createRouter,
  FilePreparer,
  GithubPreparer,
  Preparers,
  GithubPublisher,
  CreateReactAppTemplater,
  Templaters,
} from '@backstage/plugin-scaffolder-backend';
import { Octokit } from '@octokit/rest';
import type { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({ logger }: PluginEnvironment) {
  const cookiecutterTemplater = new CookieCutter();
  const craTemplater = new CreateReactAppTemplater();
  const templaters = new Templaters();

  // Register default templaters
  templaters.register('cookiecutter', cookiecutterTemplater);
  templaters.register('cra', craTemplater);

  const filePreparer = new FilePreparer();
  const githubPreparer = new GithubPreparer();
  const preparers = new Preparers();

  // Register default preparers
  preparers.register('file', filePreparer);
  preparers.register('github', githubPreparer);

  // Create Github client with your access token from environment variables
  const githubClient = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
  const publisher = new GithubPublisher({ client: githubClient });

  const dockerClient = new Docker();
  return await createRouter({
    preparers,
    templaters,
    publisher,
    logger,
    dockerClient,
  });
}
```

Once the `scaffolder.ts` router setup file is in place, add the router to
`packages/backend/src/index.ts`:

```ts
import scaffolder from './plugins/scaffolder';

const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));

const service = createServiceBuilder(module)
  .loadConfig(configReader)
  /** several different routers */
  .addRouter('/scaffolder', await scaffolder(scaffolderEnv));
```

### Adding Templates

At this point the scaffolder backend is installed in your backend package, but
you will not have any templates available to use. These need to be added to the
software catalog, as they are represented as entities of kind
[Template](/docs/features/software-catalog/descriptor-format.md#kind-template).
You can find out more about adding templates [here](./adding-templates.md).

To get up and running and try out some templates quickly, you can add some of
our example templates through static configuration. Add the following to the
`catalog.locations` section in your `app-config.yaml`:

```yaml
catalog:
  locations:
    # Backstage Example Templates
    type: github
    target: https://github.com/spotify/backstage/blob/master/plugins/scaffolder-backend/sample-templates/react-ssr-template/template.yaml
    type: github
    target: https://github.com/spotify/backstage/blob/master/plugins/scaffolder-backend/sample-templates/springboot-grpc-template/template.yaml
    type: github
    target: https://github.com/spotify/backstage/blob/master/plugins/scaffolder-backend/sample-templates/create-react-app/template.yaml
    type: github
    target: https://github.com/spotify/cookiecutter-golang/blob/master/template.yaml
```

### Runtime Dependencies

For the scaffolder backend plugin to function, it needs a GitHub access token,
and access to a running Docker daemon. You can create a GitHub access token
[here](https://github.com/settings/tokens/new), select `repo` scope only. Full
docs on creating private GitHub access tokens is available
[here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).
Note that the need for private GitHub access tokens will be replaced with GitHub
Apps integration further down the line.

The GitHub access token is passed along using the `GITHUB_ACCESS_TOKEN`
environment variable.

### Running the Backend

Finally, make sure you have a local Docker daemon running, and start up the
backend with the new configuration:

```bash
cd packages/backend
GITHUB_ACCESS_TOKEN=<token> yarn start
```

If you've also set up the frontend plugin, so you should be ready to go browse
the templates at [localhost:3000/create](http://localhost:3000/create) now!
