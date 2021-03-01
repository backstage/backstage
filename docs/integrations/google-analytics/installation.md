---
id: installation
title: Google Analytics Installation
sidebar_label: Installation
# prettier-ignore
description: Adding Google Analytics to Your App
---

There is a basic Google Analytics integration built into Backstage. You can
enable it by adding the following to your app configuration:

```yaml
app:
  googleAnalyticsTrackingId: UA-000000-0
```

Replace the tracking ID with your own.

For more information, learn about Google Analytics
[here](https://marketingplatform.google.com/about/analytics/).

The default behavior is only to send a pageview hit to Google Analytics. To
record more, look at the developer documentation
[here](https://developers.google.com/analytics/devguides/collection/gtagjs).
