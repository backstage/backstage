---
'@backstage/config-loader': minor
---

Adds a new `deepVisibility` schema keyword that sets child visibility recursively to the defined value, respecting preexisting values or child `deepVisibility`.

Example usage:

```ts
export interface Config {
  /**
   * Enforces a default of `secret` instead of `backend` for this object.
   * @deepVisibility secret
   */
  mySecretProperty: {
    type: 'object';
    properties: {
      secretValue: {
        type: 'string';
      };

      verySecretProperty: {
        type: 'string';
      };
    };
  };
}
```

Example of a schema that would not be allowed:

```ts
export interface Config {
  /**
   * Set the top level property to secret, enforcing a default of `secret` instead of `backend` for this object.
   * @deepVisibility secret
   */
  mySecretProperty: {
    type: 'object';
    properties: {
      frontendUrl: {
        /**
         * We can NOT override the visibility to reveal a property to the front end.
         * @visibility frontend
         */
        type: 'string';
      };

      verySecretProperty: {
        type: 'string';
      };
    };
  };
}
```
