---
'@backstage/plugin-scaffolder-react': minor
---

fixes the issue for pattern validation when field is secret. Adjust the test to accomodate the changes. Now the formData validation is done on the secret value before masking and then deleting the secret from formData.
