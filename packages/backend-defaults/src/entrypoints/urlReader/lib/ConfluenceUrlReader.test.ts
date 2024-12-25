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
import { JsonObject } from '@backstage/types';
import { UrlReaderPredicateTuple } from './types';
import { ConfluenceUrlReader } from './ConfluenceUrlReader';
import { ConfigReader } from '@backstage/config';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import { DefaultReadTreeResponseFactory } from './tree';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const mockDir = createMockDirectory({ mockOsTmpDir: true });
const mockPageId = '3032744732';
const mockChildPageId = '3032744733';
const mockAttachmentId = '1234';
const mockHost = 'mycompany.atlassian.net';
const mockSpaceKey = 'SS';
const mockPageTitle = 'some page title';
const mockChildPageTitle = 'Some Child Page Title';

const fetchConfluencePage = () =>
  rest.get(`https://${mockHost}/wiki/rest/api/content`, (req, res, ctx) => {
    const params: URLSearchParams = req.url.searchParams;
    if (params.get('title') === mockPageTitle) {
      return res(
        ctx.status(200),
        ctx.json({
          results: [
            {
              id: mockPageId,
              title: mockPageTitle,
              body: {
                export_view: {
                  value: '<p>Docs html goes here!</p>',
                },
              },
            },
          ],
        }),
      );
    } else if (params.get('title') === mockChildPageTitle) {
      return res(
        ctx.status(200),
        ctx.json({
          results: [
            {
              id: mockChildPageId,
              title: mockChildPageTitle,
              body: {
                export_view: {
                  value: '<p>Docs html goes here!</p>',
                },
              },
            },
          ],
        }),
      );
    }
    return res(ctx.status(404));
  });

const fetchConfluencePageAttachments = (pageId: string, attachmentId: string) =>
  rest.get(
    `https://${mockHost}/wiki/api/v2/pages/${pageId}/attachments`,
    (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          results: [
            {
              id: attachmentId,
              title: 'Attachment 1.png',
              pageId: pageId,
              version: {
                number: '5',
                createdAt: Date.now(),
              },
            },
          ],
        }),
      );
    },
  );

const fetchConfluencePageNoAttachments = (pageId: string) =>
  rest.get(
    `https://${mockHost}/wiki/api/v2/pages/${pageId}/attachments`,
    (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          results: [],
        }),
      );
    },
  );

const fetchConfluencePageAttachmentContent = (
  pageId: string,
  attachmentId: string,
) =>
  rest.get(
    `https://${mockHost}/wiki/rest/api/content/${pageId}/child/attachment/${attachmentId}/download`,
    (_, res, ctx) => {
      return res(ctx.status(200), ctx.json('image data in bytes'));
    },
  );

const fetchConfluencePageNoChildren = (pageId: string) =>
  rest.get(
    `https://${mockHost}/wiki/api/v2/pages/${pageId}/children`,
    (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          results: [],
        }),
      );
    },
  );

const fetchConfluencePageChildren = (pageId: string, childPageId: string) =>
  rest.get(
    `https://${mockHost}/wiki/api/v2/pages/${pageId}/children`,
    (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          results: [
            {
              id: childPageId,
              status: 'current',
              title: mockChildPageTitle,
              spaceId: '3211428608',
              childPosition: 532837929,
            },
          ],
        }),
      );
    },
  );

