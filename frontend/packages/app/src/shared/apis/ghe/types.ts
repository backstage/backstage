import { Api } from 'shared/pluginApi';

/**
 * This API provides a way to talk to the GitHub Enterprise API, for both reading and writing to repos.
 *
 * A GHE Client instance is acquired using the `withGheAuth` HOC:
 *
 * ```typescript
 * const MyComponent = ({gheApi}) => {
 *   console.log('gheApi', gheApi);
 *
 *   return ...;
 * }
 *
 * export default withGheAuth()(MyComponent);
 * ```
 *
 * See https://backstage.spotify.net/docs/backstage-frontend/apis/#ghe-api for more examples.
 */
export type GheApi = {
  /** Get information about the currently logged in user. */
  getUserInfo(): Promise<UserInfoResponse>;

  /** Verify that the user has authenticated with scopes. */
  verifyUserHasScopes(scope: string[]): Promise<boolean>;

  /** Get the commit information for a commit sha. */
  getCommit(options: GetCommitOptions): Promise<CommitResponse>;

  /** Get the commit sha of a ref. */
  getSha(options: GetShaOptions): Promise<string>;

  /** Fetches a single file (blob) from a commit, including it's contents. Defaults to the tip of the default branch. */
  getFile(options: GetFileOptions): Promise<FileResponse>;

  /**
   * Get a pull request by it's number in a repo.
   */
  getPullRequest(options: GetPullRequestOptions): Promise<PullRequestResponse>;

  /**
   * Create a pull request given a set of changes to files in the repo.
   * This method takes care of creating a branch and commit for you.
   *
   * The generated branch will be named using the template <username>/patch-<random-chars>
   *
   * This will throw an error with the name `"EmptyCommitError"` if the PR would've been created without any changes.
   */
  createPullRequest(options: CreatePullRequestOptions): Promise<PullRequestResponse>;

  /** Sends a request to GHE v3 rest API, e.g. /user, defaults to GET with empty body. */
  request(path: string, method?: 'GET' | 'PATCH' | 'POST' | 'PUT' | 'DELETE', body?: object): Promise<any>;
};

export const gheApiToken = new Api<GheApi>({
  id: 'ghe',
  title: 'GHE',
  description: 'Enables you to talk to GHE, both reading repo contents and creating PRs',
});

/** These are the most interesting fields of the response, for the full response, see https://developer.github.com/v3/users/#get-a-single-user */
export type UserInfoResponse = {
  // The username of the user.
  login: string;

  // The email of the user.
  email: string;
};

/** These are the most interesting fields of the response, for the full response, see https://developer.github.com/v3/git/commits/#get-a-commit */
export type CommitResponse = {
  // The sha of the commit.
  sha: string;

  // The commit message.
  message: string;

  // The tree (working dir contents) of the commit.
  tree: { sha: string };

  // The parents of the commits.
  parents: Array<{ sha: string }>;

  // The commit author.
  author: { date: string; name: string; email: string };

  // The committer.
  committer: { date: string; name: string; email: string };
};

/**
 * These are the most interesting fields of the response.
 *
 * For the full response, see https://developer.github.com/v3/repos/contents/#get-contents
 *
 * This type differs from the API response in that content is always plain text (base64 decoded), and the encoding field is removed.
 */
export type FileResponse = {
  // Size of the file in bytes.
  size: number;

  // Name of the file without the path.
  name: string;

  // Path to the file.
  path: string;

  // Contents of the file.
  content: string;

  // Sha of the file (blob) contents.
  sha: string;

  // Link to the file in GHE.
  html_url: string;

  // Download URL for the file.
  download_url: string;
};

/** These are the most interesting fields of the response, for the full response, see https://developer.github.com/v3/pulls/#get-a-single-pull-request */
export type PullRequestResponse = {
  // The PR #
  number: number;

  // Link to the PR in GHE
  html_url: string;

  // Title of the PR
  title: string;
  // Body of the PR
  body: string;

  // The state of the PR.
  state: 'open' | 'closed';

  // Time the PR was created at, e.g. '2011-01-26T19:01:12Z'
  created_at: string;

  // Number of commits in the PR.
  commits: number;

  // Lines added by the PR.
  additions: number;
  // Lines removed by the PR.
  deletions: number;
  // Number of files changed by the PR.
  changed_files: number;
};

export type BaseOptions = {
  // The org, e.g. 'backstage'
  org: string;

  // The repo, e.g. 'backstage-frontend'
  repo: string;
};

export type GetCommitOptions = BaseOptions & {
  // The sha of the commit.
  sha: string;
};

export type GetShaOptions = BaseOptions & {
  // The ref the fetch the commit sha for, defaults to 'heads/master'
  ref?: string;
};

export type GetFileOptions = BaseOptions & {
  // The path to the file. e.g. 'docs/README.md'
  path: string;

  // The commit sha to get the file from, defaults to master.
  sha?: string;
};

export type CreateBranchOptions = BaseOptions & {
  // The name of the branch.
  branch: string;

  // The commit sha that the branch should point to.
  sha: string;
};

export type CreateCommitOptions = BaseOptions & {
  // The sha of the parent commit that this commit should be created on top of.
  parentCommitSha: string;

  // The commit message.
  message: string;

  // A list of changes to include in this commit.
  changes: Change[];
};

export type CreatePullRequestWithBranchOptions = BaseOptions & {
  // The base branch to send the PR towards, defaults to 'master'.
  base?: string;

  // The title of the PR.
  title: string;

  // The body of the PR.
  body?: string;

  // The name of the branch to create a PR for.
  branch: string;
};

export type GetPullRequestOptions = BaseOptions & {
  // The PR #
  number: number;
};

export type CreatePullRequestOptions = BaseOptions & {
  // The base branch to send the PR towards, defaults to 'master'.
  base?: string;

  // The title of the PR.
  title: string;

  // The body of the PR.
  body?: string;

  // If this is specified it will be used as the parent commit sha, instead of
  // using the tip of the base branch.
  //
  // It is best to specify this if it is available, since you might override
  // recent changes to master otherwise. And it should always be used when
  // writing to files that are modified frequently.
  parentCommitSha?: string;

  // A list of changes that will be included in the PR.
  changes: Change[];
};

/**
 * Change describes a modification to a file in a repo.
 *
 * If the file doesn't exist it will be created, and if it exists it will be overwritten.
 *
 * Change is used by createCommit and createPullRequest to describe changes it should include.
 */
export type Change = {
  // The path to the file to change.
  path: string;

  // The new contents of the file.
  content: string | ArrayBuffer | ArrayBufferView | Blob | File;
};

export type GheError = Error & {
  name: 'GheError';
  status: number;
  statusText: string;
  body: {
    message: string;
  };
};

export function isGheError(error: Error): error is GheError {
  return error.name === 'GheError';
}
