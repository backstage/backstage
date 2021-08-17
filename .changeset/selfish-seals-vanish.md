---
'@backstage/techdocs-common': minor
'@backstage/plugin-techdocs-backend': minor
---

OpenStack Swift Client changed with Trendyol's OpenStack Swift SDK.

## Migration from old OpenStack Swift Configuration

Let's assume we have the old OpenStack Swift configuration here.

```yaml
techdocs:
  publisher:
    type: 'openStackSwift'
    openStackSwift:
      containerName: 'name-of-techdocs-storage-bucket'
      credentials:
        username: ${OPENSTACK_SWIFT_STORAGE_USERNAME}
        password: ${OPENSTACK_SWIFT_STORAGE_PASSWORD}
      authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
      keystoneAuthVersion: ${OPENSTACK_SWIFT_STORAGE_AUTH_VERSION}
      domainId: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_ID}
      domainName: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_NAME}
      region: ${OPENSTACK_SWIFT_STORAGE_REGION}
```

##### Step 1: Change the credential keys

Since the new SDK uses _Application Credentials_ to authenticate OpenStack, we
need to change the keys `credentials.username` to `credentials.id`,
`credentials.password` to `credentials.secret` and use Application Credential ID
and secret here. For more detail about credentials look
[here](https://docs.openstack.org/api-ref/identity/v3/?expanded=password-authentication-with-unscoped-authorization-detail,authenticating-with-an-application-credential-detail#authenticating-with-an-application-credential).

##### Step 2: Remove the unused keys

Since the new SDK doesn't use the old way authentication, we don't need the keys
`openStackSwift.keystoneAuthVersion`, `openStackSwift.domainId`,
`openStackSwift.domainName` and `openStackSwift.region`. So you can remove them.

##### Step 3: Add Swift URL

The new SDK needs the OpenStack Swift connection URL for connecting the Swift.
So you need to add a new key called `openStackSwift.swiftUrl` and give the
OpenStack Swift url here. Example url should look like that:
`https://example.com:6780/swift/v1`

##### That's it!

Your new configuration should look like that!

```yaml
techdocs:
  publisher:
    type: 'openStackSwift'
    openStackSwift:
      containerName: 'name-of-techdocs-storage-bucket'
      credentials:
        id: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_ID}
        secret: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_SECRET}
      authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
      swiftUrl: ${OPENSTACK_SWIFT_STORAGE_SWIFT_URL}
```
