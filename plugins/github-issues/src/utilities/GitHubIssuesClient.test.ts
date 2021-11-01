import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { GitHubIssueApiEntity } from '../types/api';
import { GitHubIssuesClient } from './GitHubIssuesClient';
import { mockGitHubData } from '../mock-data/api-limit-mock';

const server = setupServer();
const mockBaseUrl = 'https://api.github.com/repos/backstage/backstage/issues';

describe('CatalogClient', () => {
  let client: GitHubIssuesClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    client = new GitHubIssuesClient();
  });

  describe('getEntities', () => {
    const defaultServiceResponse: GitHubIssueApiEntity[] = [...mockGitHubData];

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}`, (_, res, ctx) => {
          return res(ctx.json(defaultServiceResponse));
        }),
      );
    });

    it('should fetch entities from correct endpoint', async () => {
      expect.assertions(1);
      const response = await client.getIssues('backstage/backstage');
      expect(response).toEqual(defaultServiceResponse);
    });
  });
});
