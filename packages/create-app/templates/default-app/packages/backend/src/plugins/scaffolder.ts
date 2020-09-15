import {
  CookieCutter,
  createRouter,
  FilePreparer,
  GithubPreparer,
  Preparers,
  GithubPublisher,
  CreateReactAppTemplater,
  Templaters,
  RepoVisilityOptions,
} from '@backstage/plugin-scaffolder-backend';
import { Octokit } from '@octokit/rest';
import type { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  const cookiecutterTemplater = new CookieCutter();
  const craTemplater = new CreateReactAppTemplater();
  const templaters = new Templaters();
  templaters.register('cookiecutter', cookiecutterTemplater);
  templaters.register('cra', craTemplater);

  const filePreparer = new FilePreparer();
  const githubPreparer = new GithubPreparer();
  const preparers = new Preparers();

  preparers.register('file', filePreparer);
  preparers.register('github', githubPreparer);

  const githubToken = config.getString('scaffolder.github.token');
  const repoVisibility = config.getString(
    'scaffolder.github.visibility',
  ) as RepoVisilityOptions;

  const githubClient = new Octokit({ auth: githubToken });
  const publisher = new GithubPublisher({
    client: githubClient,
    token: githubToken,
    repoVisibility,
  });

  const dockerClient = new Docker();
  return await createRouter({
    preparers,
    templaters,
    publisher,
    logger,
    dockerClient,
  });
}
