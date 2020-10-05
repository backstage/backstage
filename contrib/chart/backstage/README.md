# Backstage demo helm charts

This folder contains Helm charts that can easily create a Kubernetes deployment of a demo Backstage app.

To deploy it chose a DNS name where this demo will live and run

```
git clone https://github.com/spotify/backstage.git
cd contrib/chart/backstage
helm install backstage . \
--set appConfig.app.baseUrl="https://backstage.mydomain.com" \
--set appConfig.backend.baseUrl="https://backstage.mydomain.com" \
--set appConfig.backend.cors.origin.baseUrl="https://backstage.mydomain.com" \
```

This command will deploy the following pieces:

- Backstage frontend
- Backstage backend with scaffolder and auth plugins
- (optional) a PostgreSQL instance
- lighthouse plugin
- ingress

After a few minutes Backstage should be up and running in your cluster under the DNS specified earlier.

Make sure to create the appropriate DNS entry in your infrastructure. To find the IP address run

```bash
$ kubectl get ingress
NAME                HOSTS   ADDRESS         PORTS   AGE
backstage-ingress   *       34.77.171.192   80      17m
```

> **NOTE**: this is not a production ready deployment.

## Customization

Configuring a connection to an existing PostgreSQL instance is possible through the chart's values:

```bash
appConfig:
  backend:
    database:
      client: pg
      connection:
        database: backstage_plugin_catalog
        host: <host>
        user: <user>
        port: <port>
        password: <password>
        ssl:
          rejectUnauthorized: true
```

For the CA, create a `configMap` named `ca.crt`:

```
kubectl create configmap %s --from-file=ca.crt"
```

## Troubleshooting

#### Unable to verify signature

```
Backend failed to start up Error: unable to verify the first certificate
    at TLSSocket.onConnectSecure (_tls_wrap.js:1501:34)
    at TLSSocket.emit (events.js:315:20)
    at TLSSocket._finishInit (_tls_wrap.js:936:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:710:12) {
  code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
```

This error happens in the backend when it tries to connect to the configured PostgreSQL database and the specified CA is not correct. The solution is to make sure that the contents of the `configmap` that holds the certificate match the CA for the PostgreSQL instance. A workaround is to set `appConfig.backend.database.connection.ssl.rejectUnauthorized` to `false` in the chart's values.

<!-- TODO Add example command when we know the final name of the charts -->
