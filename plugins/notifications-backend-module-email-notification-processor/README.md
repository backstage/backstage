# @backstage/plugin-notifications-backend-module-email-notification-processor

The email-notification-processor backend module for the notifications plugin.
The idea is to send the notification details via email when the notification severity is above the configured threshold.

Example configuration:

```yaml
backend:
  email-notification-processor:
    enabled: boolean # mandatory
    severityThreshold: 3 # mandatory. 1-4.
    sender: superstar@gmail.com # mandatory.
    recipient: theadmin@gmail.com # mandatory
    hostname: smtp.gmail.com # mandatory
    username: superstar@gmail.com # mandatory
    password: mightypassword # mandatory
    port: 587 # mandatory
    secure: boolean # mandatory
    requireTLS: boolean # mandatory
```

_This plugin was created through the Backstage CLI_
