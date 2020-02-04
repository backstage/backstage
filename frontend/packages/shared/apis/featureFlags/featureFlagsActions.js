import store from 'core/store';
import { REGISTER_FEATURE_FLAG } from 'shared/apis/featureFlags/featureFlagsConstants';

/**
 * Register a feature flag that should be available for the app and visible in settings
 * @param flag the feature flag
 */
export function registerFeatureFlag(flag) {
  store.dispatch({
    type: REGISTER_FEATURE_FLAG,
    payload: flag,
  });
}
