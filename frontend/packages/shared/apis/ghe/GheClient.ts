import { urls } from 'shared/apis/baseUrls';
import {
  GheApi,
  UserInfoResponse,
  CommitResponse,
  FileResponse,
  PullRequestResponse,
  GetCommitOptions,
  GetShaOptions,
  GetFileOptions,
  CreateBranchOptions,
  CreateCommitOptions,
  CreatePullRequestWithBranchOptions,
  GetPullRequestOptions,
  CreatePullRequestOptions,
  isGheError,
} from './types';

async function blobToBase64(blob: Blob | File): Promise<string> {
  const reader = new FileReader();
  const readerPromise = new Promise((resolve, reject) => {
    reader.onload = () => resolve();
    reader.onerror = error => reject(error);
    reader.onabort = () => reject(new Error('file reader was aborted'));
  });

  reader.readAsDataURL(blob);
  await readerPromise;

  const dataUri = reader.result as string;
  const base64Data = dataUri.replace(/data:[^;]+;base64,/, '');
  return base64Data;
}

export default class GheClient implements GheApi {
  private readonly baseUrl: string;
  private readonly fetchOptions: object;

  static fromAccessToken(accessToken: string) {
    return new GheClient(urls.ghe, accessToken);
  }

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = `${baseUrl}/api/v3`;
    this.fetchOptions = {
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `token ${accessToken}`,
      },
    };
  }

  getUserInfo = async (): Promise<UserInfoResponse> => {
    return this.request('/user');
  };

  verifyUserHasScopes = async (requiredScopes: string[]): Promise<boolean> => {
    const res = await fetch(`${this.baseUrl}/user`, {
      ...this.fetchOptions,
      method: 'GET',
    });
    if (!res.ok) {
      await this.handleError(res);
    } else {
      const scopes = res.headers.get('X-OAuth-Scopes');
      if (!scopes) {
        return false;
      }
      const scopesList = scopes.split(',').map(scope => scope.trim());
      if (requiredScopes.every(scope => scopesList.includes(scope))) {
        return true;
      }
    }
    return false;
  };

  getCommit = async ({ org, repo, sha }: GetCommitOptions): Promise<CommitResponse> => {
    return this.request(`/repos/${org}/${repo}/commits/${sha}`);
  };

  getSha = async ({ org, repo, ref = 'heads/master' }: GetShaOptions): Promise<string> => {
    const data = await this.request(`/repos/${org}/${repo}/git/refs/${ref}`);
    return data.object.sha;
  };

  getFile = async ({ repo, org, path, sha = undefined }: GetFileOptions): Promise<FileResponse> => {
    const body = await this.request(`/repos/${org}/${repo}/contents/${path}${sha ? `?ref=${sha}` : ''}`);

    const { content, encoding, ...rest } = body;

    let plainContent = content;
    if (encoding === 'base64') {
      // escape + decodeURIComponent avoids character encoding issues since the contents are utf-8
      plainContent = decodeURIComponent(escape(atob(content)));
    }

    return { content: plainContent, ...rest };
  };

  /** Creates a new branch pointing to a commit sha. Will fail with a ConflictError if the branch already exists. */
  private createBranch = async ({ org, repo, branch, sha }: CreateBranchOptions): Promise<void> => {
    try {
      await this.request(`/repos/${org}/${repo}/git/refs`, 'POST', {
        ref: `refs/heads/${branch}`,
        sha,
      });
    } catch (error) {
      if (isGheError(error) && error.body.message === 'Reference already exists') {
        const error = new Error(`Branch '${branch}' already exists`);
        error.name = 'ConflictError';
        throw error;
      }

      throw error;
    }
  };

  /**
   * Creates a new commit given a set of changes to files in the repo and a parent commit.
   *
   * This will throw an error with the name `"EmptyCommitError"` if the commit doesn't have any changes.
   */
  private createCommit = async ({
    org,
    repo,
    parentCommitSha,
    message,
    changes,
  }: CreateCommitOptions): Promise<CommitResponse> => {
    const { tree: parentTree } = await this.request(`/repos/${org}/${repo}/git/commits/${parentCommitSha}`);

    // Iterate through changes and upload all binary data as blobs
    const blobUpdates = await Promise.all(
      changes.map(async ({ path, content }) => {
        if (typeof content === 'string') {
          // Strings just work, character encoding doesn't seem to be an issue
          return { path, content, mode: '100644', type: 'blob' };
        }

        if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
          content = new Blob([content], { type: 'application/octet-stream' });
        }

        if (!(content instanceof Blob)) {
          throw new TypeError(`change content must be a string, typed array, or blob, got ${content}`);
        }

        const { sha } = await this.request(`/repos/${org}/${repo}/git/blobs`, 'POST', {
          content: await blobToBase64(content),
          encoding: 'base64',
        });

        return { path, sha, mode: '100644', type: 'blob' };
      }),
    );

    const tree = await this.request(`/repos/${org}/${repo}/git/trees`, 'POST', {
      base_tree: parentTree.sha,
      tree: blobUpdates,
    });

    if (parentTree.sha === tree.sha) {
      const error = new Error('Commit is empty');
      error.name = 'EmptyCommitError';
      throw error;
    }

    const commit = await this.request(`/repos/${org}/${repo}/git/commits`, 'POST', {
      parents: [parentCommitSha],
      message,
      tree: tree.sha,
    });

    return commit;
  };

  /**
   * Creates a pull request given a feature branch.
   * This is a lower level than createPullRequest where you need to supply the branch with changes yourself.
   */
  private createPullRequestWithBranch = async ({
    org,
    repo,
    base = 'master',
    title,
    body = undefined,
    branch,
  }: CreatePullRequestWithBranchOptions): Promise<PullRequestResponse> => {
    return this.request(`/repos/${org}/${repo}/pulls`, 'POST', { base, head: branch, title, body });
  };

  getPullRequest = async ({ org, repo, number }: GetPullRequestOptions): Promise<PullRequestResponse> => {
    return this.request(`/repos/${org}/${repo}/pulls/${number}`);
  };

  createPullRequest = async ({
    org,
    repo,
    base = 'master',
    title,
    body = undefined,
    parentCommitSha = undefined,
    changes,
  }: CreatePullRequestOptions): Promise<PullRequestResponse> => {
    if (!parentCommitSha) {
      parentCommitSha = await this.getSha({ org, repo, ref: `heads/${base}` });
    }

    const commit = await this.createCommit({ org, repo, parentCommitSha, message: title, changes });

    const { login } = await this.getUserInfo();

    // Keep trying to create a branch until we find one that doesn't exist
    for (;;) {
      const suffix = Math.random()
        .toString(36)
        .slice(2, 6);
      let branch = `${login}/patch-${suffix}`;

      try {
        await this.createBranch({ org, repo, branch, sha: commit.sha });
      } catch (error) {
        if (error.name === 'ConflictError') {
          continue;
        }
        throw error;
      }

      return await this.createPullRequestWithBranch({ org, repo, base, branch, title, body });
    }
  };

  request = async (
    path: string,
    method: 'GET' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: object,
  ): Promise<any> => {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...this.fetchOptions,
      method,
      body: body && JSON.stringify(body),
    });
    if (!res.ok) {
      await this.handleError(res);
    }
    return await res.json();
  };

  private async handleError(res: Response) {
    const error: any = new Error(`Failed to do authenticated GHE request: ${res.status} ${res.statusText}`);
    error.name = 'GheError';
    error.status = res.status;
    error.statusText = res.statusText;
    error.body = await res.json();
    throw error;
  }
}
