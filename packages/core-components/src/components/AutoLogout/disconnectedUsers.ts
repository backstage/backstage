/*
 * Copyright 2023 The Backstage Authors
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
import { IdentityApi } from '@backstage/core-plugin-api';
import { useEffect } from 'react';

import { TimestampStore } from './timestampStore';

export const LAST_SEEN_ONLINE_STORAGE_KEY =
  '@backstage/autologout:lastSeenOnline';

export type UseLogoutDisconnectedUserEffectProps = {
  enableEffect: boolean;
  autologoutIsEnabled: boolean;
  idleTimeoutSeconds: number;
  lastSeenOnlineStore: TimestampStore;
  identityApi: IdentityApi;
};

export const useLogoutDisconnectedUserEffect = ({
  enableEffect,
  autologoutIsEnabled,
  idleTimeoutSeconds,
  lastSeenOnlineStore,
  identityApi,
}: UseLogoutDisconnectedUserEffectProps) => {
  useEffect(() => {
    /**
     * Considers disconnected users as inactive users.
     * If all Backstage tabs are closed and idleTimeoutMinutes are passed then logout the user anyway.
     */
    if (autologoutIsEnabled && enableEffect) {
      const lastSeenOnline = lastSeenOnlineStore.get();
      if (lastSeenOnline) {
        const now = new Date();
        const nowSeconds = Math.ceil(now.getTime() / 1000);
        const lastSeenOnlineSeconds = Math.ceil(
          lastSeenOnline.getTime() / 1000,
        );
        if (nowSeconds - lastSeenOnlineSeconds > idleTimeoutSeconds) {
          identityApi.signOut();
        }
      }
      /**
       * save for the first time when app is loaded, so that
       * if user logs in and does nothing we still have a
       * lastSeenOnline value in store
       */
      lastSeenOnlineStore.save(new Date());
    } else {
      lastSeenOnlineStore.delete();
    }
  }, [
    autologoutIsEnabled,
    enableEffect,
    identityApi,
    idleTimeoutSeconds,
    lastSeenOnlineStore,
  ]);
};
