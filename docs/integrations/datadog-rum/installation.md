---
id: installation
title: Datadog RUM Installation
sidebar_label: Installation
# prettier-ignore
description: Adding Datadog Real User Monitoring (RUM) to Your App
---

Datadog Real User Monitoring (RUM) allows you to visualize and analyze the
real-time performance and user journeys of your application's individual users.
This is an option to profile and monitor the user experience of your Backstage
installation.

There is a basic [Datadog RUM](https://docs.datadoghq.com/real_user_monitoring/)
integration built into Backstage. You can enable it by adding the following to
your `app-config.yaml`:

```yaml
app:
  datadogRum:
    clientToken: '123456789'
    applicationId: qwerty
  #   site: datadoghq.eu
  #   env: 'staging'
  #   sessionSampleRate: 100
  #   sessionReplaySampleRate: 0
```

If your [`app-config.yaml`](https://github.com/backstage/backstage/blob/e0506af8fc54074a160fb91c83d6cae8172d3bb3/app-config.yaml#L5) file does not have this configuration, you may have to adjust your [`packages/app/public/index.html`](https://github.com/backstage/backstage/blob/e0506af8fc54074a160fb91c83d6cae8172d3bb3/packages/app/public/index.html#L69) to include the Datadog RUM `init()` section manually.

Please note that the env value MUST be specified at build time

:::note
In case after a proper configuration, the events still are not being captured: Copy and paste this section in to your `packages/app/public/index.html` under the `<head>` tag.

```html
<% if (config.has('app.datadogRum')) { %>
<script>
  (function (h, o, u, n, d) {
    h = h[d] = h[d] || {
      q: [],
      onReady: function (c) {
        h.q.push(c);
      },
    };
    d = o.createElement(u);
    d.async = 1;
    d.src = n;
    n = o.getElementsByTagName(u)[0];
    n.parentNode.insertBefore(d, n);
  })(
    window,
    document,
    'script',
    'https://www.datadoghq-browser-agent.com/datadog-rum-v3.js',
    'DD_RUM',
  );
  DD_RUM.onReady(function () {
    DD_RUM.init({
      clientToken: '<%= config.getString("app.datadogRum.clientToken") %>',
      applicationId: '<%= config.getString("app.datadogRum.applicationId") %>',
      site: '<%= config.getOptionalString("app.datadogRum.site") || "datadoghq.com" %>',
      service: 'backstage',
      env: '<%= config.getString("app.datadogRum.env") %>',
      sampleRate:
        '<%= config.getOptionalNumber("app.datadogRum.sessionSampleRate") || 100 %>',
      sessionReplaySampleRate:
        '<%= config.getOptionalNumber("app.datadogRum.sessionReplaySampleRate") || 0 %>',
      trackInteractions: true,
    });
  });
</script>
<% } %>
```

The `clientToken` and `applicationId` are generated from the Datadog RUM page
following
[these instructions](https://docs.datadoghq.com/real_user_monitoring/browser/).

There are two optional arguments:

- `site`: The Datadog site of your organization; defaults to `datadoghq.com`
- `env`: The application environment for Datadog events (no default)
