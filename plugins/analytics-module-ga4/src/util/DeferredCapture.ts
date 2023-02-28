import ReactGA from 'react-ga4';

import { UaEventOptions } from 'react-ga4/types/ga4';

type Hit = {
  data: {
    hitType: 'pageview' | 'event';
    [x: string]: any;
  };
};

const PageViewEvent = 'pageview';

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
   * Either forwards the pageview directly to GA, or (if configured) enqueues
   * the pageview hit to be captured when ready.
   * @param path pageview path
   * @param metadata any object that can be passed as additional parameter to the event
   */
  pageview(path: string, metadata: any = {}) {
    if (this.queue) {
      this.queue.push({
        data: {
          hitType: PageViewEvent,
          timestamp_micros: Date.now() * 1000,
          page: path,
          ...metadata,
        },
      });
      return;
    }

    ReactGA.send({
      hitType: PageViewEvent,
      page: path,
      ...metadata,
    });
  }

  /**
   * Either forwards the event directly to GA, or (if configured) enqueues the
   * event hit to be captured when ready.
   * @param eventDetails type of UaEventOptions object
   * @param metadata any object that can be passed as additional parameter to the event
   */
  event(eventDetails: UaEventOptions, metadata: any = {}) {
    const data = {
      hitType: 'event',
      eventCategory: eventDetails.category,
      eventLabel: eventDetails.label!,
      eventAction: eventDetails.action,
      eventValue: eventDetails.value,
      ...metadata,
    };
    if (this.queue) {
      this.queue.push({
        data: {
          ...data,
          timestamp_micros: Date.now() * 1000,
        },
      });
      return;
    }
    ReactGA.send(data);
  }

  /**
   * Sends a given hit to GA, decorated with the correct queue time.
   * @param hit Hit object
   */
  private sendDeferred(hit: Hit) {
    // Send the hit with the appropriate queue time (`qt`).
    ReactGA.send({
      ...hit.data,
    });
  }
}
