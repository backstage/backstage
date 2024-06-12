---
'@backstage/backend-app-api': patch
---

Added a new static key based method for plugin-to-plugin auth. This is useful for example if you are running readonly service nodes that cannot use a database for the default public-key signature scheme outlined in [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution). Most users should want to stay on the more secure zero-config database signature scheme.

You can generate a public and private key pair using `openssl`.

- First generate a private key using the ES256 algorithm

  ```sh
  openssl ecparam -name prime256v1 -genkey -out private.ec.key
  ```

- Convert it to PKCS#8 format

  ```sh
  openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private.ec.key -out private.key
  ```

- Extract the public key

  ```sh
  openssl ec -inform PEM -outform PEM -pubout -in private.key -out public.key
  ```

After this you have the files `private.key` and `public.key`. Put them in a place where you know their absolute paths, and then set up your app-config accordingly:

```yaml
backend:
  auth:
    keyStore:
      type: static
      static:
        keys:
          - publicKeyFile: /absolute/path/to/public.key
            privateKeyFile: /absolute/path/to/private.key
            keyId: some-custom-id
```
