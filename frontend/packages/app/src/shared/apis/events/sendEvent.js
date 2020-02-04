import GoogleAnalyticsEvent, { GA_BACKSTAGE_TRACKER } from 'shared/apis/events/GoogleAnalyticsEvent';
import * as ReactGA from 'react-ga';
import { env } from 'shared/apis/env';

const sendEvent = event => {
  if (event instanceof GoogleAnalyticsEvent) {
    const { category, action, label, value, owner, context } = event;

    ReactGA.event(
      {
        category: category,
        action: action,
        label: label,
        value: value,
        dimension1: owner,
        dimension2: context,
      },
      GA_BACKSTAGE_TRACKER,
    );
  }
};

export const sendGAEvent = (eventCategory, eventAction, eventLabel, eventValue, eventOwner, eventContext) => {
  if (env.isProduction) {
    let gaEvent = new GoogleAnalyticsEvent(
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      eventOwner,
      eventContext,
    );

    // Send click event
    sendEvent(gaEvent);
  }
};

function isAbsoluteUrl(url) {
  return /^([a-z]+:\/\/|\/\/)/i.test(url);
}

export const sendGAOutboundLinkEvent = to => {
  // Send a page view if outbound link
  if (to && isAbsoluteUrl(to)) {
    ReactGA.set({ page: to }, GA_BACKSTAGE_TRACKER);
    ReactGA.pageview(to, GA_BACKSTAGE_TRACKER);
  }
};
