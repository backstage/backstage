---
'@backstage/config-loader': patch
---

Deprecate `$data` and replace it with `$include` which allows for any type of json value to be read from external files. In addition, `$include` can be used without a path, which causes the value at the root of the file to be loaded.

Most usages of `$data` can be directly replaced with `$include`, except if the referenced value is not a string, in which case the value needs to be changed. For example:

```yaml
# app-config.yaml
foo:
  $data: foo.yaml#myValue # replacing with $include will turn the value into a number
  $data: bar.yaml#myValue # replacing with $include is safe

# foo.yaml
myValue: 0xf00

# bar.yaml
myValue: bar
```
