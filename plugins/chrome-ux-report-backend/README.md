# Chrome UX Report Backend

Welcome to the Chrome UX Report backend plugin!

## What is Chrome UX Report?

The Chrome User Experience Report is powered by real user measurement of key user experience metrics across the public web, aggregated from users who have opted-in to syncing their browsing history, have not set up a Sync passphrase, and have usage statistic reporting enabled. If you are curious of what is the metrics, you can go to [UX Metrics](#UXMetrics).

## Configuring the Plugin

You need to create a service account and get a JSON key from [Google Cloud Console](https://console.cloud.google.com)

**1. Set `chromeUXReport.projectId` config in your `app-config.yaml`**

Set `chromeUXReport.projectId` to project ID of your project in Google Cloud.

```yaml
chromeUXReport:
  projectId: projectId
```

**2. Set `chromeUXReport.keyPath` config in your `app-config.yaml`**

You will get a JSON Key File from Google Cloud. You can give this Key File path with environmental variables. You can use the example

```yaml
chromeUXReport:
  projectId: projectId
  keyPath:
    $env: GOOGLE_APPLICATION_CREDENTIALS
```

**3. Set the Origins that you want to track UX Metrics**

You can set the origins like example.

```yaml
chromeUXReport:
  projectId: projectId # Project id of your project in Google Cloud
  keyPath:
    $env: GOOGLE_APPLICATION_CREDENTIALS
  origins:
    - site: siteUrl # Any site url e.g. 'https://backstage.io'
      name: siteName # Name of the relevant site
```

**4. That's it!**

Your Backstage app is now ready to use Google Chrome UX Report Plugin! When you start the
backend of the app, you should be able to see
`'Plugin Chrome UX Report has started'`
in the logs.

## UXMetrics

Metrics provided by the public Chrome User Experience Report hosted on Google BigQuery are powered by standard web platform APIs exposed by modern browsers and aggregated to origin-resolution.
For more information about metrics, you can go to [UX Metrics](https://developers.google.com/web/tools/chrome-user-experience-report).
