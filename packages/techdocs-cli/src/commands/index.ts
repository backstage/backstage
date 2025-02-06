/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Command } from 'commander';
import { TechdocsGenerator } from '@backstage/plugin-techdocs-node';

const defaultDockerImage = TechdocsGenerator.defaultDockerImage;
const defaultPreviewAppPort = '3000';

export function registerCommands(program: Command) {
  program
    .command('generate')
    .description('Generate TechDocs documentation site using MkDocs.')
    .option(
      '--source-dir <PATH>',
      'Source directory containing mkdocs.yml and docs/ directory.',
      '.',
    )
    .option(
      '--output-dir <PATH>',
      'Output directory containing generated TechDocs site.',
      './site/',
    )
    .option(
      '--docker-image <DOCKER_IMAGE>',
      'The mkdocs docker container to use',
      defaultDockerImage,
    )
    .option('--no-pull', 'Do not pull the latest docker image')
    .option(
      '--no-docker',
      'Do not use Docker, use MkDocs executable and plugins in current user environment.',
    )
    .option(
      '--techdocs-ref <HOST_TYPE:URL>',
      'The repository hosting documentation source files e.g. url:https://ghe.mycompany.net.com/org/repo.' +
        '\nThis value is same as the backstage.io/techdocs-ref annotation of the corresponding Backstage entity.' +
        '\nIt is completely fine to skip this as it is only being used to set repo_url in mkdocs.yml if not found.\n',
    )
    .option(
      '--etag <ETAG>',
      'A unique identifier for the prepared tree e.g. commit SHA. If provided it will be stored in techdocs_metadata.json.',
    )
    .option(
      '--site-name',
      'Name for site when using default MkDocs config',
      'Documentation Site',
    )
    .option('-v --verbose', 'Enable verbose output.', false)
    .option(
      '--omitTechdocsCoreMkdocsPlugin',
      "Don't patch MkDocs file automatically with techdocs-core plugin.",
      false,
    )
    .option(
      '--legacyCopyReadmeMdToIndexMd',
      'Attempt to ensure an index.md exists falling back to using <docs-dir>/README.md or README.md in case a default <docs-dir>/index.md is not provided.',
      false,
    )
    .option(
      '--defaultPlugin [defaultPlugins...]',
      'Plugins which should be added automatically to the mkdocs.yaml file',
      [],
    )
    .option(
      '--runAsDefaultUser',
      'Bypass setting the container user as the same user and group id as host for Linux and MacOS',
      false,
    )
    .alias('build')
    .action(lazy(() => import('./generate/generate'), 'default'));

  program
    .command('migrate')
    .description(
      'Migrate objects with case-sensitive entity triplets to lower-case versions.',
    )
    .requiredOption(
      '--publisher-type <TYPE>',
      '(Required always) awsS3 | googleGcs | azureBlobStorage | openStackSwift - same as techdocs.publisher.type in Backstage app-config.yaml',
    )
    .requiredOption(
      '--storage-name <BUCKET/CONTAINER NAME>',
      '(Required always) In case of AWS/GCS, use the bucket name. In case of Azure, use container name. Same as techdocs.publisher.[TYPE].bucketName',
    )
    .option(
      '--azureAccountName <AZURE ACCOUNT NAME>',
      '(Required for Azure) specify when --publisher-type azureBlobStorage',
    )
    .option(
      '--azureAccountKey <AZURE ACCOUNT KEY>',
      'Azure Storage Account key to use for authentication. If not specified, you must set AZURE_TENANT_ID, AZURE_CLIENT_ID & AZURE_CLIENT_SECRET as environment variables.',
    )
    .option(
      '--awsRoleArn <AWS ROLE ARN>',
      'Optional AWS ARN of role to be assumed.',
    )
    .option(
      '--awsEndpoint <AWS ENDPOINT>',
      'Optional AWS endpoint to send requests to.',
    )
    .option(
      '--awsS3ForcePathStyle',
      'Optional AWS S3 option to force path style.',
    )
    .option(
      '--osCredentialId <OPENSTACK SWIFT APPLICATION CREDENTIAL ID>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--osSecret <OPENSTACK SWIFT APPLICATION CREDENTIAL SECRET>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--osAuthUrl <OPENSTACK SWIFT AUTHURL>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--osSwiftUrl <OPENSTACK SWIFT SWIFTURL>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--removeOriginal',
      'Optional Files are copied by default. If flag is set, files are renamed/moved instead.',
      false,
    )
    .option(
      '--concurrency <MAX CONCURRENT REQS>',
      'Optional Controls the number of API requests allowed to be performed simultaneously.',
      '25',
    )
    .option('-v --verbose', 'Enable verbose output.', false)
    .action(lazy(() => import('./migrate/migrate'), 'default'));

  program
    .command('publish')
    .description(
      'Publish generated TechDocs site to an external storage AWS S3, Google GCS, etc.',
    )
    .requiredOption(
      '--publisher-type <TYPE>',
      '(Required always) awsS3 | googleGcs | azureBlobStorage | openStackSwift - same as techdocs.publisher.type in Backstage app-config.yaml',
    )
    .requiredOption(
      '--storage-name <BUCKET/CONTAINER NAME>',
      '(Required always) In case of AWS/GCS, use the bucket name. In case of Azure, use container name. Same as techdocs.publisher.[TYPE].bucketName',
    )
    .requiredOption(
      '--entity <NAMESPACE/KIND/NAME>',
      '(Required always) Entity uid separated by / in namespace/kind/name order (case-sensitive). Example: default/Component/myEntity ',
    )
    .option(
      '--legacyUseCaseSensitiveTripletPaths',
      'Publishes objects with cased entity triplet prefix when set (e.g. namespace/Kind/name). Only use if your TechDocs backend is configured the same way.',
      false,
    )
    .option(
      '--azureAccountName <AZURE ACCOUNT NAME>',
      '(Required for Azure) specify when --publisher-type azureBlobStorage',
    )
    .option(
      '--azureAccountKey <AZURE ACCOUNT KEY>',
      'Azure Storage Account key to use for authentication. If not specified, you must set AZURE_TENANT_ID, AZURE_CLIENT_ID & AZURE_CLIENT_SECRET as environment variables.',
    )
    .option(
      '--awsRoleArn <AWS ROLE ARN>',
      'Optional AWS ARN of role to be assumed.',
    )
    .option(
      '--awsEndpoint <AWS ENDPOINT>',
      'Optional AWS endpoint to send requests to.',
    )
    .option(
      '--awsProxy <HTTPS Proxy>',
      'Optional Proxy to use for AWS requests.',
    )
    .option('--awsS3sse <AWS SSE>', 'Optional AWS S3 Server Side Encryption.')
    .option(
      '--awsS3ForcePathStyle',
      'Optional AWS S3 option to force path style.',
    )
    .option(
      '--awsBucketRootPath <AWS BUCKET ROOT PATH>',
      'Optional sub-directory to store files in Amazon S3',
    )
    .option(
      '--awsMaxAttempts <AWS MAX ATTEMPTS>',
      'Optional maximum number of retries for AWS S3 operations. If not specified, default value of 3 is used.',
    )
    .option(
      '--osCredentialId <OPENSTACK SWIFT APPLICATION CREDENTIAL ID>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--osSecret <OPENSTACK SWIFT APPLICATION CREDENTIAL SECRET>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--osAuthUrl <OPENSTACK SWIFT AUTHURL>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--osSwiftUrl <OPENSTACK SWIFT SWIFTURL>',
      '(Required for OpenStack) specify when --publisher-type openStackSwift',
    )
    .option(
      '--gcsBucketRootPath <GCS BUCKET ROOT PATH>',
      'Optional sub-directory to store files in Google cloud storage',
    )
    .option(
      '--directory <PATH>',
      'Path of the directory containing generated files to publish',
      './site/',
    )
    .action(lazy(() => import('./publish/publish'), 'default'));

  program
    .command('serve:mkdocs')
    .description('Serve a documentation project locally using MkDocs serve.')
    .option(
      '-i, --docker-image <DOCKER_IMAGE>',
      'The mkdocs docker container to use',
      defaultDockerImage,
    )
    .option(
      '--docker-entrypoint <DOCKER_ENTRYPOINT>',
      'Override the image entrypoint',
    )
    .option(
      '--docker-option <DOCKER_OPTION...>',
      'Extra options to pass to the docker run command, e.g. "--add-host=internal.host:192.168.11.12" (can be added multiple times).',
    )
    .option(
      '--no-docker',
      'Do not use Docker, run `mkdocs serve` in current user environment.',
    )
    .option(
      '--site-name',
      'Name for site when using default MkDocs config',
      'Documentation Site',
    )
    .option('-p, --port <PORT>', 'Port to serve documentation locally', '8000')
    .option('-v --verbose', 'Enable verbose output.', false)
    .action(lazy(() => import('./serve/mkdocs'), 'default'));

  program
    .command('serve')
    .description(
      'Serve a documentation project locally in a Backstage app-like environment',
    )
    .option(
      '-i, --docker-image <DOCKER_IMAGE>',
      'The mkdocs docker container to use',
      defaultDockerImage,
    )
    .option(
      '--docker-entrypoint <DOCKER_ENTRYPOINT>',
      'Override the image entrypoint',
    )
    .option(
      '--docker-option <DOCKER_OPTION...>',
      'Extra options to pass to the docker run command, e.g. "--add-host=internal.host:192.168.11.12" (can be added multiple times).',
    )
    .option(
      '--no-docker',
      'Do not use Docker, use MkDocs executable in current user environment.',
    )
    .option(
      '--site-name',
      'Name for site when using default MkDocs config',
      'Documentation Site',
    )
    .option('--mkdocs-port <PORT>', 'Port for MkDocs server to use', '8000')
    .option('-v --verbose', 'Enable verbose output.', false)
    .option(
      '--preview-app-bundle-path <PATH_TO_BUNDLE>',
      'Preview documentation using another web app',
    )
    .option(
      '--preview-app-port <PORT>',
      'Port for the preview app to be served on',
      defaultPreviewAppPort,
    )
    .option(
      '-c, --mkdocs-config-file-name <FILENAME>',
      'Mkdocs config file name',
    )
    .option(
      '--mkdocs-parameter-clean',
      'Pass "--clean" parameter to mkdocs server running in containerized environment',
      false,
    )
    .option(
      '--mkdocs-parameter-dirtyreload',
      'Pass "--dirtyreload" parameter to mkdocs server running in containerized environment',
      false,
    )
    .option(
      '--mkdocs-parameter-strict',
      'Pass "--strict" parameter to mkdocs server running in containerized environment',
      false,
    )
    .hook('preAction', command => {
      if (
        command.opts().previewAppPort !== defaultPreviewAppPort &&
        !command.opts().previewAppBundlePath
      ) {
        command.error(
          '--preview-app-port can only be used together with --preview-app-bundle-path',
        );
      }
    })
    .action(lazy(() => import('./serve/serve'), 'default'));
}

// Humbly taken from backstage-cli's registerCommands
type ActionFunc = (...args: any[]) => Promise<void>;
type ActionExports<TModule extends object> = {
  [KName in keyof TModule as TModule[KName] extends ActionFunc
    ? KName
    : never]: TModule[KName];
};

// Wraps an action function so that it always exits and handles errors
export function lazy<TModule extends object>(
  moduleLoader: () => Promise<TModule>,
  exportName: keyof ActionExports<TModule>,
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const mod = await moduleLoader();
      const actualModule = (
        mod as unknown as { default: ActionExports<TModule> }
      ).default;
      const actionFunc = actualModule[exportName] as ActionFunc;
      await actionFunc(...args);

      process.exit(0);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  };
}
