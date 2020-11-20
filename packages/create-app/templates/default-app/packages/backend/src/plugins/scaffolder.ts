import {
  CookieCutter,
  createRouter,
  FilePreparer,
  GithubPreparer,
  GitlabPreparer,
  Preparers,
  Publishers,
  GithubPublisher,
  GitlabPublisher,
  CreateReactAppTemplater,
  Templaters,
  RepoVisibilityOptions,
  CatalogEntityClient,
} from '@backstage/plugin-scaffolder-backend';
import { SingleHostDiscovery } from '@backstage/backend-common';
import { Octokit } from '@octokit/rest';
import { Gitlab } from '@gitbeaker/node';
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
  const gitlabPreparer = new GitlabPreparer(config);
  const preparers = new Preparers();

  preparers.register('file', filePreparer);
  preparers.register('github', githubPreparer);
  preparers.register('gitlab', gitlabPreparer);
  preparers.register('gitlab/api', gitlabPreparer);

  const publishers = new Publishers();

  const githubConfig = config.getOptionalConfig('scaffolder.github');

  if (githubConfig) {
    try {
      const repoVisibility = githubConfig.getString(
        'visibility',
      ) as RepoVisibilityOptions;

      const githubToken = githubConfig.getString('token');
      const githubHost = githubConfig.getOptionalString('host');
      const githubClient = new Octokit({ auth: githubToken, baseUrl: githubHost });
      const githubPublisher = new GithubPublisher({
        client: githubClient,
        token: githubToken,
        repoVisibility,
      });
      publishers.register('file', githubPublisher);
      publishers.register('github', githubPublisher);
    } catch (e) {
      const providerName = 'github';
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          `Failed to initialize ${providerName} scaffolding provider, ${e.message}`,
        );
      }

      logger.warn(
        `Skipping ${providerName} scaffolding provider, ${e.message}`,
      );
    }
  }

  const gitLabConfig = config.getOptionalConfig('scaffolder.gitlab.api');
  if (gitLabConfig) {
    try {
      const gitLabToken = gitLabConfig.getString('token');
      const gitLabClient = new Gitlab({
        host: gitLabConfig.getOptionalString('baseUrl'),
        token: gitLabToken,
      });
      const gitLabPublisher = new GitlabPublisher(gitLabClient, gitLabToken);
      publishers.register('gitlab', gitLabPublisher);
      publishers.register('gitlab/api', gitLabPublisher);
    } catch (e) {
      const providerName = 'gitlab';
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          `Failed to initialize ${providerName} scaffolding provider, ${e.message}`,
        );
      }

      logger.warn(
        `Skipping ${providerName} scaffolding provider, ${e.message}`,
      );
    }
  }

  const dockerClient = new Docker();

  const discovery = SingleHostDiscovery.fromConfig(config);
  const entityClient = new CatalogEntityClient({ discovery });

  return await createRouter({
    preparers,
    templaters,
    publishers,
    logger,
    config,
    dockerClient,
    entityClient,
  });
}
