---
id: discovery
title: AWS S3 Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from an AWS S3 Bucket
---

The AWS S3 integration has a special discovery processor for discovering catalog
entities located in an S3 Bucket. If you have a bucket that contains multiple
catalog-info files and want to automatically discover them, you can use this
processor. The processor will crawl your S3 bucket and register entities
matching the configured path. This can be useful as an alternative to static
locations or manually adding things to the catalog.

To use the discovery processor, you'll need an AWS S3 integration
[set up](locations.md) with an `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`, and
optionally a `roleArn`. Then you can add a location target to the catalog
configuration:

```yaml
catalog:
  locations:
    - type: awsS3-discovery
      target: https://sample-bucket.s3.us-east-2.amazonaws.com/
```

Note the `awsS3-discovery` type, as this is not a regular `url` processor.
