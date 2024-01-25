---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-common': patch
---

Clusters configured with the `aws` authentication strategy can now customize the
`x-k8s-aws-id` header value used to generate tokens. This value can be specified
specified via the `kubernetes.io/x-k8s-aws-id` parameter (in
`metadata.annotations` for clusters in the catalog, or the `authMetadata` block
on clusters in the app-config). This is particularly helpful when a Backstage
instance contains multiple AWS clusters with the same name in different regions
-- using this new parameter, the clusters can be given different logical names
to distinguish them but still use the same ID for the purposes of generating
tokens.
