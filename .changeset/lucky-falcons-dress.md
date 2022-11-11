---
'@backstage/create-app': patch
---

The [Analytics API](https://backstage.io/docs/plugins/analytics) is the recommended way to track usage in Backstage; an optionally installable [Google Analytics module](https://github.com/backstage/backstage/tree/master/plugins/analytics-module-ga#installation) has superseded the old app.googleAnalyticsTrackingId config and its corresponding script tags in packages/app/public/index.html.

For an existing installation where you want to remove the redundant app.googleAnalyticsTrackingId, you should make the following adjustment to `packages/app/public/index.html`:

```diff
    <title><%= config.getString('app.title') %></title>
-   <% if (config.has('app.googleAnalyticsTrackingId')) { %>
-   <script
-       async
-       src="https://www.googletagmanager.com/gtag/js?id=<%= config.getString('app.googleAnalyticsTrackingId') %>"
-   ></script>
-   <script>
-       window.dataLayer = window.dataLayer || [];
-       function gtag() {
-       dataLayer.push(arguments);
-       }
-       gtag('js', new Date());
-       gtag(
-       'config',
-       '<%= config.getString("app.googleAnalyticsTrackingId") %>',
-       );
-   </script>
-   <% } %>
</head>
```

Additionally, you should make the following adjustment to `app-config.yaml`:

```diff
app:
  title: Backstage Example App
  baseUrl: http://localhost:3000
- googleAnalyticsTrackingId: # UA-000000-0
```
