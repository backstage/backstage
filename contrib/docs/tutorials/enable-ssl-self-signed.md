# Enabling SSL for Local Testing

If you need to use an `https:` URL for local testing (i.e. if an OAuth provider requires a "secure" callback URL), you can use a self-signed certificate by following these steps.

## Backend

1. Generate a self-signed certificate and key for localhost and configure your system to trust it. The application ["mkcert"](https://github.com/FiloSottile/mkcert) is a helpful tool to accomplish this.
1. Update `backend.baseUrl` in app-config.local.yaml to use an `https:` address, and copy the contents of the certificate and key files into `backend.https.certificate.cert` and `backend.https.certificate.cert`, respectively. Your app-config.local.yaml should look something like:
   ```yaml
   backend:
     baseUrl: https://localhost:7007
     https:
       certificate:
         cert: |
           -----BEGIN CERTIFICATE-----
           MIIDCTCCAfGgAwIBAgIUZ9VhZckcy690L
           ...
           -----END CERTIFICATE-----
         key: |
           -----BEGIN PRIVATE KEY-----
           MIIEvAIBADANBgkqhkiG9w0BAQ
           ...
           -----END PRIVATE KEY-----
   ```
1. Start the backend with `NODE_EXTRA_CA_CERTS=/absolute/path/to/cert.pem yarn start-backend`

## Frontend

Webpack will generate a self signed certificate automatically in development environments when the protocol in the `baseUrl` is `https`. Therefore, simply add this to your local config:

```yaml
app:
  baseUrl: https://localhost:3000
backend:
  cors:
    origin: https://localhost:3000
```

and start the app with `yarn start`. As with the backend instructions above, the certificate must be trusted.

Depending on what plugins are in use, you may need to override additional URLs to use `https` for those endpoints to work.
