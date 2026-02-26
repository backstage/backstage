/*
 * Copyright 2026 The Backstage Authors
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

/**
 * A subscriber of the {@link CatalogScmEventsService}.
 *
 * @alpha
 */
export interface CatalogScmEventsServiceSubscriber {
  /**
   * Receives a number of events.
   */
  onEvents: (events: CatalogScmEvent[]) => Promise<void>;
}

/**
 * A publish/subscribe service for source control management system events. This
 * allows different producers of interesting events in a multi-SCM environment
 * communicate those events to multiple interested parties. As an example, one
 * entity provider might automatically register and unregister locations as an
 * effect of these events.
 *
 * @alpha
 */
export interface CatalogScmEventsService {
  /**
   * Subscribes to events, and returns a function to unsubscribe.
   */
  subscribe(subscriber: CatalogScmEventsServiceSubscriber): {
    unsubscribe: () => void;
  };

  /**
   * Publish an event to all subscribers.
   *
   * @remarks
   *
   * This call blocks until all subscribers have either acknowledged that they
   * have received and handled the event, or thrown an error. There are no
   * re-sends or dead letter queues; receivers must implement a suitable
   * resilience model themselves internally if they want to have better delivery
   * guarantees.
   */
  publish(events: CatalogScmEvent[]): Promise<void>;
}

/**
 * Voluntary contextual information related to a {@link CatalogScmEvent}.
 *
 * @alpha
 */
export type CatalogScmEventContext = {
  /**
   * URL to a commit related to this event being generated, if relevant.
   */
  commitUrl?: string;
};

/**
 * Represents a high level change event that happened in a source control
 * management system. These are usually produced as a distilled version of an
 * incoming webhook event or similar.
 *
 * @alpha
 */
export type CatalogScmEvent =
  | {
      /**
       * A new location was created.
       *
       * @remarks
       *
       * This typically means that an individual file was created in an existing
       * repository, for example through a git push or merge.
       */
      type: 'location.created';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      /**
       * An existing location was modified.
       *
       * @remarks
       *
       * This typically means that an individual file was modified in an existing
       * repository, for example through a git push or merge.
       */
      type: 'location.updated';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      /**
       * An existing location was deleted.
       *
       * @remarks
       *
       * This typically means that an individual file was deleted in an existing
       * repository, for example through a git push or merge.
       */
      type: 'location.deleted';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      /**
       * An existing location was moved from one place to another.
       *
       * @remarks
       *
       * This typically means that an individual file was moved or renamed, for
       * example through a git push or merge. The URLs do not necessarily refer
       * to the same repository before and after the move.
       */
      type: 'location.moved';
      fromUrl: string;
      toUrl: string;
      context?: CatalogScmEventContext;
    }
  | {
      /**
       * A new repository was created.
       */
      type: 'repository.created';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      /**
       * An existing repository was updated.
       *
       * @remarks
       *
       * This usually refers to some form of meta state change, such as it being
       * made public or private, or its visibility being changed.
       */
      type: 'repository.updated';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      /**
       * An existing repository was deleted.
       */
      type: 'repository.deleted';
      url: string;
      context?: CatalogScmEventContext;
    }
  | {
      /**
       * An existing repository was moved or in some other way had its effective
       * base URL changed.
       *
       * @remarks
       *
       * This typically refers to a repository being renamed, or transferred to
       * a different owner. It can also refer to a change of base branch, which
       * effectively changes the base URL for many repository URL patterns.
       *
       * The source and target URLs do not necessarily end exactly on a
       * repository, but MAY include additional path segments such as the branch
       * name.
       */
      type: 'repository.moved';
      fromUrl: string;
      toUrl: string;
      context?: CatalogScmEventContext;
    };
