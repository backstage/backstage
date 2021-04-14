/*
 * Copyright 2021 Spotify AB
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

// export interface Project {
//   /**
//    * Repository's owner (user or organisation)
//    *
//    * @example erikengervall
//    */
//   owner: string;

//   /**
//    * Repository's name
//    *
//    * @example dockest
//    */
//   repo: string;

//   /**
//    * Declares the versioning strategy of the project
//    *
//    * semver: `1.2.3` (major.minor.patch)
//    * calver: `2020.01.01_0` (YYYY.0M.0D_patch)
//    *
//    * Default: false
//    */
//   versioningStrategy: 'calver' | 'semver';
// }

interface ComponentConfig<Args = void> {
  successCb?: (args: Args) => Promise<void> | void;
  omit?: boolean;
}

export interface ComponentConfigCreateRcSuccessCbArgs {
  gitHubReleaseUrl: string;
  gitHubReleaseName: string;
  comparisonUrl: string;
  previousTag?: string;
  createdTag: string;
}
export type ComponentConfigCreateRc = ComponentConfig<ComponentConfigCreateRcSuccessCbArgs>;

export interface ComponentConfigPromoteRcSuccessCbArgs {
  gitHubReleaseUrl: string;
  gitHubReleaseName: string;
  previousTagUrl: string;
  previousTag: string;
  updatedTagUrl: string;
  updatedTag: string;
}
export type ComponentConfigPromoteRc = ComponentConfig<ComponentConfigPromoteRcSuccessCbArgs>;

export interface ComponentConfigPatchSuccessCbArgs {
  updatedReleaseUrl: string;
  updatedReleaseName: string;
  previousTag: string;
  patchedTag: string;
  patchCommitUrl: string;
  patchCommitMessage: string;
}
export type ComponentConfigPatch = ComponentConfig<ComponentConfigPatchSuccessCbArgs>;

export type SetRefetch = React.Dispatch<React.SetStateAction<number>>;

export interface ResponseStep {
  message: string | React.ReactNode;
  secondaryMessage?: string | React.ReactNode;
  link?: string;
  icon?: 'success' | 'failure';
}

/** ********************************
 ******** GitHub API Types *********
 ***********************************/
