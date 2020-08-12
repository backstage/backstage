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
  templaters.register('cookiecutter', cookiecutterTemplater);
  templaters.register('cra', craTemplater);

  const filePreparer = new FilePreparer();
  const githubPreparer = new GithubPreparer();
  const preparers = new Preparers();

  preparers.register('file', filePreparer);
  preparers.register('github', githubPreparer);

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
