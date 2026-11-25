---
'@backstage/plugin-notifications-backend-module-email': patch
---

The default email template now HTML-escapes notification descriptions and links, so markup in a notification is shown as text instead of being rendered in the email body. Line breaks in descriptions are kept. Custom template renderers still receive the raw notification data and must escape values themselves.