export interface GhCompareCommitsResponse {
  /** @example 'https://api.github.com/repos/octocat/Hello-World/compare/master...topic'; */
  url: string;
  /** @example 'https://github.com/octocat/Hello-World/compare/master...topic'; */
  html_url: string;
  /** @example 'https://github.com/octocat/Hello-World/compare/octocat:bbcd538c8e72b8c175046e27cc8f907076331401...octocat:0328041d1152db8ae77652d1618a02e57f745f17'; */
  permalink_url: string;
  /** @example 'https://github.com/octocat/Hello-World/compare/master...topic.diff'; */
  diff_url: string;
  /** @example 'https://github.com/octocat/Hello-World/compare/master...topic.patch'; */
  patch_url: string;
  base_commit: {
    /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
    url: string;
    /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
    sha: string;
    /** @example 'MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ=='; */
    node_id: string;
    /** @example 'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
    html_url: string;
    /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments'; */
    comments_url: string;
    commit: {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      url: string;
      author: {
        /** @example 'Monalisa Octocat'; */
        name: string;
        /** @example 'support@github.com'; */
        email: string;
        /** @example '2011-04-14T16:00:49Z'; */
        date: string;
      };
      committer: {
        /** @example 'Monalisa Octocat'; */
        name: string;
        /** @example 'support@github.com'; */
        email: string;
        /** @example '2011-04-14T16:00:49Z'; */
        date: string;
      };
      /** @example 'Fix all the bugs'; */
      message: string;
      tree: {
        /** @example 'https://api.github.com/repos/octocat/Hello-World/tree/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        url: string;
        /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        sha: string;
      };
      comment_count: number;
      verification: {
        verified: boolean;
        /** @example 'unsigned'; */
        reason: string;
        signature: null | any;
        payload: null | any;
      };
    };
    author: {
      /** @example 'octocat'; */
      login: string;
      id: number;
      /** @example 'MDQ6VXNlcjE='; */
      node_id: string;
      /** @example 'https://github.com/images/error/octocat_happy.gif'; */
      avatar_url: string;
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      /** @example 'https://github.com/octocat'; */
      html_url: string;
      /** @example 'https://api.github.com/users/octocat/followers'; */
      followers_url: string;
      /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
      following_url: string;
      /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
      gists_url: string;
      /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
      starred_url: string;
      /** @example 'https://api.github.com/users/octocat/subscriptions'; */
      subscriptions_url: string;
      /** @example 'https://api.github.com/users/octocat/orgs'; */
      organizations_url: string;
      /** @example 'https://api.github.com/users/octocat/repos'; */
      repos_url: string;
      /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
      events_url: string;
      /** @example 'https://api.github.com/users/octocat/received_events'; */
      received_events_url: string;
      /** @example 'User'; */
      type: string;
      site_admin: boolean;
    };
    committer: {
      /** @example 'octocat'; */
      login: string;
      id: number;
      /** @example 'MDQ6VXNlcjE='; */
      node_id: string;
      /** @example 'https://github.com/images/error/octocat_happy.gif'; */
      avatar_url: string;
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      /** @example 'https://github.com/octocat'; */
      html_url: string;
      /** @example 'https://api.github.com/users/octocat/followers'; */
      followers_url: string;
      /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
      following_url: string;
      /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
      gists_url: string;
      /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
      starred_url: string;
      /** @example 'https://api.github.com/users/octocat/subscriptions'; */
      subscriptions_url: string;
      /** @example 'https://api.github.com/users/octocat/orgs'; */
      organizations_url: string;
      /** @example 'https://api.github.com/users/octocat/repos'; */
      repos_url: string;
      /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
      events_url: string;
      /** @example 'https://api.github.com/users/octocat/received_events'; */
      received_events_url: string;
      /** @example 'User'; */
      type: string;
      site_admin: boolean;
    };
    parents: [
      {
        /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        url: string;
        /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        sha: string;
      },
    ];
  };
  merge_base_commit: {
    /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
    url: string;
    /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
    sha: string;
    /** @example 'MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ=='; */
    node_id: string;
    /** @example 'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
    html_url: string;
    /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments'; */
    comments_url: string;
    commit: {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      url: string;
      author: {
        /** @example 'Monalisa Octocat'; */
        name: string;
        /** @example 'support@github.com'; */
        email: string;
        /** @example '2011-04-14T16:00:49Z'; */
        date: string;
      };
      committer: {
        /** @example 'Monalisa Octocat'; */
        name: string;
        /** @example 'support@github.com'; */
        email: string;
        /** @example '2011-04-14T16:00:49Z'; */
        date: string;
      };
      /** @example 'Fix all the bugs'; */
      message: string;
      tree: {
        /** @example 'https://api.github.com/repos/octocat/Hello-World/tree/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        url: string;
        /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        sha: string;
      };
      comment_count: number;
      verification: {
        verified: boolean;
        /** @example 'unsigned'; */
        reason: string;
        signature: null | any;
        payload: null | any;
      };
    };
    author: {
      /** @example 'octocat'; */
      login: string;
      id: number;
      /** @example 'MDQ6VXNlcjE='; */
      node_id: string;
      /** @example 'https://github.com/images/error/octocat_happy.gif'; */
      avatar_url: string;
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      /** @example 'https://github.com/octocat'; */
      html_url: string;
      /** @example 'https://api.github.com/users/octocat/followers'; */
      followers_url: string;
      /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
      following_url: string;
      /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
      gists_url: string;
      /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
      starred_url: string;
      /** @example 'https://api.github.com/users/octocat/subscriptions'; */
      subscriptions_url: string;
      /** @example 'https://api.github.com/users/octocat/orgs'; */
      organizations_url: string;
      /** @example 'https://api.github.com/users/octocat/repos'; */
      repos_url: string;
      /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
      events_url: string;
      /** @example 'https://api.github.com/users/octocat/received_events'; */
      received_events_url: string;
      /** @example 'User'; */
      type: string;
      site_admin: boolean;
    };
    committer: {
      /** @example 'octocat'; */
      login: string;
      id: number;
      /** @example 'MDQ6VXNlcjE='; */
      node_id: string;
      /** @example 'https://github.com/images/error/octocat_happy.gif'; */
      avatar_url: string;
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      /** @example 'https://github.com/octocat'; */
      html_url: string;
      /** @example 'https://api.github.com/users/octocat/followers'; */
      followers_url: string;
      /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
      following_url: string;
      /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
      gists_url: string;
      /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
      starred_url: string;
      /** @example 'https://api.github.com/users/octocat/subscriptions'; */
      subscriptions_url: string;
      /** @example 'https://api.github.com/users/octocat/orgs'; */
      organizations_url: string;
      /** @example 'https://api.github.com/users/octocat/repos'; */
      repos_url: string;
      /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
      events_url: string;
      /** @example 'https://api.github.com/users/octocat/received_events'; */
      received_events_url: string;
      /** @example 'User'; */
      type: string;
      site_admin: boolean;
    };
    parents: [
      {
        /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        url: string;
        /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        sha: string;
      },
    ];
  };
  /** @example 'behind'; */
  status: string;
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  commits: [
    {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      url: string;
      /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      sha: string;
      /** @example 'MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ=='; */
      node_id: string;
      /** @example 'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      html_url: string;
      /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments'; */
      comments_url: string;
      commit: {
        /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
        url: string;
        author: {
          /** @example 'Monalisa Octocat'; */
          name: string;
          /** @example 'support@github.com'; */
          email: string;
          /** @example '2011-04-14T16:00:49Z'; */
          date: string;
        };
        committer: {
          /** @example 'Monalisa Octocat'; */
          name: string;
          /** @example 'support@github.com'; */
          email: string;
          /** @example '2011-04-14T16:00:49Z'; */
          date: string;
        };
        /** @example 'Fix all the bugs'; */
        message: string;
        tree: {
          /** @example 'https://api.github.com/repos/octocat/Hello-World/tree/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
          url: string;
          /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
          sha: string;
        };
        comment_count: number;
        verification: {
          verified: boolean;
          /** @example 'unsigned'; */
          reason: string;
          signature: null | any;
          payload: null | any;
        };
      };
      author: {
        /** @example 'octocat'; */
        login: string;
        id: number;
        /** @example 'MDQ6VXNlcjE='; */
        node_id: string;
        /** @example 'https://github.com/images/error/octocat_happy.gif'; */
        avatar_url: string;
        /** @example ''; */
        gravatar_id: string;
        /** @example 'https://api.github.com/users/octocat'; */
        url: string;
        /** @example 'https://github.com/octocat'; */
        html_url: string;
        /** @example 'https://api.github.com/users/octocat/followers'; */
        followers_url: string;
        /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
        following_url: string;
        /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
        gists_url: string;
        /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
        starred_url: string;
        /** @example 'https://api.github.com/users/octocat/subscriptions'; */
        subscriptions_url: string;
        /** @example 'https://api.github.com/users/octocat/orgs'; */
        organizations_url: string;
        /** @example 'https://api.github.com/users/octocat/repos'; */
        repos_url: string;
        /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
        events_url: string;
        /** @example 'https://api.github.com/users/octocat/received_events'; */
        received_events_url: string;
        /** @example 'User'; */
        type: string;
        site_admin: boolean;
      };
      committer: {
        /** @example 'octocat'; */
        login: string;
        id: number;
        /** @example 'MDQ6VXNlcjE='; */
        node_id: string;
        /** @example 'https://github.com/images/error/octocat_happy.gif'; */
        avatar_url: string;
        /** @example ''; */
        gravatar_id: string;
        /** @example 'https://api.github.com/users/octocat'; */
        url: string;
        /** @example 'https://github.com/octocat'; */
        html_url: string;
        /** @example 'https://api.github.com/users/octocat/followers'; */
        followers_url: string;
        /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
        following_url: string;
        /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
        gists_url: string;
        /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
        starred_url: string;
        /** @example 'https://api.github.com/users/octocat/subscriptions'; */
        subscriptions_url: string;
        /** @example 'https://api.github.com/users/octocat/orgs'; */
        organizations_url: string;
        /** @example 'https://api.github.com/users/octocat/repos'; */
        repos_url: string;
        /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
        events_url: string;
        /** @example 'https://api.github.com/users/octocat/received_events'; */
        received_events_url: string;
        /** @example 'User'; */
        type: string;
        site_admin: boolean;
      };
      parents: [
        {
          /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
          url: string;
          /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
          sha: string;
        },
      ];
    },
  ];
  files: [
    {
      /** @example 'bbcd538c8e72b8c175046e27cc8f907076331401'; */
      sha: string;
      /** @example 'file1.txt'; */
      filename: string;
      /** @example 'added'; */
      status: string;
      additions: number;
      deletions: number;
      changes: number;
      /** @example 'https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt'; */
      blob_url: string;
      /** @example 'https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt'; */
      raw_url: string;
      /** @example 'https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      contents_url: string;
      /** @example '@@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test'; */
      patch: string;
    },
  ];
}

