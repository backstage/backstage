# notifications

Welcome to the notifications backend plugin!

## Getting started

To install, please refer the [Getting Started](https://backstage.io/docs/notifications) Backstage Notifications and Signals documentation section.

For users to be able to see notifications in real-time, you have to install also
the signals plugin (`@backstage/plugin-signals-node`, `@backstage/plugin-signals-backend`, and
`@backstage/plugin-signals`).

## Extending Notifications

When a notification is created, it's processing can be customized via `processors`.
Please refer [Backstage documentation](https://backstage.io/docs/notifications) for further details.

## Sending Notifications By Backend Plugins

To be able to send notifications to users by other plugins, you have to integrate the `@backstage/plugin-notifications-node`
to your application and plugins. For the API, please refer documentation there.

## Sending Notifications By External Services

External services can create new messages by sending POST request to the REST API.

To be able to do so, `external access` needs to be enabled as described in the [documentation](https://backstage.io/docs/auth/service-to-service-auth), e.g. via the `static tokens`.

Once the API can be accessed, the request can look like:

```
curl -X POST [YOUR_SERVER_URL]/api/notifications/notifications -H "Content-Type: application/json" -H "Authorization: Bearer [BASE64_ENCODED_ACCESS_TOKEN]" -d '{"recipients":{"type":"entity","entityRef":"user:development/guest"},"payload": {"title": "Title of user-targeted external message","description": "The description","link": "http://foo.com/bar","severity": "high","topic": "The topic"}}'
```
