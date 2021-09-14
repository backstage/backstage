---
'@backstage/plugin-tech-insights-backend': minor
'@backstage/plugin-tech-insights-backend-module-jsonfc': minor
'@backstage/plugin-tech-insights-common': minor
---

## Add initial implementation of Tech Insights backend

Add common types and interfaces for Tech Insights. Exposing components needed to use and modify tech-insights-backend module and to implement individual Fact Retrievers, Fact Checkers and their persistence options.

Implement a framework to run fact retrievers and store fact data into the database. Add migration scripts to create a new database for `tech_insights`.

Create a default implementation of a FactChecker enabling users to construct checks and run them and generate scorecards based on checks.

To be able to use tech insights in your application you need to implement `FactRetriever`s to retrieve and return data for facts and register them to the tech-insights-backend. If you want to use fact checking functionality, you need to create `check`s and register them to an implementation of a `FactChecker`.

For more information see documentation on the README.md files of the respective packages.