export interface GhCreateReleaseResponse {
  /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/1'; */
  url: string;
  /** @example 'https://github.com/octocat/Hello-World/releases/v1.0.0'; */
  html_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/1/assets'; */
  assets_url: string;
  /** @example 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}'; */
  upload_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/tarball/v1.0.0'; */
  tarball_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/zipball/v1.0.0'; */
  zipball_url: string;
  id: number;
  /** @example 'MDc6UmVsZWFzZTE='; */
  node_id: string;
  /** @example 'v1.0.0'; */
  tag_name: string;
  /** @example 'master'; */
  target_commitish: string;
  /** @example 'v1.0.0'; */
  name: string;
  /** @example 'Description of the release'; */
  body: string;
  draft: boolean;
  prerelease: boolean;
  /** @example '2013-02-27T19:35:32Z'; */
  created_at: string;
  /** @example '2013-02-27T19:35:32Z'; */
  published_at: string;
  author: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  assets: any[];
}

export interface GhUpdateReleaseResponse {
  /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/1'; */
  url: string;
  /** @example 'https://github.com/octocat/Hello-World/releases/v1.0.0'; */
  html_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/1/assets'; */
  assets_url: string;
  /** @example 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}'; */
  upload_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/tarball/v1.0.0'; */
  tarball_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/zipball/v1.0.0'; */
  zipball_url: string;
  id: number;
  /** @example 'MDc6UmVsZWFzZTE='; */
  node_id: string;
  /** @example 'v1.0.0'; */
  tag_name: string;
  /** @example 'master'; */
  target_commitish: string;
  /** @example 'v1.0.0'; */
  name: string;
  /** @example 'Description of the release'; */
  body: string;
  draft: boolean;
  prerelease: boolean;
  /** @example '2013-02-27T19:35:32Z'; */
  created_at: string;
  /** @example '2013-02-27T19:35:32Z'; */
  published_at: string;
  author: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  assets: [
    {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/assets/1'; */
      url: string;
      /** @example 'https://github.com/octocat/Hello-World/releases/download/v1.0.0/example.zip'; */
      browser_download_url: string;
      id: number;
      /** @example 'MDEyOlJlbGVhc2VBc3NldDE='; */
      node_id: string;
      /** @example 'example.zip'; */
      name: string;
      /** @example 'short description'; */
      label: string;
      /** @example 'uploaded'; */
      state: string;
      /** @example 'application/zip'; */
      content_type: string;
      size: number;
      download_count: number;
      /** @example '2013-02-27T19:35:32Z'; */
      created_at: string;
      /** @example '2013-02-27T19:35:32Z'; */
      updated_at: string;
      uploader: {
        /** @example 'octocat'; */
        login: string;
        id: number;
        /** @example 'MDQ6VXNlcjE='; */
        node_id: string;
        /** @example 'https://github.com/images/error/octocat_happy.gif'; */
        avatar_url: string;
        /** @example ''; */
        gravatar_id: string;
        /** @example 'https://api.github.com/users/octocat'; */
        url: string;
        /** @example 'https://github.com/octocat'; */
        html_url: string;
        /** @example 'https://api.github.com/users/octocat/followers'; */
        followers_url: string;
        /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
        following_url: string;
        /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
        gists_url: string;
        /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
        starred_url: string;
        /** @example 'https://api.github.com/users/octocat/subscriptions'; */
        subscriptions_url: string;
        /** @example 'https://api.github.com/users/octocat/orgs'; */
        organizations_url: string;
        /** @example 'https://api.github.com/users/octocat/repos'; */
        repos_url: string;
        /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
        events_url: string;
        /** @example 'https://api.github.com/users/octocat/received_events'; */
        received_events_url: string;
        /** @example 'User'; */
        type: string;
        site_admin: boolean;
      };
    },
  ];
}

