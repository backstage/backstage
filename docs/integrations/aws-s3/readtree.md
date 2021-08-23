---
id: read-tree
title: AWS S3 Read Tree
sidebar_label: Read Tree
# prettier-ignore
description: Discovering multiple catalog entities from an AWS S3 Bucket
---

The AWS S3 integration has a special processor for using AwsS3UrlReader's
readTree() method. The method readTree() allows a user to retrieve more than one
file hosted inside an S3 bucket. The processor passes a valid S3 URL and
credentials to AwsS3UrlReader's readTree(). A user can supply a URL which points
to root of a bucket or a subdirectory inside the bucket. This can be useful as
an alternative to static locations or manually adding things to the catalog.

To use the discovery processor, you'll need an AWS S3 integration
[set up](locations.md) with an `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`, and
optionally a `roleArn`. Then you can add a location target to the catalog
configuration:

```yaml
catalog:
  locations:
    - type: s3-bucket
      target: https://sample-bucket.s3.us-east-2.amazonaws.com/
```

Note the `s3-bucket` type, as this is not a regular `url` processor.
