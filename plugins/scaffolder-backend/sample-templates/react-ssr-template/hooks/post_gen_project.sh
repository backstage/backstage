#!/bin/sh

# Move all template files to the root folder
mv ./* ../
cd ..
rm -rf {{cookiecutter.component_id}}
# # # # # # # # 
