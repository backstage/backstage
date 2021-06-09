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

import { useApi } from '@backstage/core';
import { useEffect, useMemo, useReducer } from 'react';
import { useAsync, useAsyncRetry } from 'react-use';
import { techdocsStorageApiRef } from '../../api';

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

  /** There is content, the backend tried to update it, but it took too long */
  | 'CONTENT_STALE_TIMEOUT'

  /** There is content, the backend tried to update it, but failed */
  | 'CONTENT_STALE_ERROR'

  /** There is nothing to see but a "not found" page. Is also shown on page load errors */
  | 'CONTENT_NOT_FOUND'

  /** There is only the latest and greatest content */
  | 'CONTENT_FRESH';

/**
 * Calculate the state that should be reported to the display component.
 */
export function calculateDisplayState({
  contentLoading,
  content,
  activeSyncState,
}: Pick<
  ReducerState,
  'contentLoading' | 'content' | 'activeSyncState'
>): ContentStateTypes {
  // we have nothing to display yet
  if (contentLoading) {
    return 'CHECKING';
  }

  // there is no content, but the sync process is still evaluating
  if (!content && activeSyncState === 'CHECKING') {
    return 'CHECKING';
  }

  // there is no content yet so we assume that we are building it for the first time
  if (!content && activeSyncState === 'BUILDING') {
    return 'INITIAL_BUILD';
  }

  // if there is still no content after building, it might just not exist
  if (!content) {
    return 'CONTENT_NOT_FOUND';
  }

  // we are still building, but we already show stale content
  if (activeSyncState === 'BUILDING') {
    return 'CONTENT_STALE_REFRESHING';
  }

  // the build is ready, but the content is still stale
  if (activeSyncState === 'BUILD_READY') {
    return 'CONTENT_STALE_READY';
  }

  // the build timed out, but the content is still stale
  if (activeSyncState === 'BUILD_TIMED_OUT') {
    return 'CONTENT_STALE_TIMEOUT';
  }

  // the build failed, but the content is still stale
  if (activeSyncState === 'ERROR') {
    return 'CONTENT_STALE_ERROR';
  }

  // seems like the content is up-to-date (or we don't know yet and the sync process is still evaluating in the background)
  return 'CONTENT_FRESH';
}

/**
 * The state of the synchronization task. It checks whether the docs are
 * up-to-date. If they aren't, it triggers a build.
 */
type SyncStates =
  /** Checking if it should be synced */
  | 'CHECKING'

  /** Building the documentation */
  | 'BUILDING'

  /** Finished building the documentation */
  | 'BUILD_READY'

  /** Building the documentation timed out */
  | 'BUILD_TIMED_OUT'

  /** No need for a sync. The content was already up-to-date. */
  | 'UP_TO_DATE'

  /** An error occurred */
  | 'ERROR';

type ReducerActions =
  | {
      type: 'sync';
      state: SyncStates;
      syncError?: Error;
    }
  | {
      type: 'content';
      content?: string;
      contentLoading: boolean;
      contentError?: Error;
      contentReload: () => void;
    }
  | { type: 'navigate'; path: string };

type ReducerState = {
  /**
   * The path of the current page
   */
  path: string;

  /**
   * The current sync state
   */
  activeSyncState: SyncStates;

  /**
   * If true, the content is downloading from the storage.
   */
  contentLoading: boolean;
  /**
   * The content that has been downloaded and should be displayed.
   */
  content?: string;
  /**
   * When called, the content is reloaded without refreshing the page.
   */
  contentReload?: () => void;
  /**
   * If true, the content is considered stale and should be refreshed by the user via a refresh or a navigation.
   */
  contentIsStale: boolean;

  contentError?: Error;
  syncError?: Error;
};

