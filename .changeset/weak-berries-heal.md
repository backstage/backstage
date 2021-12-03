---
'@backstage/plugin-apache-airflow': minor
---

Introduces a new plugin for the Apache Airflow workflow management platform.
This implementation has been tested with the Apache Airflow v2 API,
authenticating with basic authentication through the Backstage proxy plugin.

Supported functionality includes:

- Information card of version information of the Airflow instance
- Information card of instance health for the meta-database and scheduler
- Table of DAGs with meta information and status, along with a link to view
  details in the Airflow UI