export interface GhGetReleaseResponse {
  /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/1'; */
  url: string;
  /** @example 'https://github.com/octocat/Hello-World/releases/v1.0.0'; */
  html_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/1/assets'; */
  assets_url: string;
  /** @example 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}'; */
  upload_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/tarball/v1.0.0'; */
  tarball_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/zipball/v1.0.0'; */
  zipball_url: string;
  id: number;
  /** @example 'MDc6UmVsZWFzZTE='; */
  node_id: string;
  /** @example 'v1.0.0'; */
  tag_name: string;
  /** @example 'master'; */
  target_commitish: string;
  /** @example 'v1.0.0'; */
  name: string;
  /** @example 'Description of the release'; */
  body: string;
  draft: boolean;
  prerelease: boolean;
  /** @example '2013-02-27T19:35:32Z'; */
  created_at: string;
  /** @example '2013-02-27T19:35:32Z'; */
  published_at: string;
  author: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  assets: [
    {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/releases/assets/1'; */
      url: string;
      /** @example 'https://github.com/octocat/Hello-World/releases/download/v1.0.0/example.zip'; */
      browser_download_url: string;
      id: number;
      /** @example 'MDEyOlJlbGVhc2VBc3NldDE='; */
      node_id: string;
      /** @example 'example.zip'; */
      name: string;
      /** @example 'short description'; */
      label: string;
      /** @example 'uploaded'; */
      state: string;
      /** @example 'application/zip'; */
      content_type: string;
      size: number;
      download_count: number;
      /** @example '2013-02-27T19:35:32Z'; */
      created_at: string;
      /** @example '2013-02-27T19:35:32Z'; */
      updated_at: string;
      uploader: {
        /** @example 'octocat'; */
        login: string;
        id: number;
        /** @example 'MDQ6VXNlcjE='; */
        node_id: string;
        /** @example 'https://github.com/images/error/octocat_happy.gif'; */
        avatar_url: string;
        /** @example ''; */
        gravatar_id: string;
        /** @example 'https://api.github.com/users/octocat'; */
        url: string;
        /** @example 'https://github.com/octocat'; */
        html_url: string;
        /** @example 'https://api.github.com/users/octocat/followers'; */
        followers_url: string;
        /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
        following_url: string;
        /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
        gists_url: string;
        /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
        starred_url: string;
        /** @example 'https://api.github.com/users/octocat/subscriptions'; */
        subscriptions_url: string;
        /** @example 'https://api.github.com/users/octocat/orgs'; */
        organizations_url: string;
        /** @example 'https://api.github.com/users/octocat/repos'; */
        repos_url: string;
        /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
        events_url: string;
        /** @example 'https://api.github.com/users/octocat/received_events'; */
        received_events_url: string;
        /** @example 'User'; */
        type: string;
        site_admin: boolean;
      };
    },
  ];
}

export interface GhGetCommitResponse {
  /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
  url: string;
  /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
  sha: string;
  /** @example 'MDY6Q29tbWl0NmRjYjA5YjViNTc4NzVmMzM0ZjYxYWViZWQ2OTVlMmU0MTkzZGI1ZQ=='; */
  node_id: string;
  /** @example 'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
  html_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e/comments'; */
  comments_url: string;
  commit: {
    /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
    url: string;
    author: {
      /** @example 'Monalisa Octocat'; */
      name: string;
      /** @example 'support@github.com'; */
      email: string;
      /** @example '2011-04-14T16:00:49Z'; */
      date: string;
    };
    committer: {
      /** @example 'Monalisa Octocat'; */
      name: string;
      /** @example 'support@github.com'; */
      email: string;
      /** @example '2011-04-14T16:00:49Z'; */
      date: string;
    };
    /** @example 'Fix all the bugs'; */
    message: string;
    tree: {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/tree/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      url: string;
      /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      sha: string;
    };
    comment_count: number;
    verification: {
      verified: boolean;
      /** @example 'unsigned'; */
      reason: string;
      signature: null | any;
      payload: null | any;
    };
  };
  author: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  committer: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  parents: [
    {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      url: string;
      /** @example '6dcb09b5b57875f334f61aebed695e2e4193db5e'; */
      sha: string;
    },
  ];
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files: [
    {
      /** @example 'file1.txt'; */
      filename: string;
      additions: number;
      deletions: number;
      changes: number;
      /** @example 'modified'; */
      status: string;
      /** @example 'https://github.com/octocat/Hello-World/raw/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt'; */
      raw_url: string;
      /** @example 'https://github.com/octocat/Hello-World/blob/7ca483543807a51b6079e54ac4cc392bc29ae284/file1.txt'; */
      blob_url: string;
      /** @example '@@ -29,7 +29,7 @@\n.....'; */
      patch: string;
    },
  ];
}

