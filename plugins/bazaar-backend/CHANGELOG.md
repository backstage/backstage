# @backstage/plugin-bazaar-backend

## 0.1.4

### Patch Changes

- 210fcf63ee: Handle migration error when old data is present in the database
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.1.3

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/backend-common@0.9.11

## 0.1.2

### Patch Changes

- f6ba309d9e: A Bazaar project has been extended with the following fields: size, start date (optional), end date (optional) and a responsible person.
- Updated dependencies
  - @backstage/backend-common@0.9.10
  - @backstage/backend-test-utils@0.1.9
