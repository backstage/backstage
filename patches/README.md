# patches

This folder contains patches for dependency type declarations. Typescript doesn't provide a way to override of fix types that are installed as a part of the dependent package itself.

Do not add any more patches here, these patches were added as a part of getting the entire repo type-checked, and we depended on some packages with bad types.

As soon as the below issues are fixed, we should remove the patching functionality completely.

## material-table

Fixed in master but not released yet, tracked here: https://github.com/mbrn/material-table/pull/1624
