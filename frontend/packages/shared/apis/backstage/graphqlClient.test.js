import { getGraphQlApiHost, graphqlRequest } from './graphqlClient';

describe('graphqlClient', () => {
  it('should have correct uri for tests', () => {
    expect(getGraphQlApiHost()).toBe('https://backstage-proxy.spotify.net/api/backend/graphql');
  });

  it('should fail to execute a malformed query directly', async () => {
    expect(() => graphqlRequest('durr')).toThrow(/^Invalid AST Node/);
  });
});
