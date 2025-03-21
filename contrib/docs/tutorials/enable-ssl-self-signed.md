# Enabling SSL for Local Testing

If you need to use an `https:` URL for local testing (i.e. if an OAuth provider requires a "secure" callback URL), you can use a self-signed certificate by following these steps.

## Backend

1. Generate a self-signed certificate and key for localhost and configure your system to trust it. The application [`mkcert`](https://github.com/FiloSottile/mkcert) is a helpful tool to accomplish this.
1. Update `backend.baseUrl` in app-config.local.yaml to use an `https:` address.
1. Add the certificate and key to `backend.https.certificate.cert` and `backend.https.certificate.cert`, respectively.
   ```yaml
   backend:
     baseUrl: https://localhost:7007
     https:
       certificate:
         # You may copy the contents of the file...
         cert: |
           -----BEGIN CERTIFICATE-----
           MIIDCTCCAfGgAwIBAgIUZ9VhZckcy690L
           ...
           -----END CERTIFICATE-----
         # ... or use a path
         key:
           $file: ./certs/localhost-key.pem
   ```
1. Start the backend with `NODE_EXTRA_CA_CERTS=/absolute/path/to/cert.pem yarn start-backend`

## Frontend

1. As with the backend instructions above, a trusted certificate and key are needed.
1. Update `app.baseUrl` and `backend.cors.origin` in app-config.local.yaml to use an `https:` address.
1. Add the certificate and key to `app.https.certificate.cert` and `app.https.certificate.cert`, respectively.
   ```yaml
   app:
     baseUrl: https://localhost:3000
     https:
       certificate:
         cert:
           $file: ./certs/localhost.pem
         key:
           $file: ./certs/localhost-key.pem
   backend:
     cors:
       origin: https://localhost:3000
   ```
1. and start the app with `yarn start`.

Depending on what plugins are in use, you may need to override additional URLs to use `https` for those endpoints to work.
