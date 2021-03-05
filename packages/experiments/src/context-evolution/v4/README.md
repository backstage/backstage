Second evoltion.

This one removes the method `getPlugins`.

Again, the real impl is in v3, so it follows the process as before:

- copy v2 to v3.
- implement the changes in v3.
- reimplement v2 based on v3.

So this process is always about adding the new version and changing the previous version
to have the same interface it always had, but to be based on the last one.

Notice v1 is unchanged.

