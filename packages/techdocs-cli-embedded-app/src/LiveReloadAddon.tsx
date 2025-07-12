/*
 * Copyright 2025 The Backstage Authors
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

import { useShadowRootElements } from '@backstage/plugin-techdocs-react';
import { useEffect, useRef } from 'react';

interface TechDocsLiveReloadProps {
  /** Whether to enable livereload (default: true in development) */
  enabled?: boolean;
}

/**
 * Livereload addon for Techdocs
 *
 * XXX(GabDug): Remove debug console.log
 */
export const TechDocsLiveReload = ({
  enabled = true,
}: TechDocsLiveReloadProps) => {
  const body = useShadowRootElements<HTMLBodyElement>(['body']);
  const reqRef = useRef<XMLHttpRequest | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !body[0]) {
      return undefined;
    }

    // XXX(GabDug): Constant / well known element name
    const liveReloadElement = body[0].querySelector('live-reload');

    if (!liveReloadElement) {
      return undefined;
    }

    const epoch = parseInt(
      liveReloadElement.getAttribute('live-reload-epoch') || '0',
      10,
    );
    const requestId = parseInt(
      liveReloadElement.getAttribute('live-reload-request-id') || '0',
      10,
    );

    if (!epoch || !requestId) {
      return undefined;
    }

    // XXX(GabDug): Move to TechdocsStorageApi?
    const livereloadUrl = `http://localhost:3000/.livereload`;

    const poll = () => {
      reqRef.current = new XMLHttpRequest();
      reqRef.current.onloadend = function () {
        // eslint-disable-next-line no-console
        console.log(
          '[Livereload] Response:',
          this.responseText,
          'Status:',
          this.status,
        );
        if (parseFloat(this.responseText) > epoch) {
          // eslint-disable-next-line no-console
          console.error(
            'DEBUG: LiveReloadAddon reloadContent. Reloading page.',
          );
          // XXX(GabDug): Reload the TechdocsContent
          window.location.reload();
        } else {
          timeoutRef.current = setTimeout(poll, this.status === 200 ? 0 : 3000);
        }
      };
      reqRef.current.open('GET', `${livereloadUrl}/${epoch}/${requestId}`);
      reqRef.current.send();
    };

    const stop = () => {
      if (reqRef.current) {
        reqRef.current.abort();
        reqRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Stop when tab is inactive
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        poll();
      } else {
        stop();
      }
    };

    const handleBeforeUnload = () => {
      stop();
    };

    // Start polling if page is visible
    if (document.visibilityState === 'visible') {
      poll();
    }

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stop();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [body, enabled]);

  return null;
};
