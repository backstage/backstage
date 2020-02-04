#!/bin/bash

# no way to ignore files in cookiecutter, so move node_modules out while building
# to avoid cookiecutter from copying all of them
mv ../../\{\{cookiecutter.component_id\}\}/node_modules ../../node_modules.tmp  2>/dev/null ||:

# cookicutter really doesn't like the next.js build directory, so if the app has
# been built from inside the template folder, that folders needs to be moved out as well
mv ../../\{\{cookiecutter.component_id\}\}/build ../../build.tmp  2>/dev/null ||:
