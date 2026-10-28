---
'@backstage/frontend-plugin-api': minor
---

Removed the deprecated alert API exports and the deprecated `show` and `showModal` dialog methods. Use `ToastApi` for notifications and `DialogApi.open` for dialogs.

Replace `alertApiRef`, `AlertApi`, and `AlertMessage` imports with `toastApiRef`, `ToastApi`, and `ToastApiMessage` for new frontend plugins. Toast messages use `title` instead of `message`, and `status: 'danger'` instead of `severity: 'error'`. Legacy plugins can continue importing the alert contract from `@backstage/core-plugin-api`; the app still forwards legacy alerts to toasts.

Unlike `show` and `showModal`, `DialogApi.open` renders its content without a dialog wrapper. Provide the dialog surface, backdrop, and dismissal behavior in the component you pass to `open`. Include `undefined` in the result type if dismissing without a result is allowed.
