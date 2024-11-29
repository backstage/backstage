/*
 * Copyright 2022 The Backstage Authors
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
import { Models } from '../models';

// source: https://support.atlassian.com/bitbucket-cloud/docs/event-payloads

/** @public */
export namespace Events {
  /** @public */
  export interface RepoEvent {
    repository: Models.Repository & { workspace: Models.Workspace };
    actor: Models.Account;
  }

  /** @public */
  export interface RepoPushEvent extends RepoEvent {
    push: RepoPush;
  }

  /** @public */
  export interface RepoPush {
    changes: Change[];
  }

  /** @public */
  export interface Change {
    old: Models.Branch;
    new: Models.Branch;
    truncated: boolean;
    created: boolean;
    forced: boolean;
    closed: boolean;
    links: ChangeLinks;
    commits: Models.Commit[];
  }

  /** @public */
  export interface ChangeLinks {
    commits: Models.Link;
    diff: Models.Link;
    html: Models.Link;
  }
}
