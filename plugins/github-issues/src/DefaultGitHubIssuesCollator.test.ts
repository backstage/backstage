import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { GitHubIssueApiEntity } from './types/api';
import { GitHubIssuesClient } from './utilities/GitHubIssuesClient';
import { mockGitHubData } from './mock-data/api-limit-mock';
import { DefaultGitHubIssuesCollator } from './DefaultGitHubIssuesCollator';

const server = setupServer();
const mockBaseUrl = 'https://api.github.com/repos/backstage/backstage/issues';
const defaultServiceResponse: GitHubIssueApiEntity[] = [...mockGitHubData];

describe('Default GitHub Issues Collator', () => {
  let client: GitHubIssuesClient;
  let collator: DefaultGitHubIssuesCollator;

  beforeAll(() => {
    client = new GitHubIssuesClient();
    collator = new DefaultGitHubIssuesCollator({
      githubIssuesClient: client,
    });
    server.listen();
  });
  beforeEach(() => {
    server.use(
      rest.get(`${mockBaseUrl}`, (_, res, ctx) => {
        return res(ctx.json(defaultServiceResponse));
      }),
    );
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => {
    server.close();
    // jest.useRealTimers();
  });

  it('fetches data from github issues client mocked service', async () => {
    const documents = await collator.execute();
    expect(documents).toHaveLength(defaultServiceResponse.length);
  });

  it('matching first node data', async () => {
    const documents = await collator.execute();
    expect(documents[0]).toMatchObject({
      location: defaultServiceResponse[0].html_url,
      text: defaultServiceResponse[0].body,
      title: defaultServiceResponse[0].title,
      user: defaultServiceResponse[0].user.login,
      image: defaultServiceResponse[0].user.avatar_url,
    });
  });
});
