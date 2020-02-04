/**
 * This mapping is used by the errorUtil.js errorReducer() function. See that function for documentation
 * on usage.
 *
 * This is primarily used by Error.js right now for our ErrorBoundaries.
 */
export default [
  {
    errorContains: 'GetUserGroups short-circuited and fallback failed',
    message: 'The Backstage backend is updating its cache and should be back online for you within a couple of minutes',
  },
  {
    errorContains: 'Network error: Failed to fetch',
    message:
      'Network communication with the Backstage backend failed. Connect to the VPN if you are not on the Spotify network.',
  },
  {
    errorMatchesFunction: error =>
      typeof error === 'object' && error.error && error.error.response && error.error.response.data,
    message: error => error.error.response.data,
  },
  {
    errorMatchesFunction: error =>
      typeof error === 'object' && !(error.error && error.error.response && error.error.response.data),
    message: 'An error occurred, please copy to the clipboard and report to ${slackChannel}.',
  },
  {
    errorMatchesFunction: error => typeof error === 'string',
    message: error => error,
  },
];