export interface GhGetBranchResponse {
  /** @example 'master'; */
  name: string;
  commit: {
    /** @example '7fd1a60b01f91b314f59955a4e4d4e80d8edf11d'; */
    sha: string;
    /** @example 'MDY6Q29tbWl0N2ZkMWE2MGIwMWY5MWIzMTRmNTk5NTVhNGU0ZDRlODBkOGVkZjExZA=='; */
    node_id: string;
    commit: {
      author: {
        /** @example 'The Octocat'; */
        name: string;
        /** @example '2012-03-06T15:06:50-08:00'; */
        date: string;
        /** @example 'octocat@nowhere.com'; */
        email: string;
      };
      /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d'; */
      url: string;
      /** @example 'Merge pull request #6 from Spaceghost/patch-1\n\nNew line at end of file.'; */
      message: string;
      tree: {
        /** @example 'b4eecafa9be2f2006ce1b709d6857b07069b4608'; */
        sha: string;
        /** @example 'https://api.github.com/repos/octocat/Hello-World/git/trees/b4eecafa9be2f2006ce1b709d6857b07069b4608'; */
        url: string;
      };
      committer: {
        /** @example 'The Octocat'; */
        name: string;
        /** @example '2012-03-06T15:06:50-08:00'; */
        date: string;
        /** @example 'octocat@nowhere.com'; */
        email: string;
      };
      verification: {
        verified: boolean;
        /** @example 'unsigned'; */
        reason: string;
        signature: null | any;
        payload: null | any;
      };
    };
    author: {
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://secure.gravatar.com/avatar/7ad39074b0584bc555d0417ae3e7d974?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png'; */
      avatar_url: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      id: number;
      /** @example 'octocat'; */
      login: string;
    };
    parents: [
      {
        /** @example '553c2077f0edc3d5dc5d17262f6aa498e69d6f8e'; */
        sha: string;
        /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e'; */
        url: string;
      },
      {
        /** @example '762941318ee16e59dabbacb1b4049eec22f0d303'; */
        sha: string;
        /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/762941318ee16e59dabbacb1b4049eec22f0d303'; */
        url: string;
      },
    ];
    /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d'; */
    url: string;
    committer: {
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://secure.gravatar.com/avatar/7ad39074b0584bc555d0417ae3e7d974?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png'; */
      avatar_url: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      id: number;
      /** @example 'octocat'; */
      login: string;
    };
  };
  _links: {
    /** @example 'https://github.com/octocat/Hello-World/tree/master'; */
    html: string;
    /** @example 'https://api.github.com/repos/octocat/Hello-World/branches/master'; */
    self: string;
  };
  protected: boolean;
  protection: {
    enabled: boolean;
    required_status_checks: {
      /** @example 'non_admins'; */
      enforcement_level: string;
      /** @example ['ci-test', 'linter'] */
      contexts: string[];
    };
  };
  /** @example 'https://api.github.com/repos/octocat/hello-world/branches/master/protection'; */
  protection_url: string;
}

export interface GhCreateCommitResponse {
  /** @example '7638417db6d59f3c431d3e1f261cc637155684cd'; */
  sha: string;
  /** @example 'MDY6Q29tbWl0NzYzODQxN2RiNmQ1OWYzYzQzMWQzZTFmMjYxY2M2MzcxNTU2ODRjZA=='; */
  node_id: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd'; */
  url: string;
  author: {
    /** @example '2014-11-07T22:01:45Z'; */
    date: string;
    /** @example 'Monalisa Octocat'; */
    name: string;
    /** @example 'octocat@github.com'; */
    email: string;
  };
  committer: {
    /** @example '2014-11-07T22:01:45Z'; */
    date: string;
    /** @example 'Monalisa Octocat'; */
    name: string;
    /** @example 'octocat@github.com'; */
    email: string;
  };
  /** @example 'my commit message'; */
  message: string;
  tree: {
    /** @example 'https://api.github.com/repos/octocat/Hello-World/git/trees/827efc6d56897b048c772eb4087f854f46256132'; */
    url: string;
    /** @example '827efc6d56897b048c772eb4087f854f46256132'; */
    sha: string;
  };
  parents: [
    {
      /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/7d1b31e74ee336d15cbd21741bc88a537ed063a0'; */
      url: string;
      /** @example '7d1b31e74ee336d15cbd21741bc88a537ed063a0'; */
      sha: string;
    },
  ];
  verification: {
    verified: boolean;
    /** @example 'unsigned'; */
    reason: string;
    signature: null | any;
    payload: null | any;
  };
}

export interface GhCreateReferenceResponse {
  /** @example 'refs/heads/featureA'; */
  ref: string;
  /** @example 'MDM6UmVmcmVmcy9oZWFkcy9mZWF0dXJlQQ=='; */
  node_id: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/git/refs/heads/featureA'; */
  url: string;
  object: {
    /** @example 'commit'; */
    type: string;
    /** @example 'aa218f56b14c9653891f9e74264a383fa43fefbd'; */
    sha: string;
    /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/aa218f56b14c9653891f9e74264a383fa43fefbd'; */
    url: string;
  };
}

export interface GhUpdateReferenceResponse {
  /** @example 'refs/heads/featureA'; */
  ref: string;
  /** @example 'MDM6UmVmcmVmcy9oZWFkcy9mZWF0dXJlQQ=='; */
  node_id: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/git/refs/heads/featureA'; */
  url: string;
  object: {
    /** @example 'commit'; */
    type: string;
    /** @example 'aa218f56b14c9653891f9e74264a383fa43fefbd'; */
    sha: string;
    /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/aa218f56b14c9653891f9e74264a383fa43fefbd'; */
    url: string;
  };
}

