---
id: observability
title: Observability
# prettier-ignore
description: Adding Observability to Your Plugin
---

This article briefly describes the observability option that are available to a
Backstage integrator.

## Google Analytics

There is a basic Google Analytics integration built into Backstage. You can
enable it by adding the following to your app configuration:

```yaml
app:
  googleAnalyticsTrackingId: UA-000000-0
```

Replace the tracking ID with your own.
