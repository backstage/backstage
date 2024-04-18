# @backstage/plugin-notifications-backend-module-email

Adds support for sending Backstage notifications as emails to users.

Supports sending emails using SMTP, SES, or sendmail.

## Customizing email content

The email content can be customized with the `notificationsEmailTemplateExtensionPoint`. When you create
this extension, you can set the custom `NotificationTemplateRenderer` to the module. To modify the contents,
override the `getSubject`, `getHtml` and `getText` methods.

```ts
import { notificationsEmailTemplateExtensionPoint } from '@backstage/plugin-notifications-backend-module-email';
import { Notification } from '@backstage/plugin-notifications-common';

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
          getSubject(notification) {
            return `New notification from ${notification.source}`;
          },
          getText(notification) {
            return notification.content;
          },
          getHtml(notification) {
            return `<p>${notification.content}</p>`;
          },
        });
      },
    });
  },
});
```

## Example configuration:

```yaml
notifications:
  processors:
    email:
      transportConfig:
        transport: 'smtp'
        hostname: 'my-smtp-server'
        port: 587
        secure: false
        username: 'my-username'
        password: 'my-password'
      sender: 'sender@mycompany.com'
      replyTo: 'no-reply@mycompany.com'
      broadcastConfig:
        receiver: 'users'
      cache:
        ttl: 60000
```

See `config.d.ts` for more options for configuration.
