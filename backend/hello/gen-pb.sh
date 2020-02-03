#!/bin/bash

# Path to this plugin, Note this must be an abolsute path on Windows (see #15)
PROTOC_GEN_TS_PATH="$(pwd)/node_modules/.bin/protoc-gen-ts"

# Path to the grpc_node_plugin
PROTOC_GEN_GRPC_PATH="$(pwd)/node_modules/.bin/grpc_tools_node_protoc_plugin"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="$(pwd)/src/generated"

mkdir -p "$OUT_DIR"

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --plugin="protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-node:${OUT_DIR}" \
    --proto_path="../../protos/" \
    --grpc_out="${OUT_DIR}" \
    hello.proto
