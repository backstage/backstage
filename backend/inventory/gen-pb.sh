#!/bin/bash
protoc -I ../../ protos/inventory.proto --go_out=plugins=grpc:.
