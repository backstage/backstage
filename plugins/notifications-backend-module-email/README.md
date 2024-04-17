# @backstage/plugin-notifications-backend-module-email

Adds support for sending Backstage notifications as emails to users.

Supports sending emails using SMTP, SES, or sendmail.

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
        receiver: 'user'
```

See `config.d.ts` for more options for configuration.