export interface GhMergeResponse {
  /** @example '7fd1a60b01f91b314f59955a4e4d4e80d8edf11d'; */
  sha: string;
  /** @example 'MDY6Q29tbWl0N2ZkMWE2MGIwMWY5MWIzMTRmNTk5NTVhNGU0ZDRlODBkOGVkZjExZA=='; */
  node_id: string;
  commit: {
    author: {
      /** @example 'The Octocat'; */
      name: string;
      /** @example '2012-03-06T15:06:50-08:00'; */
      date: string;
      /** @example 'octocat@nowhere.com'; */
      email: string;
    };
    committer: {
      /** @example 'The Octocat'; */
      name: string;
      /** @example '2012-03-06T15:06:50-08:00'; */
      date: string;
      /** @example 'octocat@nowhere.com'; */
      email: string;
    };
    /** @example 'Shipped cool_feature!'; */
    message: string;
    tree: {
      /** @example 'b4eecafa9be2f2006ce1b709d6857b07069b4608'; */
      sha: string;
      /** @example 'https://api.github.com/repos/octocat/Hello-World/git/trees/b4eecafa9be2f2006ce1b709d6857b07069b4608'; */
      url: string;
    };
    /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d'; */
    url: string;
    comment_count: number;
    verification: {
      verified: boolean;
      /** @example 'unsigned'; */
      reason: string;
      signature: null | any;
      payload: null | any;
    };
  };
  /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d'; */
  url: string;
  /** @example 'https://github.com/octocat/Hello-World/commit/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d'; */
  html_url: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d/comments'; */
  comments_url: string;
  author: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  committer: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  parents: [
    {
      /** @example '553c2077f0edc3d5dc5d17262f6aa498e69d6f8e'; */
      sha: string;
      /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e'; */
      url: string;
    },
    {
      /** @example '762941318ee16e59dabbacb1b4049eec22f0d303'; */
      sha: string;
      /** @example 'https://api.github.com/repos/octocat/Hello-World/commits/762941318ee16e59dabbacb1b4049eec22f0d303'; */
      url: string;
    },
  ];
}

export interface GhCreateTagObjectResponse {
  /** @example 'MDM6VGFnOTQwYmQzMzYyNDhlZmFlMGY5ZWU1YmM3YjJkNWM5ODU4ODdiMTZhYw=='; */
  node_id: string;
  /** @example 'v0.0.1'; */
  tag: string;
  /** @example '940bd336248efae0f9ee5bc7b2d5c985887b16ac'; */
  sha: string;
  /** @example 'https://api.github.com/repos/octocat/Hello-World/git/tags/940bd336248efae0f9ee5bc7b2d5c985887b16ac'; */
  url: string;
  /** @example 'initial version'; */
  message: string;
  tagger: {
    /** @example 'Monalisa Octocat'; */
    name: string;
    /** @example 'octocat@github.com'; */
    email: string;
    /** @example '2014-11-07T22:01:45Z'; */
    date: string;
  };
  object: {
    /** @example 'commit'; */
    type: string;
    /** @example 'c3d0be41ecbe669545ee3e94d31ed9a4bc91ee3c'; */
    sha: string;
    /** @example 'https://api.github.com/repos/octocat/Hello-World/git/commits/c3d0be41ecbe669545ee3e94d31ed9a4bc91ee3c'; */
    url: string;
  };
  verification: {
    verified: boolean;
    /** @example 'unsigned'; */
    reason: string;
    signature: null | any;
    payload: null | any;
  };
}

