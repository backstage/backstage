class GoogleAnalyticsEvent {
  static LINK_CLICK = 'Link_Click';
  static BTN_CLICK = 'Button_Click';
  static TAB_CLICK = 'Tab_Click';
  static ROW_CLICK = 'Row_Click';
  static IMPRESSION = 'Impression';
  static HOVER = 'HOVER';

  static EVENT_TYPES = [
    GoogleAnalyticsEvent.LINK_CLICK,
    GoogleAnalyticsEvent.BTN_CLICK,
    GoogleAnalyticsEvent.TAB_CLICK,
    GoogleAnalyticsEvent.ROW_CLICK,
    GoogleAnalyticsEvent.IMPRESSION,
    GoogleAnalyticsEvent.HOVER,
  ];

  constructor(category, action, label, value, owner, context) {
    if (GoogleAnalyticsEvent.EVENT_TYPES.indexOf(action) === -1) {
      throw new Error(
        `ERROR: Unsupported event action! Valid actions are one of: ${GoogleAnalyticsEvent.EVENT_TYPES.join(', ')}`,
      );
    }
    this.category = category;
    this.action = action;
    this.label = label;
    this.value = value;
    this.owner = owner;
    this.context = context;
  }
}
export default GoogleAnalyticsEvent;

export const GA_BACKSTAGE_TRACKER = ['backstageTracker'];
export const GA_CROSS_DOMAIN_TRACKER = ['crossDomainTracker'];
export const GA_ALL_TRACKERS = ['backstageTracker', 'crossDomainTracker'];
export const GA_DEFAULT_PLUGIN_ID = 'backstage';
export const GA_DEFAULT_PLUGIN_OWNER = 'tools';
export const GA_LABEL_UNKNOWN = 'Unknown';
export const GA_DEFAULT_USERNAME_PROPS = { label: 'Username' };
export const GA_DEFAULT_OWNER_PROPS = { label: 'Owner' };
export const GA_HEADER_LOGO_PROPS = { label: 'BackstageHome' };
