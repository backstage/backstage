---
'@backstage/plugin-notifications-backend-module-email': minor
---

**BREAKING** Following `NotificationTemplateRenderer` methods now return a Promise and **must** be awaited: `getSubject`, `getText` and `getHtml`.

Required changes and example usage:

```diff
import { notificationsEmailTemplateExtensionPoint } from '@backstage/plugin-notifications-backend-module-email';
import { Notification } from '@backstage/plugin-notifications-common';
+import { getNotificationSubject, getNotificationTextContent, getNotificationHtmlContent } from 'my-notification-processing-library`
export const notificationsModuleEmailDecorator = createBackendModule({
  pluginId: 'notifications',
  moduleId: 'email.templates',
  register(reg) {
    reg.registerInit({
      deps: {
        emailTemplates: notificationsEmailTemplateExtensionPoint,
      },
      async init({ emailTemplates }) {
        emailTemplates.setTemplateRenderer({
-          getSubject(notification) {
+          async getSubject(notification) {
-            return `New notification from ${notification.source}`;
+            const subject = await getNotificationSubject(notification);
+            return `New notification from ${subject}`;
          },
-          getText(notification) {
+          async getText(notification) {
-            return notification.content;
+            const text = await getNotificationTextContent(notification);
+            return text;
          },
-          getHtml(notification) {
+          async getHtml(notification) {
-            return `<p>${notification.content}</p>`;
+            const html = await getNotificationHtmlContent(notification);
+            return html;
          },
        });
      },
    });
  },
});
```
