import GheClient from './GheClient';

describe('gheClient', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should fetch file content', async () => {
    fetch.mockResponseOnce(JSON.stringify({ encoding: 'base64', content: btoa('abc') }), { status: 200 });
    await expect(GheClient.fromAccessToken('abc').getFile({ org: 'a', repo: 'b', path: 'c' })).resolves.toEqual({
      content: 'abc',
    });
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('token abc');
  });

  it('should fetch raw file content', async () => {
    fetch.mockResponseOnce(JSON.stringify({ encoding: 'base64', content: btoa('abc') }), { status: 200 });
    await expect(GheClient.fromAccessToken('abc').getFile({ org: 'a', repo: 'b', path: 'c' })).resolves.toMatchObject({
      content: 'abc',
    });
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('token abc');
  });

  it('should fetch raw file content with no encoding', async () => {
    fetch.mockResponseOnce(JSON.stringify({ encoding: 'utf-8', content: 'abc' }), { status: 200 });
    await expect(GheClient.fromAccessToken('abc').getFile({ org: 'a', repo: 'b', path: 'c' })).resolves.toMatchObject({
      content: 'abc',
    });
    expect(fetch.mock.calls[0][0]).toBe('https://ghe.spotify.net/api/v3/repos/a/b/contents/c');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('token abc');
  });

  it('should fetch raw file content from ref', async () => {
    fetch.mockResponseOnce(JSON.stringify({ encoding: 'base64', content: btoa('abc') }), { status: 200 });
    await expect(
      GheClient.fromAccessToken('abc').getFile({ org: 'a', repo: 'b', path: 'c', sha: 'abc123' }),
    ).resolves.toMatchObject({
      content: 'abc',
    });
    expect(fetch.mock.calls[0][0]).toBe('https://ghe.spotify.net/api/v3/repos/a/b/contents/c?ref=abc123');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('token abc');
  });

  it('should fetch from any api', async () => {
    fetch.mockResponseOnce(JSON.stringify({ some: 'data' }), { status: 200 });
    await expect(GheClient.fromAccessToken('abc').request('/my-path')).resolves.toEqual({ some: 'data' });
    expect(fetch.mock.calls[0][0]).toBe('https://ghe.spotify.net/api/v3/my-path');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('token abc');
  });

  it('should handle failture', async () => {
    fetch.mockResponseOnce('{}', { status: 401, statusText: 'NOPE' });
    await expect(GheClient.fromAccessToken('abc').request('/my-path')).rejects.toMatchObject({
      message: 'Failed to do authenticated GHE request: 401 NOPE',
      status: 401,
      statusText: 'NOPE',
      body: {},
    });
  });

  it('should fetch a commit', async () => {
    fetch.mockResponseOnce(JSON.stringify({ sha: 'abc123' }), { status: 200 });
    await expect(GheClient.fromAccessToken('abc').getCommit({ org: 'a', repo: 'b', sha: 'abc123' })).resolves.toEqual({
      sha: 'abc123',
    });
    expect(fetch.mock.calls[0][0]).toBe('https://ghe.spotify.net/api/v3/repos/a/b/commits/abc123');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('token abc');
  });

  it('should create a commit', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');

    jest
      .spyOn(gheClient, 'request')
      .mockResolvedValueOnce({ tree: { sha: 'parent-tree-sha' } })
      .mockResolvedValueOnce({ sha: 'new-tree-sha' })
      .mockResolvedValueOnce({ sha: 'new-commit-sha' });

    const commit = await gheClient.createCommit({
      org: 'org',
      repo: 'repo',
      message: 'my-message',
      parentCommitSha: 'parent-commit-sha',
      changes: [{ path: 'file.txt', content: 'my-content' }],
    });
    expect(commit.sha).toBe('new-commit-sha');

    expect(gheClient.request).toHaveBeenCalledTimes(3);
    expect(gheClient.request).toHaveBeenNthCalledWith(1, '/repos/org/repo/git/commits/parent-commit-sha');
    expect(gheClient.request).toHaveBeenNthCalledWith(2, '/repos/org/repo/git/trees', 'POST', {
      base_tree: 'parent-tree-sha',
      tree: [{ path: 'file.txt', content: 'my-content', mode: '100644', type: 'blob' }],
    });
    expect(gheClient.request).toHaveBeenNthCalledWith(3, '/repos/org/repo/git/commits', 'POST', {
      parents: ['parent-commit-sha'],
      message: 'my-message',
      tree: 'new-tree-sha',
    });
  });

  it('should create a commit with binary and text data', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');

    jest
      .spyOn(gheClient, 'request')
      .mockResolvedValueOnce({ tree: { sha: 'parent-tree-sha' } })
      .mockResolvedValueOnce({ sha: 'new-blob-sha' })
      .mockResolvedValueOnce({ sha: 'new-tree-sha' })
      .mockResolvedValueOnce({ sha: 'new-commit-sha' });

    const commit = await gheClient.createCommit({
      org: 'org',
      repo: 'repo',
      message: 'my-message',
      parentCommitSha: 'parent-commit-sha',
      changes: [
        {
          path: 'file.txt',
          content: 'my-content',
        },
        {
          path: 'binary.txt',
          content: new Uint8Array([0x41, 0x42, 0x43]),
        },
      ],
    });
    expect(commit.sha).toBe('new-commit-sha');

    expect(gheClient.request).toHaveBeenCalledTimes(4);
    expect(gheClient.request).toHaveBeenNthCalledWith(1, '/repos/org/repo/git/commits/parent-commit-sha');
    expect(gheClient.request).toHaveBeenNthCalledWith(2, '/repos/org/repo/git/blobs', 'POST', {
      content: btoa(String.fromCharCode(0x41, 0x42, 0x43)),
      encoding: 'base64',
    });
    expect(gheClient.request).toHaveBeenNthCalledWith(3, '/repos/org/repo/git/trees', 'POST', {
      base_tree: 'parent-tree-sha',
      tree: [
        {
          path: 'file.txt',
          content: 'my-content',
          mode: '100644',
          type: 'blob',
        },
        {
          path: 'binary.txt',
          sha: 'new-blob-sha',
          mode: '100644',
          type: 'blob',
        },
      ],
    });
    expect(gheClient.request).toHaveBeenNthCalledWith(4, '/repos/org/repo/git/commits', 'POST', {
      parents: ['parent-commit-sha'],
      message: 'my-message',
      tree: 'new-tree-sha',
    });
  });

  it('should create a PR for a branch', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');

    jest.spyOn(gheClient, 'request').mockResolvedValueOnce({ number: 3 });

    const { number } = await gheClient.createPullRequestWithBranch({
      org: 'org',
      repo: 'repo',
      title: 'My PR',
      body: 'my pr body',
      branch: 'my-branch',
    });
    expect(number).toBe(3);

    expect(gheClient.request).toHaveBeenCalledTimes(1);
    expect(gheClient.request).toHaveBeenCalledWith('/repos/org/repo/pulls', 'POST', {
      title: 'My PR',
      body: 'my pr body',
      base: 'master',
      head: 'my-branch',
    });
  });

  it('should create a PR with contents', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');
    const opts = { org: 'org', repo: 'repo' };

    jest.spyOn(gheClient, 'getSha').mockResolvedValueOnce('base-sha');
    jest.spyOn(gheClient, 'createCommit').mockResolvedValueOnce({ sha: 'new-commit-sha' });
    jest.spyOn(gheClient, 'getUserInfo').mockResolvedValueOnce({ login: 'my-user' });
    jest.spyOn(gheClient, 'createBranch').mockResolvedValueOnce();
    jest.spyOn(gheClient, 'createPullRequestWithBranch').mockResolvedValueOnce({ number: 4 });

    const { number } = await gheClient.createPullRequest({
      ...opts,
      title: 'My PR',
      body: 'my pr body',
      base: 'my-master',
      changes: [
        {
          path: 'file.txt',
          content: 'my-contents',
        },
      ],
    });
    expect(number).toBe(4);

    expect(gheClient.getSha).toHaveBeenCalledTimes(1);
    expect(gheClient.getSha).toHaveBeenCalledWith({ ...opts, ref: 'heads/my-master' });
    expect(gheClient.createCommit).toHaveBeenCalledTimes(1);
    expect(gheClient.createCommit).toHaveBeenCalledWith({
      ...opts,
      parentCommitSha: 'base-sha',
      message: 'My PR',
      changes: [
        {
          path: 'file.txt',
          content: 'my-contents',
        },
      ],
    });
    expect(gheClient.getUserInfo).toHaveBeenCalledTimes(1);
    expect(gheClient.createBranch).toHaveBeenCalledTimes(1);
    expect(gheClient.createBranch).toHaveBeenCalledWith({
      ...opts,
      branch: expect.stringMatching(/^my-user\/patch-[a-z0-9]{4}$/),
      sha: 'new-commit-sha',
    });
    expect(gheClient.createPullRequestWithBranch).toHaveBeenCalledTimes(1);
    expect(gheClient.createPullRequestWithBranch).toHaveBeenCalledWith({
      ...opts,
      base: 'my-master',
      branch: gheClient.createBranch.mock.calls[0][0].branch,
      title: 'My PR',
      body: 'my pr body',
    });
  });

  it('should get user info', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');

    fetch.mockResponseOnce(JSON.stringify({ id: 'my-user' }), { status: 200 });
    await expect(gheClient.getUserInfo('abc')).resolves.toEqual({ id: 'my-user' });
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('token access-token');
  });

  it('should handle errors when getting user info', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');

    fetch.mockResponseOnce(JSON.stringify({ message: 'user not found' }), { status: 404, statusText: 'NOPE' });
    await expect(gheClient.getUserInfo('abc')).rejects.toMatchObject({
      name: 'GheError',
      message: 'Failed to do authenticated GHE request: 404 NOPE',
      status: 404,
      statusText: 'NOPE',
      body: {
        message: 'user not found',
      },
    });
  });
});

