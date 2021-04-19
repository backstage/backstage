---
id: installation
title: Datadog RUM Installation
sidebar_label: Installation
# prettier-ignore
description: Adding Datadog RUM to Your App
---

There is a basic [Datadog](https://docs.datadoghq.com/real_user_monitoring/)
integration built into Backstage. You can enable it by adding the following to
your app configuration:

```yaml
app:
  datadogRum:
    clientToken: '123456789'
    applicationId: qwerty
  #   site: # datadoghq.eu default = datadoghq.com
  #   env: # optional
```

Replace the clientToken and applicationId with the ones generated for you
Datadog.

optional arguments:

```
site: datadoghq.eu # default equals datadoghq.com
env: dev # allow to specify the environment
```
