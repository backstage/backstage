---
'@backstage/create-app': patch
---

Fixed incorrect comments in the templated `app-config.yaml` and `app-config.production.yaml`. The `backend.listen` directive is not in fact needed to override the `backend.baseUrl`, the backend listens to all interfaces by default. The configuration has also been updated to listen to all interfaces, rather than just IPv4 ones, as this is required for Node.js v18. The production configuration now also shows the option to specify `backend.listen` as a single string.

To apply this changes to an existing app, make the following change to `app-config.yaml`:

```diff
-    # Uncomment the following host directive to bind to all IPv4 interfaces and
-    # not just the baseUrl hostname.
-    # host: 0.0.0.0
+    # Uncomment the following host directive to bind to specific interfaces
+    # host: 127.0.0.1
```

And the following change to `app-config.production.yaml`:

```diff
-  listen:
-    port: 7007
-    # The following host directive binds to all IPv4 interfaces when its value
-    # is "0.0.0.0". This is the most permissive setting. The right value depends
-    # on your specific deployment. If you remove the host line entirely, the
-    # backend will bind on the interface that corresponds to the backend.baseUrl
-    # hostname.
-    host: 0.0.0.0
+  # The listener can also be expressed as a single <host>:<port> string. In this case we bind to
+  # all interfaces, the most permissive setting. The right value depends on your specific deployment.
+  listen: ':7007'
```
