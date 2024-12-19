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
          async getSubject(notification) {
            return `New notification from ${notification.source}`;
          },
          async getText(notification) {
            return notification.content;
          },
          async getHtml(notification) {
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

      # AWS SES
      # transportConfig:
      #   transport: 'ses'
      #   accessKeyId: 'my-access-key
      #   region: 'us-west-2'

      # sendmail
      # transportConfig:
      #   transport: 'sendmail'
      #   path: '/usr/sbin/sendmail'
      #   newline: 'unix'

      # The email sender address
      sender: 'sender@mycompany.com'
      replyTo: 'no-reply@mycompany.com'
      # Who to send email for broadcast notifications
      broadcastConfig:
        receiver: 'users'
      # How many emails to send concurrently, defaults to 2
      concurrencyLimit: 10
      # How much to throttle between emails, defaults to 100ms
      throttleInterval:
        seconds: 60
      # Cache configuration for email addresses
      # This is to prevent unnecessary calls to the catalog
      cache:
        ttl:
          days: 1
      # Notification filter which this processor will handle
      filter:
        # Minimum severity of the notification to send email
        minSeverity: high
        # Maximum severity of the notification to send email
        maxSeverity: critical
        # Topics that are excluded from sending email
        excludedTopics:
          - scaffolder
      # List of allowed email addresses to get notifications via email
      allowlistEmailAddresses:
        - john.doe@backstage.io
      # List of denied email addresses to get notifications via email
      denylistEmailAddresses:
        - jane.doe@backstage.io
```

See `config.d.ts` for more options for configuration.
