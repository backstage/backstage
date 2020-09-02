# Copyright 2020 Spotify AB
#  
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#  
#     http://www.apache.org/licenses/LICENSE-2.0
#  
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM python:3.8-alpine


RUN apk update && apk --no-cache add gcc musl-dev openjdk11-jdk curl graphviz ttf-dejavu fontconfig

RUN curl -L http://sourceforge.net/projects/plantuml/files/plantuml.1.2020.16.jar/download > /opt/plantuml.jar
RUN pip install --upgrade pip && pip install mkdocs-techdocs-core==0.0.3

# Create script to call plantuml.jar from a location in path

RUN echo "java -jar '/opt/plantuml.jar' ${@}" >> /usr/local/bin/plantuml
RUN chmod 755 /usr/local/bin/plantuml


ENTRYPOINT [ "mkdocs" ]