export function reducer(
  oldState: ReducerState,
  action: ReducerActions,
): ReducerState {
  const newState = { ...oldState };

  switch (action.type) {
    case 'sync':
      newState.activeSyncState = action.state;
      newState.syncError = action.syncError;

      // whatever is stored as content, it can be considered as being stale
      if (newState.activeSyncState === 'BUILD_READY') {
        newState.contentIsStale = true;

        // reload the content if this was the initial build OR the page was missing in the old version
        if (!newState.content && newState.contentReload) {
          newState.contentReload();

          // eagerly mark the content to load to not get synchronization issues since
          // the async hook behind contentReload() doesn't update the reducer instantly
          // and might flash the "not found" page
          newState.contentLoading = true;
        }
      }
      break;

    case 'content':
      newState.content = action.content;
      newState.contentLoading = action.contentLoading;
      newState.contentReload = action.contentReload;
      newState.contentError = action.contentError;
      break;

    case 'navigate':
      newState.path = action.path;
      break;

    default:
      throw new Error();
  }

  // a navigation or a content update removes the staleness and resets the sync state
  if (
    newState.contentIsStale &&
    ['content', 'navigate'].includes(action.type)
  ) {
    newState.contentIsStale = false;
    newState.activeSyncState = 'UP_TO_DATE';
  }

  return newState;
}

export function useReaderState(
  kind: string,
  namespace: string,
  name: string,
  path: string,
): { state: ContentStateTypes; content?: string; errorMessage?: string } {
  const [state, dispatch] = useReducer(reducer, {
    activeSyncState: 'CHECKING',
    path,
    contentLoading: true,
    contentIsStale: false,
  });

  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  // convert all path changes into actions
  useEffect(() => {
    dispatch({ type: 'navigate', path });
  }, [path]);

  // try to load the content
  const {
    value: content,
    loading: contentLoading,
    error: contentError,
    retry: contentReload,
  } = useAsyncRetry(
    async () =>
      techdocsStorageApi.getEntityDocs(
        {
          kind,
          namespace,
          name,
        },
        path,
      ),
    [techdocsStorageApi, kind, namespace, name, path],
  );

  // convert all content changes into actions
  useEffect(() => {
    dispatch({
      type: 'content',
      content,
      contentLoading,
      contentReload,
      contentError,
    });
  }, [dispatch, content, contentLoading, contentReload, contentError]);

  // try to derive the state. the function will fire events and we don't care for the return values
  useAsync(async () => {
    dispatch({ type: 'sync', state: 'CHECKING' });

    // should only switch to BUILDING if the request takes more than 1 seconds
    const buildingTimeout = setTimeout(() => {
      dispatch({ type: 'sync', state: 'BUILDING' });
    }, 1000);

    try {
      const result = await techdocsStorageApi.syncEntityDocs({
        kind,
        namespace,
        name,
      });

      if (result === 'updated') {
        dispatch({ type: 'sync', state: 'BUILD_READY' });
      } else if (result === 'cached') {
        dispatch({ type: 'sync', state: 'UP_TO_DATE' });
      } else {
        dispatch({ type: 'sync', state: 'BUILD_TIMED_OUT' });
      }
    } catch (e) {
      dispatch({ type: 'sync', state: 'ERROR', syncError: e });
    } finally {
      // Cancel the timer that sets the state "BUILDING"
      clearTimeout(buildingTimeout);
    }
  }, [kind, name, namespace, techdocsStorageApi, dispatch]);

  const displayState = useMemo(
    () =>
      calculateDisplayState({
        activeSyncState: state.activeSyncState,
        contentLoading: state.contentLoading,
        content: state.content,
      }),
    [state.activeSyncState, state.content, state.contentLoading],
  );

  const errorMessage = useMemo(() => {
    let errMessage = '';
    if (state.contentError) {
      errMessage += ` Load error: ${state.contentError}`;
    }
    if (state.syncError) errMessage += ` Build error: ${state.syncError}`;

    return errMessage;
  }, [state.syncError, state.contentError]);

  return {
    state: displayState,
    content,
    errorMessage,
  };
}
