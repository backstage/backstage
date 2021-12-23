---
'@backstage/create-app': patch
---

The `index.html` template of the app has been updated to use the new `config` global provided by the Backstage CLI.

To apply this change to an existing app, make the following changes to `packages/app/public/index.html`:

```diff
-    <title><%= app.title %></title>
+    <title><%= config.getString('app.title') %></title>
```

```diff
-    <% if (app.googleAnalyticsTrackingId && typeof app.googleAnalyticsTrackingId === 'string') { %>
+    <% if (config.has('app.googleAnalyticsTrackingId')) { %>
     <script
       async
-      src="https://www.googletagmanager.com/gtag/js?id=<%= app.googleAnalyticsTrackingId %>"
+      src="https://www.googletagmanager.com/gtag/js?id=<%= config.getString('app.googleAnalyticsTrackingId') %>"
     ></script>
```

```diff
-      gtag('config', '<%= app.googleAnalyticsTrackingId %>');
+      gtag(
+        'config',
+        '<%= config.getString("app.googleAnalyticsTrackingId") %>',
+      );
```
