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
import { ScmIntegrations } from '@backstage/integration';
import {
  createTemplateAction,
  fetchContents,
} from '@backstage/plugin-scaffolder-node';
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
  getConfluenceConfig,
} from './helpers';
import { examples } from './confluenceToMarkdown.examples';
import { UrlReaderService } from '@backstage/backend-plugin-api';

/**
 * @public
 */

export const createConfluenceToMarkdownAction = (options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
  config: Config;
}) => {
  const { config, reader, integrations } = options;
  type Obj = {
    [key: string]: string;
  };

  return createTemplateAction<{
    confluenceUrls: string[];
    repoUrl: string;
  }>({
    id: 'confluence:transform:markdown',
    description: 'Transforms Confluence content to Markdown',
    examples,
    schema: {
      input: {
        properties: {
          confluenceUrls: {
            type: 'array',
            title: 'Confluence URL',
            description:
              'Paste your Confluence url. Ensure it follows this format: https://{confluence+base+url}/display/{spacekey}/{page+title} or https://{confluence+base+url}/spaces/{spacekey}/pages/1234567/{page+title} for Confluence Cloud',
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
      const confluenceConfig = getConfluenceConfig(config);
      const { confluenceUrls, repoUrl } = ctx.input;
      const parsedRepoUrl = parseGitUrl(repoUrl);
      const filePathToMkdocs = parsedRepoUrl.filepath.substring(
        0,
        parsedRepoUrl.filepath.lastIndexOf('/') + 1,
      );
      const dirPath = ctx.workspacePath;
      const repoFileDir = `${dirPath}/${parsedRepoUrl.filepath}`;
      let productArray: string[][] = [];

      ctx.logger.info(`Fetching the mkdocs.yml catalog from ${repoUrl}`);

      // This grabs the files from Github
      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.templateInfo?.baseUrl,
        fetchUrl: `https://${parsedRepoUrl.resource}/${parsedRepoUrl.owner}/${parsedRepoUrl.name}`,
        outputPath: ctx.workspacePath,
      });

      for (const url of confluenceUrls) {
        const { spacekey, title, titleWithSpaces } =
          createConfluenceVariables(url);
        // This calls confluence to get the page html and page id
        ctx.logger.info(`Fetching the Confluence content for ${url}`);
        const getConfluenceDoc = await fetchConfluence(
          `/rest/api/content?title=${title}&spaceKey=${spacekey}&expand=body.export_view`,
          confluenceConfig,
        );
        if (getConfluenceDoc.results.length === 0) {
          throw new InputError(
            `Could not find document ${url}. Please check your input.`,
          );
        }
        // This gets attachments for the confluence page if they exist
        const getDocAttachments = await fetchConfluence(
          `/rest/api/content/${getConfluenceDoc.results[0].id}/child/attachment`,
          confluenceConfig,
        );

        if (getDocAttachments.results.length) {
          fs.mkdirSync(`${dirPath}/${filePathToMkdocs}docs/img`, {
            recursive: true,
          });
          productArray = await getAndWriteAttachments(
            getDocAttachments,
            dirPath,
            confluenceConfig,
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
