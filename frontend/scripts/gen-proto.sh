#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
OUT='src/proto'

mkdir -p "$OUT"

exec protoc -I="$DIR/../../protos" --js_out=import_style=commonjs:"$OUT" --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:"$OUT" "$@"
