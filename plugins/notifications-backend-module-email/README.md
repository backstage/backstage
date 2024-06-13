# @backstage/plugin-notifications-backend-module-email

Adds support for sending Backstage notifications as emails to users.

Supports sending emails using `SMTP`, `SES`, `sendmail`, or `stream` (for debugging purposes).

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
      # Transport config, see options at `config.d.ts`
      transportConfig:
        transport: 'smtp'
        hostname: 'my-smtp-server'
        port: 587
        secure: false
        username: 'my-username'
        password: 'my-password'
      # The email sender address
      sender: 'sender@mycompany.com'
      replyTo: 'no-reply@mycompany.com'
      # Who to get email for broadcast notifications
      broadcastConfig:
        receiver: 'users'
      # How many emails to send concurrently, defaults to 2
      concurrencyLimit: 10
      # Cache configuration for email addresses
      # This is to prevent unnecessary calls to the catalog
      cache:
        ttl:
          days: 1
```

See `config.d.ts` for more options for configuration.
