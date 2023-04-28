/*
 * Copyright 2023 The Backstage Authors
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
import { Config } from '@backstage/config';
import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { createFetchPlainAction } from '@backstage/plugin-scaffolder-backend';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { InputError, ConflictError } from '@backstage/errors';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import fs from 'fs-extra';
import parseGitUrl from 'git-url-parse';
import YAML from 'yaml';
import {
  readFileAsString,
  fetchConfluence,
  getAndWriteAttachments,
  createConfluenceVariables,
} from './helpers';

/**
 * @public
 */

export const createConfluenceToMarkdownAction = (options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
  config: Config;
}) => {
  const { config, reader, integrations } = options;
  const fetchPlainAction = createFetchPlainAction({ reader, integrations });
  type Obj = {
    [key: string]: string;
  };

  return createTemplateAction<{
    confluenceUrls: string[];
    repoUrl: string;
  }>({
    id: 'confluence:transform:markdown',
    schema: {
      input: {
        properties: {
          confluenceUrls: {
            type: 'array',
            title: 'Confluence URL',
            description:
              'Paste your confluence url. Ensure it follows this format: https://{confluence+base+url}/display/{spacekey}/{page+title}',
            items: {
              type: 'string',
              default: 'Confluence URL',
            },
          },
          repoUrl: {
            type: 'string',
            title: 'GitHub Repo Url',
            description:
              'mkdocs.yml file location inside the github repo you want to store the document',
          },
        },
      },
    },
    async handler(ctx) {
      const { confluenceUrls, repoUrl } = ctx.input;
      const parsedRepoUrl = parseGitUrl(repoUrl);
      const filePathToMkdocs = parsedRepoUrl.filepath.substring(
        0,
        parsedRepoUrl.filepath.lastIndexOf('/') + 1,
      );
      const dirPath = ctx.workspacePath;
      let productArray: string[][] = [];

      ctx.logger.info(`Fetching the mkdocs.yml catalog from ${repoUrl}`);

      // This grabs the files from Github
      const repoFileDir = `${dirPath}/${parsedRepoUrl.filepath}`;
      await fetchPlainAction.handler({
        ...ctx,
        input: {
          url: `https://${parsedRepoUrl.resource}/${parsedRepoUrl.owner}/${parsedRepoUrl.name}`,
          targetPath: dirPath,
        },
      });

      for (const url of confluenceUrls) {
        const { spacekey, title, titleWithSpaces } =
          await createConfluenceVariables(url);
        // This calls confluence to get the page html and page id
        const getConfluenceDoc = await fetchConfluence(
          `/rest/api/content?title=${title}&spaceKey=${spacekey}&expand=body.export_view`,
          config,
        );
        if (getConfluenceDoc.results.length === 0) {
          throw new InputError(
            `Could not find document ${url}. Please check your input.`,
          );
        }
        // This gets attachements for the confluence page if they exist
        const getDocAttachments = await fetchConfluence(
          `/rest/api/content/${getConfluenceDoc.results[0].id}/child/attachment`,
          config,
        );

        if (getDocAttachments.results.length) {
          fs.mkdirSync(`${dirPath}/${filePathToMkdocs}docs/img`, {
            recursive: true,
          });
          productArray = await getAndWriteAttachments(
            getDocAttachments,
            dirPath,
            config,
            filePathToMkdocs,
          );
        }

        ctx.logger.info(
          `starting action for converting ${titleWithSpaces} from Confluence To Markdown`,
        );

        // This reads mkdocs.yml file
        const mkdocsFileContent = await readFileAsString(repoFileDir);
        const mkdocsFile = await YAML.parse(mkdocsFileContent);
        ctx.logger.info(
          `Adding new file - ${titleWithSpaces} to the current mkdocs.yml file`,
        );

        // This modifies the mkdocs.yml file
        if (mkdocsFile !== undefined && mkdocsFile.hasOwnProperty('nav')) {
          const { nav } = mkdocsFile;
          if (!nav.some((i: Obj) => i.hasOwnProperty(titleWithSpaces))) {
            nav.push({
              [titleWithSpaces]: `${titleWithSpaces.replace(/\s+/g, '-')}.md`,
            });
            mkdocsFile.nav = nav;
          } else {
            throw new ConflictError(
              'This document looks to exist inside the GitHub repo. Will end the action.',
            );
          }
        }

        await fs.writeFile(repoFileDir, YAML.stringify(mkdocsFile));

        // This grabs the confluence html and converts it to markdown and adds attachments
        const html = getConfluenceDoc.results[0].body.export_view.value;
        const markdownToPublish = NodeHtmlMarkdown.translate(html);
        let newString: string = markdownToPublish;
        productArray.forEach((product: string[]) => {
          // This regex is looking for either [](link to confluence) or ![](link to confluence) in the newly created markdown doc and updating it to point to the versions saved(in ./docs/img) in the local version of GitHub Repo during getAndWriteAttachments
          const regex = product[0].includes('.pdf')
            ? new RegExp(`(\\[.*?\\]\\()(.*?${product[0]}.*?)(\\))`, 'gi')
            : new RegExp(`(\\!\\[.*?\\]\\()(.*?${product[0]}.*?)(\\))`, 'gi');
          newString = newString.replace(regex, `$1./img/${product[1]}$3`);
        });

        ctx.logger.info(`Adding new file to repo.`);
        await fs.outputFile(
          `${dirPath}/${filePathToMkdocs}docs/${titleWithSpaces.replace(
            /\s+/g,
            '-',
          )}.md`,
          newString,
        );
      }

      ctx.output('repo', parsedRepoUrl.name);
      ctx.output('owner', parsedRepoUrl.owner);
    },
  });
};