describe('checkScopes', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('should be true if all scopes are present in headers', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');
    fetch.mockResponseOnce(JSON.stringify({ id: 'my-user' }), {
      headers: { 'X-OAuth-Scopes': 'abc, def, ghe' },
      status: 200,
    });
    await expect(gheClient.verifyUserHasScopes(['abc', 'def'])).resolves.toEqual(true);
  });
  it('should be false if some scopes are missing in headers', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');
    fetch.mockResponseOnce(JSON.stringify({ id: 'my-user' }), {
      headers: { 'X-OAuth-Scopes': 'abc, def' },
      status: 200,
    });
    await expect(gheClient.verifyUserHasScopes(['abc', 'def', 'ghe'])).resolves.toEqual(false);
  });
  it('should be false if some scopes are missing in headers but are substrings of others', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');
    fetch.mockResponseOnce(JSON.stringify({ id: 'my-user' }), {
      headers: { 'X-OAuth-Scopes': 'abc, defg' },
      status: 200,
    });
    await expect(gheClient.verifyUserHasScopes(['abc', 'ef'])).resolves.toEqual(false);
  });
  it('should be false there are no scopes', async () => {
    const gheClient = GheClient.fromAccessToken('access-token');
    fetch.mockResponseOnce(JSON.stringify({ id: 'my-user' }), {
      status: 200,
    });
    await expect(gheClient.verifyUserHasScopes(['abc', 'def', 'ghe'])).resolves.toEqual(false);
  });
});
