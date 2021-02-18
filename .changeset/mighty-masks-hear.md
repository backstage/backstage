---
'@backstage/create-app': patch
---

Add the google analytics scripts in the `index.html` template for new applications.

To apply this change to an existing application, change the following in `packages\app\public\index.html`:

```diff
    <title><%= app.title %></title>

+    <% if (app.googleAnalyticsTrackingId && typeof app.googleAnalyticsTrackingId
+    === 'string') { %>
+    <script
+      async
+      src="https://www.googletagmanager.com/gtag/js?id=<%= app.googleAnalyticsTrackingId %>"
+    ></script>
+    <script>
+      window.dataLayer = window.dataLayer || [];
+      function gtag() {
+        dataLayer.push(arguments);
+      }
+      gtag('js', new Date());
+
+      gtag('config', '<%= app.googleAnalyticsTrackingId %>');
+    </script>
+    <% } %>
  </head>
```
