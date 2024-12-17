/*
 * Copyright 2024 The Backstage Authors
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
import { Attachment, MkDocs } from './types';
import fs from 'fs';

require('dotenv').config();

import yaml from 'js-yaml';
import os from 'os';
// import { ConfluenceIntegrationConfig } from "./config";

// const workingDir = this.config.getOptionalString(
//   'backend.workingDirectory',
// );
const tmpdirPath = os.tmpdir();

// export async function fetchConfluencePage(
//   pageId : string,
//   config: ConfluenceIntegrationConfig
// ) {
//   const url = `https://${config.host}/wiki/api/v2/pages/${pageId}?body-format=EXPORT_VIEW`
//   const response = await fetch(url, {
//     headers: {
//       Authorization: config.apiToken,
//     }
//   });

//   if(!response.ok) {
//     throw new Error(`Failed to fetch page: ${response.status}`);
//   }

//   const apiResponse = await response.json();
//   const pageHtml = apiResponse.body.export_view.value;
//   return htmlToMardDown(pageHtml);
// }

// async function fetchConfluencePageAttachments(
//   pageId: string,
//   config: ConfluenceIntegrationConfig
// ) {
//   const response = await fetch(`https://${config.host}/wiki/api/v2/pages/${pageId}/attachments`, {
//     headers: {
//       Authorization: config.apiToken,
//     }
//   })

//   if(!response.ok) {
//     throw new Error(`Failed to fetch page: ${response.status}`);
//   }

//   const apiResponse = await response.json();
//   const attachments = apiResponse.results;
//   return attachments;
// }

// async function downloadAttachment(
//   attachment: Attachment,
//   dirPath: string,
//   config: ConfluenceIntegrationConfig
// ) {
//   const host = config.host
//   const attachmentTitle = attachment.title.replace(/ /g, '-')
//   const path = `${dirPath}/${attachmentTitle}`;

//   // console.log(url)
//   const url = `https://${host}/wiki/rest/api/content/${attachment.pageId}/child/attachment/${attachment.id}/download`
//   const res = await fetch(url, {
//     method: 'GET',
//     headers: {
//       Authorization: config.apiToken,
//     },
//   });
//   if (!res.ok) {
//     throw new Error(`Failed to download attachment: ${res.status}`)
//   }
//   const writeStream = fs.createWriteStream(
//     path,
//   );

//   await new Promise((resolve, reject) => {
//     res.body?.pipeTo(new WritableStream({
//       write(chunk) {
//         writeStream.write(chunk);
//       },
//       close() {
//         writeStream.close(resolve);
//       },
//       abort(err) {
//         fs.unlink(path, () => reject(err)); // Clean up the file on error
//       },
//     }))
//   });
// }

// export async function fetchPageAttachments(
//   pageId : string,
//   config: ConfluenceIntegrationConfig
// ) {
//   const attachments = await fetchConfluencePageAttachments(pageId, config);
//   const path = `${tmpdirPath}/docs/attachments`;
//   createDirectoryIfnotExists(path);
//   for(let attachment of attachments) {
//     await downloadAttachment(attachment, path, config);
//   }
//   return attachments;
// }

export function replaceAttachmentLinks(
  attachments: Attachment[],
  markdown: string,
) {
  let markdownToPublish = markdown;
  for (const attachment of attachments) {
    const attachmentTitle = attachment.title.replace(/ /g, '-');
    const attachmentTitleInUrl = attachment.title.replace(/ /g, '%20');
    const regex = attachmentTitleInUrl.includes('.pdf')
      ? new RegExp(`(\\[.*?\\]\\()(.*?${attachmentTitleInUrl}.*?)(\\))`, 'gi')
      : new RegExp(
          `(\\!\\[.*?\\]\\()(.*?${attachmentTitleInUrl}.*?)(\\))`,
          'gi',
        );
    markdownToPublish = markdownToPublish.replace(
      regex,
      `$1./attachments/${attachmentTitle}$3`,
    );
  }
  return markdownToPublish;
}

function createDirectoryIfnotExists(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

// function htmlToMardDown(html: string) {
//   return NodeHtmlMarkdown.translate(html)
// }

const mkdocs: MkDocs = {
  site_name: 'Beestack documentation',
  repo_url: 'https://github.com/backstage/backstage',
  edit_uri:
    'edit/master/plugins/techdocs-backend/examples/documented-component/docs',
  nav: [],
};

export async function savePage(page: string, pageId: string) {
  const path = `${tmpdirPath}/docs`;
  createDirectoryIfnotExists(path);

  fs.writeFile(`${path}/${pageId}.md`, page, err => {
    if (err) throw err;
  });

  mkdocs.nav.push({
    Home: `${pageId}.md`,
  });
  createMkdocs();
}

/**
 * ToDo: Make it create or update mkdocs with the pageId
 * by that we can keep track of all the pages and their IDs dynamically
 */
export async function createMkdocs() {
  const mkdocsYaml = yaml.dump(mkdocs);
  const path = `${tmpdirPath}/mkdocs.yml`;
  fs.writeFile(path, mkdocsYaml, err => {
    if (err) throw err;
  });
}
