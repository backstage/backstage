---
'@backstage/plugin-scaffolder-react': minor
---

fixes the issue for pattern validation when field is secret. Adjust the test to accommodate the changes. Now the form data validation is done on the secret value before masking and then deleting the secret from form data.
