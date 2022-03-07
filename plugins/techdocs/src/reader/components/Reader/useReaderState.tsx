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

import { useTechDocsReaderPage } from '../TechDocsReaderPage';
import { EntityDocs, useEntityDocs } from '../TechDocsEntityDocs';
import {
  EntityDocsSync,
  EntityDocsSyncStatus,
  useEntityDocsSync,
} from '../TechDocsEntityDocsSync';

/**
 * A state representation that is used to configure the UI of <Reader />
 */
type ContentStateTypes =
  /** There is nothing to display but a loading indicator */
  | 'CHECKING'
  /** There is no content yet -> present a full screen loading page */
  | 'INITIAL_BUILD'
  /** There is content, but the backend is about to update it */
  | 'CONTENT_STALE_REFRESHING'
  /** There is content, but after a reload, the content will be different */
  | 'CONTENT_STALE_READY'
  /** There is content, the backend tried to update it, but failed */
  | 'CONTENT_STALE_ERROR'
  /** There is only the latest and greatest content */
  | 'CONTENT_FRESH';

/**
 * Calculate the state that should be reported to the display component.
 */
export const computeStatus = (
  content: EntityDocs,
  sync: EntityDocsSync,
): ContentStateTypes => {
  // the sync process is still evaluating
  if (!sync.status || sync.status === EntityDocsSyncStatus.CHECKING) {
    return 'CHECKING';
  }

  if (sync.status === EntityDocsSyncStatus.BUILDING) {
    // there is no content yet so we assume that we are building it for the first time
    if (!content.value) {
      return 'INITIAL_BUILD';
    }
    // we are still building, but we already show stale content
    return 'CONTENT_STALE_REFRESHING';
  }

  // the build is ready, but the content is still stale
  if (sync.status === EntityDocsSyncStatus.BUILD_READY) {
    return 'CONTENT_STALE_READY';
  }

  // the build failed, but the content is still stale
  if (sync.status === EntityDocsSyncStatus.ERROR) {
    return 'CONTENT_STALE_ERROR';
  }

  // seems like the content is up-to-date (or we don't know yet and the sync process is still evaluating in the background)
  return 'CONTENT_FRESH';
};

export type TechDocsState = {
  path: string;
  status: ContentStateTypes;
  content?: string;
  contentReload: () => void;
  contentErrorMessage?: string;
  syncBuildLog: string[];
  syncErrorMessage?: string;
  /**
   * @deprecated use status instead
   */
  state: ContentStateTypes;
  /**
   * @deprecated use syncBuildLog instead
   */
  buildLog: string[];
};

export const useTechDocsState = (): TechDocsState => {
  const readerPage = useTechDocsReaderPage();
  const entityDocs = useEntityDocs();
  const entityDocsSync = useEntityDocsSync();
  const status = computeStatus(entityDocs, entityDocsSync);

  return {
    status,
    state: status,
    buildLog: entityDocsSync.log,
    path: readerPage.path,
    content: entityDocs.value,
    contentReload: entityDocs.retry,
    contentErrorMessage: entityDocs.error?.toString(),
    syncBuildLog: entityDocsSync.log,
    syncErrorMessage: entityDocsSync.error?.toString(),
  };
};