export interface GhGetRepositoryResponse {
  id: number;
  /** @example 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5'; */
  node_id: string;
  /** @example 'Hello-World'; */
  name: string;
  /** @example 'octocat/Hello-World'; */
  full_name: string;
  owner: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'User'; */
    type: string;
    site_admin: boolean;
  };
  private: boolean;
  /** @example 'https://github.com/octocat/Hello-World'; */
  html_url: string;
  /** @example 'This your first repo!'; */
  description: string;
  fork: boolean;
  /** @example 'https://api.github.com/repos/octocat/Hello-World'; */
  url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}'; */
  archive_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/assignees{/user}'; */
  assignees_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}'; */
  blobs_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/branches{/branch}'; */
  branches_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}'; */
  collaborators_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/comments{/number}'; */
  comments_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/commits{/sha}'; */
  commits_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}'; */
  compare_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/contents/{+path}'; */
  contents_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/contributors'; */
  contributors_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/deployments'; */
  deployments_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/downloads'; */
  downloads_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/events'; */
  events_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/forks'; */
  forks_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}'; */
  git_commits_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}'; */
  git_refs_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}'; */
  git_tags_url: string;
  /** @example 'git:github.com/octocat/Hello-World.git'; */
  git_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}'; */
  issue_comment_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/issues/events{/number}'; */
  issue_events_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/issues{/number}'; */
  issues_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/keys{/key_id}'; */
  keys_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/labels{/name}'; */
  labels_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/languages'; */
  languages_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/merges'; */
  merges_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/milestones{/number}'; */
  milestones_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}'; */
  notifications_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/pulls{/number}'; */
  pulls_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/releases{/id}'; */
  releases_url: string;
  /** @example 'git@github.com:octocat/Hello-World.git'; */
  ssh_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/stargazers'; */
  stargazers_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/statuses/{sha}'; */
  statuses_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/subscribers'; */
  subscribers_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/subscription'; */
  subscription_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/tags'; */
  tags_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/teams'; */
  teams_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}'; */
  trees_url: string;
  /** @example 'https://github.com/octocat/Hello-World.git'; */
  clone_url: string;
  /** @example 'git:git.example.com/octocat/Hello-World'; */
  mirror_url: string;
  /** @example 'http://api.github.com/repos/octocat/Hello-World/hooks'; */
  hooks_url: string;
  /** @example 'https://svn.github.com/octocat/Hello-World'; */
  svn_url: string;
  /** @example 'https://github.com'; */
  homepage: string;
  language: null | any;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  /** @example 'master'; */
  default_branch: string;
  open_issues_count: number;
  is_template: boolean;
  /** @example ['octocat', 'atom', 'electron', 'api'] */
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  archived: boolean;
  disabled: boolean;
  /** @example 'public'; */
  visibility: string;
  /** @example '2011-01-26T19:06:43Z'; */
  pushed_at: string;
  /** @example '2011-01-26T19:01:12Z'; */
  created_at: string;
  /** @example '2011-01-26T19:14:43Z'; */
  updated_at: string;
  permissions: {
    pull: boolean;
    triage: boolean;
    push: boolean;
    maintain: boolean;
    admin: boolean;
  };
  allow_rebase_merge: boolean;
  template_repository: null | any;
  /** @example 'ABTLWHOULUVAXGTRYU7OC2876QJ2O'; */
  temp_clone_token: string;
  allow_squash_merge: boolean;
  delete_branch_on_merge: boolean;
  allow_merge_commit: boolean;
  subscribers_count: number;
  network_count: number;
  license: {
    /** @example 'mit'; */
    key: string;
    /** @example 'MIT License'; */
    name: string;
    /** @example 'MIT'; */
    spdx_id: string;
    /** @example 'https://api.github.com/licenses/mit'; */
    url: string;
    /** @example 'MDc6TGljZW5zZW1pdA=='; */
    node_id: string;
  };
  organization: {
    /** @example 'octocat'; */
    login: string;
    id: number;
    /** @example 'MDQ6VXNlcjE='; */
    node_id: string;
    /** @example 'https://github.com/images/error/octocat_happy.gif'; */
    avatar_url: string;
    /** @example ''; */
    gravatar_id: string;
    /** @example 'https://api.github.com/users/octocat'; */
    url: string;
    /** @example 'https://github.com/octocat'; */
    html_url: string;
    /** @example 'https://api.github.com/users/octocat/followers'; */
    followers_url: string;
    /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
    following_url: string;
    /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
    gists_url: string;
    /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
    starred_url: string;
    /** @example 'https://api.github.com/users/octocat/subscriptions'; */
    subscriptions_url: string;
    /** @example 'https://api.github.com/users/octocat/orgs'; */
    organizations_url: string;
    /** @example 'https://api.github.com/users/octocat/repos'; */
    repos_url: string;
    /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
    events_url: string;
    /** @example 'https://api.github.com/users/octocat/received_events'; */
    received_events_url: string;
    /** @example 'Organization'; */
    type: string;
    site_admin: boolean;
  };
  parent: {
    id: number;
    /** @example 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5'; */
    node_id: string;
    /** @example 'Hello-World'; */
    name: string;
    /** @example 'octocat/Hello-World'; */
    full_name: string;
    owner: {
      /** @example 'octocat'; */
      login: string;
      id: number;
      /** @example 'MDQ6VXNlcjE='; */
      node_id: string;
      /** @example 'https://github.com/images/error/octocat_happy.gif'; */
      avatar_url: string;
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      /** @example 'https://github.com/octocat'; */
      html_url: string;
      /** @example 'https://api.github.com/users/octocat/followers'; */
      followers_url: string;
      /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
      following_url: string;
      /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
      gists_url: string;
      /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
      starred_url: string;
      /** @example 'https://api.github.com/users/octocat/subscriptions'; */
      subscriptions_url: string;
      /** @example 'https://api.github.com/users/octocat/orgs'; */
      organizations_url: string;
      /** @example 'https://api.github.com/users/octocat/repos'; */
      repos_url: string;
      /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
      events_url: string;
      /** @example 'https://api.github.com/users/octocat/received_events'; */
      received_events_url: string;
      /** @example 'User'; */
      type: string;
      site_admin: boolean;
    };
    private: boolean;
    /** @example 'https://github.com/octocat/Hello-World'; */
    html_url: string;
    /** @example 'This your first repo!'; */
    description: string;
    fork: boolean;
    /** @example 'https://api.github.com/repos/octocat/Hello-World'; */
    url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}'; */
    archive_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/assignees{/user}'; */
    assignees_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}'; */
    blobs_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/branches{/branch}'; */
    branches_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}'; */
    collaborators_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/comments{/number}'; */
    comments_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/commits{/sha}'; */
    commits_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}'; */
    compare_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/contents/{+path}'; */
    contents_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/contributors'; */
    contributors_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/deployments'; */
    deployments_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/downloads'; */
    downloads_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/events'; */
    events_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/forks'; */
    forks_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}'; */
    git_commits_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}'; */
    git_refs_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}'; */
    git_tags_url: string;
    /** @example 'git:github.com/octocat/Hello-World.git'; */
    git_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}'; */
    issue_comment_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/issues/events{/number}'; */
    issue_events_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/issues{/number}'; */
    issues_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/keys{/key_id}'; */
    keys_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/labels{/name}'; */
    labels_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/languages'; */
    languages_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/merges'; */
    merges_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/milestones{/number}'; */
    milestones_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}'; */
    notifications_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/pulls{/number}'; */
    pulls_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/releases{/id}'; */
    releases_url: string;
    /** @example 'git@github.com:octocat/Hello-World.git'; */
    ssh_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/stargazers'; */
    stargazers_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/statuses/{sha}'; */
    statuses_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/subscribers'; */
    subscribers_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/subscription'; */
    subscription_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/tags'; */
    tags_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/teams'; */
    teams_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}'; */
    trees_url: string;
    /** @example 'https://github.com/octocat/Hello-World.git'; */
    clone_url: string;
    /** @example 'git:git.example.com/octocat/Hello-World'; */
    mirror_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/hooks'; */
    hooks_url: string;
    /** @example 'https://svn.github.com/octocat/Hello-World'; */
    svn_url: string;
    /** @example 'https://github.com'; */
    homepage: string;
    language: null | any;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    size: number;
    /** @example 'master'; */
    default_branch: string;
    open_issues_count: number;
    is_template: boolean;
    /** @example ['octocat', 'atom', 'electron', 'api'] */
    topics: string[];
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads: boolean;
    archived: boolean;
    disabled: boolean;
    /** @example 'public'; */
    visibility: string;
    /** @example '2011-01-26T19:06:43Z'; */
    pushed_at: string;
    /** @example '2011-01-26T19:01:12Z'; */
    created_at: string;
    /** @example '2011-01-26T19:14:43Z'; */
    updated_at: string;
    permissions: {
      admin: boolean;
      push: boolean;
      pull: boolean;
    };
    allow_rebase_merge: boolean;
    template_repository: null | any;
    /** @example 'ABTLWHOULUVAXGTRYU7OC2876QJ2O'; */
    temp_clone_token: string;
    allow_squash_merge: boolean;
    delete_branch_on_merge: boolean;
    allow_merge_commit: boolean;
    subscribers_count: number;
    network_count: number;
  };
  source: {
    id: number;
    /** @example 'MDEwOlJlcG9zaXRvcnkxMjk2MjY5'; */
    node_id: string;
    /** @example 'Hello-World'; */
    name: string;
    /** @example 'octocat/Hello-World'; */
    full_name: string;
    owner: {
      /** @example 'octocat'; */
      login: string;
      id: number;
      /** @example 'MDQ6VXNlcjE='; */
      node_id: string;
      /** @example 'https://github.com/images/error/octocat_happy.gif'; */
      avatar_url: string;
      /** @example ''; */
      gravatar_id: string;
      /** @example 'https://api.github.com/users/octocat'; */
      url: string;
      /** @example 'https://github.com/octocat'; */
      html_url: string;
      /** @example 'https://api.github.com/users/octocat/followers'; */
      followers_url: string;
      /** @example 'https://api.github.com/users/octocat/following{/other_user}'; */
      following_url: string;
      /** @example 'https://api.github.com/users/octocat/gists{/gist_id}'; */
      gists_url: string;
      /** @example 'https://api.github.com/users/octocat/starred{/owner}{/repo}'; */
      starred_url: string;
      /** @example 'https://api.github.com/users/octocat/subscriptions'; */
      subscriptions_url: string;
      /** @example 'https://api.github.com/users/octocat/orgs'; */
      organizations_url: string;
      /** @example 'https://api.github.com/users/octocat/repos'; */
      repos_url: string;
      /** @example 'https://api.github.com/users/octocat/events{/privacy}'; */
      events_url: string;
      /** @example 'https://api.github.com/users/octocat/received_events'; */
      received_events_url: string;
      /** @example 'User'; */
      type: string;
      site_admin: boolean;
    };
    private: boolean;
    /** @example 'https://github.com/octocat/Hello-World'; */
    html_url: string;
    /** @example 'This your first repo!'; */
    description: string;
    fork: boolean;
    /** @example 'https://api.github.com/repos/octocat/Hello-World'; */
    url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}'; */
    archive_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/assignees{/user}'; */
    assignees_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}'; */
    blobs_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/branches{/branch}'; */
    branches_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}'; */
    collaborators_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/comments{/number}'; */
    comments_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/commits{/sha}'; */
    commits_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}'; */
    compare_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/contents/{+path}'; */
    contents_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/contributors'; */
    contributors_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/deployments'; */
    deployments_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/downloads'; */
    downloads_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/events'; */
    events_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/forks'; */
    forks_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}'; */
    git_commits_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}'; */
    git_refs_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}'; */
    git_tags_url: string;
    /** @example 'git:github.com/octocat/Hello-World.git'; */
    git_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}'; */
    issue_comment_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/issues/events{/number}'; */
    issue_events_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/issues{/number}'; */
    issues_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/keys{/key_id}'; */
    keys_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/labels{/name}'; */
    labels_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/languages'; */
    languages_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/merges'; */
    merges_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/milestones{/number}'; */
    milestones_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}'; */
    notifications_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/pulls{/number}'; */
    pulls_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/releases{/id}'; */
    releases_url: string;
    /** @example 'git@github.com:octocat/Hello-World.git'; */
    ssh_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/stargazers'; */
    stargazers_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/statuses/{sha}'; */
    statuses_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/subscribers'; */
    subscribers_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/subscription'; */
    subscription_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/tags'; */
    tags_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/teams'; */
    teams_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}'; */
    trees_url: string;
    /** @example 'https://github.com/octocat/Hello-World.git'; */
    clone_url: string;
    /** @example 'git:git.example.com/octocat/Hello-World'; */
    mirror_url: string;
    /** @example 'http://api.github.com/repos/octocat/Hello-World/hooks'; */
    hooks_url: string;
    /** @example 'https://svn.github.com/octocat/Hello-World'; */
    svn_url: string;
    /** @example 'https://github.com'; */
    homepage: string;
    language: null | any;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    size: number;
    /** @example 'master'; */
    default_branch: string;
    open_issues_count: number;
    is_template: boolean;
    /** @example ['octocat', 'atom', 'electron', 'api'] */
    topics: string[];
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads: boolean;
    archived: boolean;
    disabled: boolean;
    /** @example 'public'; */
    visibility: string;
    /** @example '2011-01-26T19:06:43Z'; */
    pushed_at: string;
    /** @example '2011-01-26T19:01:12Z'; */
    created_at: string;
    /** @example '2011-01-26T19:14:43Z'; */
    updated_at: string;
    permissions: {
      admin: boolean;
      push: boolean;
      pull: boolean;
    };
    allow_rebase_merge: boolean;
    template_repository: null | any;
    /** @example 'ABTLWHOULUVAXGTRYU7OC2876QJ2O'; */
    temp_clone_token: string;
    allow_squash_merge: boolean;
    delete_branch_on_merge: boolean;
    allow_merge_commit: boolean;
    subscribers_count: number;
    network_count: number;
  };
}
