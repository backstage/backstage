import { registerFeatureFlag } from 'shared/apis/featureFlags/featureFlagsActions';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

let testFeatureFlag = 'test';

describe('featureFlags', () => {
  it('when no feature flag is registered', () => {
    expect(FeatureFlags.getItem(testFeatureFlag)).toBe(false);
  });

  it('when feature flag is registered', () => {
    registerFeatureFlag(testFeatureFlag);
    expect(FeatureFlags.getItem(testFeatureFlag)).toBe(false);
  });

  it('when feature flag is enabled', () => {
    FeatureFlags.enable(testFeatureFlag);
    expect(FeatureFlags.getItem(testFeatureFlag)).toBe(true);
  });

  it('when feature flag is disabled', () => {
    FeatureFlags.disable(testFeatureFlag);
    expect(FeatureFlags.getItem(testFeatureFlag)).toBe(false);
  });
});
