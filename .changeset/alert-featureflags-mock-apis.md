---
'@backstage/test-utils': minor
'@backstage/frontend-test-utils': minor
---

Added mock implementations for `AlertApi` and `FeatureFlagsApi` following the same 3-pattern approach as backend `mockServices`. Also modernized existing `ErrorApi` and `FetchApi` mocks to use the new pattern. All mocks now support three usage patterns:

1. Direct function call: `mockApis.alert()` - creates a functional fake implementation
2. Factory function: `mockApis.alert.factory()` - creates an API factory
3. Jest mock: `mockApis.alert.mock()` - creates a jest-mocked version with optional implementations

Example usage:

```tsx
// Functional fake
const alert = mockApis.alert();
alert.post({ message: 'Test' });
expect(alert.getAlerts()).toHaveLength(1);

// Jest mock with assertions
const alertMock = mockApis.alert.mock();
component.doSomething();
expect(alertMock.post).toHaveBeenCalledWith({ message: 'Success' });

// Feature flags with initial state
const featureFlags = mockApis.featureFlags({
  initialStates: { 'my-flag': FeatureFlagState.Active },
});
expect(featureFlags.isActive('my-flag')).toBe(true);
```
