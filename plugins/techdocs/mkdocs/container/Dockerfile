
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

FROM python:3.7.7-alpine3.12

RUN apk update && apk --no-cache add gcc musl-dev
RUN pip install mkdocs==1.1.2 mkdocs-material==5.3.2

ADD ./techdocs-core /techdocs-core
RUN pip install --no-index /techdocs-core

ENTRYPOINT [ "mkdocs" ]

