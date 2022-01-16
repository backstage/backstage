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
import ReactGA from 'react-ga';

type Hit = {
  timestamp: number;
  data: {
    hitType: 'pageview' | 'event';
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
   * Queue of deferred hits to be processed when ready.
   */
  private queue: Hit[] = [];

  /**
   * Marker indicating when it's okay to revert to synchronous capture.
   */
  private doneDeferring = false;

  /**
   * Whether or not deferred capture is desired.
   */
  private defer: boolean;

  /**
   * Holds a reference to the internal promise's resolver. When called, it will
   * begin processing hits in the queue.
   */
  private isReady: () => void = () => {};

  constructor({ defer = false }: { defer: boolean }) {
    this.defer = defer;

    // Set up a readiness promise that, when resolved from the outside, goes
    // through all queued hits and sends them.
    new Promise<void>(resolve => {
      this.isReady = resolve;
    }).then(() => {
      this.queue.forEach(this.sendDeferred);
    });
  }

  /**
   * Indicates that deferred capture may now proceed.
   */
  setReady() {
    if (!this.doneDeferring) {
      this.isReady();
      this.doneDeferring = true;
    }
  }

  /**
   * Either forwards the pageview directly to GA, or (if configured) enqueues
   * the pageview hit to be captured when ready.
   */
  pageview(path: string, metadata: ReactGA.FieldsObject = {}) {
    if (this.shouldDefer()) {
      this.queue.push({
        timestamp: Date.now(),
        data: {
          hitType: 'pageview',
          page: path,
          ...metadata,
        },
      });
      return;
    }

    ReactGA.send({
      hitType: 'pageview',
      page: path,
      ...metadata,
    });
  }

  /**
   * Either forwards the event directly to GA, or (if configured) enqueues the
   * event hit to be captured when ready.
   */
  event(eventDetails: ReactGA.EventArgs) {
    if (this.shouldDefer()) {
      this.queue.push({
        timestamp: Date.now(),
        data: {
          ...eventDetails,
          hitType: 'event',
        },
      });
      return;
    }

    ReactGA.event(eventDetails);
  }

  /**
   * Only defer if configured and if we are still not ready.
   */
  private shouldDefer() {
    return this.defer && !this.doneDeferring;
  }

  /**
   * Sends a given hit to GA, decorated with the correct queue time.
   */
  private sendDeferred(hit: Hit) {
    // Send the hit with the appropriate queue time (`qt`).
    ReactGA.send({
      ...hit.data,
      queueTime: Date.now() - hit.timestamp,
    });
  }
}
