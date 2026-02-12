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

/** @internal Exported for testing - allows spying on reloads without spying
 * on window.location.
 */
export const utils = {
  reloadPage: () => window.location.reload(),
};

interface TechDocsLiveReloadProps {
  /** Whether to enable livereload (default: true in development) */
  enabled?: boolean;
}

/**
 * LiveReload addon for Techdocs CLI.
 *
 * Support mkdocs built-in livereload, in a TechDocs CLI preview environment.
 * See https://github.com/backstage/backstage/issues/30514 for more details.
 */
export const TechDocsLiveReload = ({
  enabled = true,
}: TechDocsLiveReloadProps) => {
  const body = useShadowRootElements<HTMLBodyElement>(['body']);
  const reqRef = useRef<XMLHttpRequest | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const LIVE_RELOAD_ELEMENT = 'live-reload';
  const LIVE_RELOAD_ATTR_EPOCH = 'live-reload-epoch';
  const LIVE_RELOAD_ATTR_REQUEST_ID = 'live-reload-request-id';
  const CLI_LIVERELOAD_PATH = '/.livereload';

  useEffect(() => {
    if (!enabled || !body[0]) {
      return undefined;
    }

    const liveReloadElement = body[0].querySelector(LIVE_RELOAD_ELEMENT);

    if (!liveReloadElement) {
      return undefined;
    }

    const epoch = parseInt(
      liveReloadElement.getAttribute(LIVE_RELOAD_ATTR_EPOCH) || '0',
      10,
    );
    const requestId = parseInt(
      liveReloadElement.getAttribute(LIVE_RELOAD_ATTR_REQUEST_ID) || '0',
      10,
    );

    if (!epoch || !requestId) {
      return undefined;
    }

    const livereloadUrl = CLI_LIVERELOAD_PATH;

    const poll = () => {
      reqRef.current = new XMLHttpRequest();
      reqRef.current.onloadend = function handleLoadEnd(this: XMLHttpRequest) {
        if (parseFloat(this.responseText) > epoch) {
          utils.reloadPage();
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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [body, enabled]);

  return null;
};
