// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var scaffolder_pb = require('./scaffolder_pb.js');

function serialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderReply(arg) {
  if (!(arg instanceof scaffolder_pb.ScaffolderReply)) {
    throw new Error('Expected argument of type spotify.backstage.scaffolder.v1alpha1.ScaffolderReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderReply(buffer_arg) {
  return scaffolder_pb.ScaffolderReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderRequest(arg) {
  if (!(arg instanceof scaffolder_pb.ScaffolderRequest)) {
    throw new Error('Expected argument of type spotify.backstage.scaffolder.v1alpha1.ScaffolderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderRequest(buffer_arg) {
  return scaffolder_pb.ScaffolderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var ScaffolderService = exports.ScaffolderService = {
  scaffolder: {
    path: '/spotify.backstage.scaffolder.v1alpha1.Scaffolder/Scaffolder',
    requestStream: false,
    responseStream: false,
    requestType: scaffolder_pb.ScaffolderRequest,
    responseType: scaffolder_pb.ScaffolderReply,
    requestSerialize: serialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderRequest,
    requestDeserialize: deserialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderRequest,
    responseSerialize: serialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderReply,
    responseDeserialize: deserialize_spotify_backstage_scaffolder_v1alpha1_ScaffolderReply,
  },
};

exports.ScaffolderClient = grpc.makeGenericClientConstructor(ScaffolderService);
