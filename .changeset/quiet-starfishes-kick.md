---
'@backstage/plugin-home': patch
---

The `getTimeBasedGreeting` function has been updated to support an optional language parameter. Now, callers of the function can provide a language as input to receive a greeting in that specific language. If no language is provided, the function will automatically select a random greeting based on the current time.
