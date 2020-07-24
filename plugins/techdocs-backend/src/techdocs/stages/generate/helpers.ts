import { Entity } from '@backstage/catalog-model';
import { Writable, PassThrough } from 'stream';
import Docker from 'dockerode';

// TODO: Implement proper support for more generators.
export function getGeneratorKey(_entity: Entity) {
  return 'techdocs';
}

type RunDockerContainerOptions = {
  imageName: string;
  args: string[];
  logStream?: Writable;
  docsDir: string;
  resultDir: string;
  dockerClient: Docker;
  createOptions?: Docker.ContainerCreateOptions;
};

export async function runDockerContainer({
  imageName,
  args,
  logStream = new PassThrough(),
  docsDir,
  resultDir,
  dockerClient,
  createOptions,
}: RunDockerContainerOptions) {
  const [{ Error: error, StatusCode: statusCode }] = await dockerClient.run(
    imageName,
    args,
    logStream,
    {
      Volumes: {
        '/content': {},
        '/result': {},
      },
      WorkingDir: '/content',
      HostConfig: {
        Binds: [`${docsDir}:/content`, `${resultDir}:/result`],
      },
      ...createOptions,
    },
  );

  if (error) {
    throw new Error(
      `Docker failed to run with the following error message: ${error}`,
    );
  }

  if (statusCode !== 0) {
    throw new Error(
      `Docker container returned a non-zero exit code (${statusCode})`,
    );
  }

  return { error, statusCode };
}