describe('ConfluenceUrlReader', () => {
  const worker = setupServer(
    fetchConfluencePageAttachmentContent(mockPageId, mockAttachmentId),
  );

  const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
    return ConfluenceUrlReader.factory({
      config: new ConfigReader(config),
      logger: mockServices.logger.mock(),
      treeResponseFactory: DefaultReadTreeResponseFactory.create({
        config: new ConfigReader({}),
      }),
    });
  };

  it('does not create a reader without the googleGcs field', () => {
    const entries = createReader({
      integrations: {},
    });
    expect(entries).toHaveLength(0);
  });

  it('creates a reader with credentials correctly configured', () => {
    const entries = createReader({
      integrations: {
        confluence: [
          {
            host: 'mycompany.atlassian.net',
            apiToken: 'Basic dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
          },
        ],
      },
    });
    expect(entries).toHaveLength(1);
  });

  describe('readTree', () => {
    beforeEach(mockDir.clear);
    beforeEach(() => jest.clearAllMocks());
    beforeEach(() => worker.listen());
    afterEach(() => worker.resetHandlers());
    afterAll(() => worker.close());

    const reader: UrlReaderService = createReader({
      integrations: {
        confluence: [
          {
            host: 'mycompany.atlassian.net',
            apiToken: 'Basic dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
          },
        ],
      },
    })[0].reader;

    it('Should fail for invalid url', async () => {
      await expect(
        reader.readTree(`https://${mockHost}/pages/${mockPageId}/some+page`),
      ).rejects.toThrow(/The Url format for Confluence is incorrect/);
    });

    it('Should pass for valid url formats', async () => {
      let response;
      let files;
      worker.use(fetchConfluencePage());
      worker.use(fetchConfluencePageNoChildren(mockPageId));
      worker.use(fetchConfluencePageNoAttachments(mockPageId));

      // Accepted format 1: https://confluence.example.com/display/SPACEKEY/Page+Title
      response = await reader.readTree(
        `https://${mockHost}/display/${mockSpaceKey}/${mockPageTitle}`,
      );
      files = await response.files();
      expect(files.length).toBe(2);

      // Accepted format 2: https://confluence.example.com/prefix/display/SPACEKEY/Page+Title
      response = await reader.readTree(
        `https://${mockHost}/wiki/display/${mockSpaceKey}/${mockPageTitle}`,
      );
      files = await response.files();
      expect(files.length).toBe(2);

      // Accepted format 1: https://example.atlassian.net/wiki/spaces/SPACEKEY/pages/1234567/Page+Title
      response = await reader.readTree(
        `https://${mockHost}/wiki/spaces/${mockSpaceKey}/pages/${mockPageId}/${mockPageTitle}`,
      );
      files = await response.files();
      expect(files.length).toBe(2);
    });

    it('Fetches a page with attachments', async () => {
      worker.use(fetchConfluencePage());
      worker.use(fetchConfluencePageAttachments(mockPageId, mockAttachmentId));
      worker.use(fetchConfluencePageNoChildren(mockPageId));

      const response = await reader.readTree(
        `https://mycompany.atlassian.net/wiki/spaces/BB/pages/${mockPageId}/${mockPageTitle}`,
      );
      const files = await response.files();

      expect(files.length).toBe(3);
      expect(files[0].path).toBe('/docs/attachments/Attachment-1.png');
      expect(files[1].path).toBe(`/docs/${mockPageTitle}.md`);
      expect(files[2].path).toBe('docs/index.md');
    });

    it('Fetches a page with its children', async () => {
      worker.use(fetchConfluencePage());
      worker.use(fetchConfluencePageChildren(mockPageId, mockChildPageId));
      worker.use(fetchConfluencePageNoChildren(mockChildPageId));
      worker.use(fetchConfluencePageNoAttachments(mockPageId));
      worker.use(fetchConfluencePageNoAttachments(mockChildPageId));

      const response = await reader.readTree(
        `https://mycompany.atlassian.net/wiki/spaces/${mockSpaceKey}/pages/${mockPageId}/${mockPageTitle}`,
      );
      const files = await response.files();

      expect(files.length).toBe(3);
      expect(files[0].path).toBe(`/docs/${mockPageTitle}.md`);
      expect(files[1].path).toBe(
        `/docs/${mockPageTitle.replaceAll(' ', '-')}/${mockChildPageTitle}.md`,
      );
      expect(files[2].path).toBe('docs/index.md');
    });

    it('Fetches a page with its children and attachments', async () => {
      worker.use(fetchConfluencePage());
      worker.use(fetchConfluencePageAttachments(mockPageId, mockAttachmentId));
      worker.use(fetchConfluencePageChildren(mockPageId, mockChildPageId));
      worker.use(fetchConfluencePageNoChildren(mockChildPageId));
      worker.use(fetchConfluencePageNoAttachments(mockChildPageId));

      const response = await reader.readTree(
        `https://mycompany.atlassian.net/wiki/spaces/${mockSpaceKey}/pages/${mockPageId}/${mockPageTitle}`,
      );
      const files = await response.files();

      expect(files.length).toBe(4);
      expect(files[0].path).toBe('/docs/attachments/Attachment-1.png');
      expect(files[1].path).toBe(`/docs/${mockPageTitle}.md`);
      expect(files[2].path).toBe(
        `/docs/${mockPageTitle.replaceAll(' ', '-')}/${mockChildPageTitle}.md`,
      );
      expect(files[3].path).toBe('docs/index.md');
    });
  });
});
