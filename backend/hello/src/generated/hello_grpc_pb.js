// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var hello_pb = require('./hello_pb.js');

function serialize_spotify_backstage_hello_v1alpha1_HelloReply(arg) {
  if (!(arg instanceof hello_pb.HelloReply)) {
    throw new Error('Expected argument of type spotify.backstage.hello.v1alpha1.HelloReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_spotify_backstage_hello_v1alpha1_HelloReply(buffer_arg) {
  return hello_pb.HelloReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_spotify_backstage_hello_v1alpha1_HelloRequest(arg) {
  if (!(arg instanceof hello_pb.HelloRequest)) {
    throw new Error('Expected argument of type spotify.backstage.hello.v1alpha1.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_spotify_backstage_hello_v1alpha1_HelloRequest(buffer_arg) {
  return hello_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var HelloService = exports.HelloService = {
  hello: {
    path: '/spotify.backstage.hello.v1alpha1.Hello/Hello',
    requestStream: false,
    responseStream: false,
    requestType: hello_pb.HelloRequest,
    responseType: hello_pb.HelloReply,
    requestSerialize: serialize_spotify_backstage_hello_v1alpha1_HelloRequest,
    requestDeserialize: deserialize_spotify_backstage_hello_v1alpha1_HelloRequest,
    responseSerialize: serialize_spotify_backstage_hello_v1alpha1_HelloReply,
    responseDeserialize: deserialize_spotify_backstage_hello_v1alpha1_HelloReply,
  },
};

exports.HelloClient = grpc.makeGenericClientConstructor(HelloService);
