---
'@backstage/plugin-devtools-common': patch
'@backstage/plugin-devtools': patch
---

Added `cancelScheduledTask` to the DevTools API and a cancel button to the scheduled tasks UI. The `useTriggerScheduledTask` hook has been renamed to `useScheduledTasksOperations`, now exposing both `triggerTask` and `cancelTask` with shared loading and error state.
