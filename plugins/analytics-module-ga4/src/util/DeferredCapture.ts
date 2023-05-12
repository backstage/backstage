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
import ReactGA from 'react-ga4';

import { UaEventOptions } from 'react-ga4/types/ga4';

type Hit = {
  hitType: string;
  data: {
    [x: string]: any;
  };
};

/**
 * A wrapper around ReactGA that can optionally handle latent capture logic.
 *
 * - When defer is `false`, event data is sent directly to GA.
 * - When defer is `true`, event data is queued (with a timestamp), so that it
 *   can be sent to GA once externally indicated to be ready. This relies on
 *   the `qt` or `queueTime` parameter of the Measurement Protocol.
 *
 * @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt
 */
export class DeferredCapture {
  /**
   * Queue of deferred hits to be processed when ready. When undefined, hits
   * can safely be sent without delay.
   */
  private queue: Hit[] | undefined;

  /**
   * constructor for creating the DeferredCapture object
   * @param defer type of {defer: boolean}
   */
  constructor({ defer = false }: { defer: boolean }) {
    this.queue = defer ? [] : undefined;
  }

  /**
   * Indicates that deferred capture may now proceed.
   */
  setReady() {
    if (this.queue) {
      this.queue.forEach(this.sendDeferred);
      this.queue = undefined;
    }
  }

  /**
   * Either forwards the event directly to GA, or (if configured) enqueues the
   * event hit to be captured when ready.
   * @param eventDetails type of UaEventOptions object
   * @param metadata any object that can be passed as additional parameter to the event
   */
  event(eventDetails: UaEventOptions, metadata: any = {}) {
    const data = {
      ...eventDetails,
      ...metadata,
    };
    if (this.queue) {
      this.queue.push({
        hitType: eventDetails.action,
        data: {
          ...data,
          timestamp_micros: Date.now() * 1000,
        },
      });
      return;
    }
    ReactGA.event(eventDetails.action, data);
  }

  /**
   * Sends a given hit to GA, decorated with the correct queue time.
   * @param hit Hit object
   */
  private sendDeferred(hit: Hit) {
    // Send the hit with the appropriate queue time (`qt`).
    ReactGA.event(hit.hitType, {
      ...hit.data,
    });
  }
}
