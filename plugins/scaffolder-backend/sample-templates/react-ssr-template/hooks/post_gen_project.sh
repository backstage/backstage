#!/bin/bash

# package name is "__component_id__" so that yarn doesn't throw an error
# about invalid characters when running yarn commands. here we replace it with the actual name
sed -i -e "s/__component_id__/{{ cookiecutter.component_id }}/g" package.json

# node_modules was moved out of the template folder, during the pre_gen hook,
# to avoid cookie_cutter from copying all of them. time to move it back
mv ../../node_modules.tmp ../../\{\{cookiecutter.component_id\}\}/node_modules 2>/dev/null ||:

# move back the build directory that was moved out in the pre_gen hook (if it exists)
mv ../../build.tmp ../../\{\{cookiecutter.component_id\}\}/build 2>/dev/null ||: