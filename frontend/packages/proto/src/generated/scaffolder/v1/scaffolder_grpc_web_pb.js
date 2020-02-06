/**
 * @fileoverview gRPC-Web generated client stub for spotify.backstage.scaffolder.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var identity_v1_identity_pb = require('../../identity/v1/identity_pb.js')

var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js')
const proto = {};
proto.spotify = {};
proto.spotify.backstage = {};
proto.spotify.backstage.scaffolder = {};
proto.spotify.backstage.scaffolder.v1 = require('./scaffolder_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.spotify.backstage.scaffolder.v1.ScaffolderClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.spotify.backstage.scaffolder.v1.ScaffolderPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.spotify.backstage.scaffolder.v1.Empty,
 *   !proto.spotify.backstage.scaffolder.v1.ListTemplatesReply>}
 */
const methodDescriptor_Scaffolder_ListTemplates = new grpc.web.MethodDescriptor(
  '/spotify.backstage.scaffolder.v1.Scaffolder/ListTemplates',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.scaffolder.v1.Empty,
  proto.spotify.backstage.scaffolder.v1.ListTemplatesReply,
  /**
   * @param {!proto.spotify.backstage.scaffolder.v1.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.scaffolder.v1.ListTemplatesReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.scaffolder.v1.Empty,
 *   !proto.spotify.backstage.scaffolder.v1.ListTemplatesReply>}
 */
const methodInfo_Scaffolder_ListTemplates = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.scaffolder.v1.ListTemplatesReply,
  /**
   * @param {!proto.spotify.backstage.scaffolder.v1.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.scaffolder.v1.ListTemplatesReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.scaffolder.v1.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.scaffolder.v1.ListTemplatesReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.scaffolder.v1.ListTemplatesReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.scaffolder.v1.ScaffolderClient.prototype.listTemplates =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.scaffolder.v1.Scaffolder/ListTemplates',
      request,
      metadata || {},
      methodDescriptor_Scaffolder_ListTemplates,
      callback);
};


/**
 * @param {!proto.spotify.backstage.scaffolder.v1.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.scaffolder.v1.ListTemplatesReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.scaffolder.v1.ScaffolderPromiseClient.prototype.listTemplates =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.scaffolder.v1.Scaffolder/ListTemplates',
      request,
      metadata || {},
      methodDescriptor_Scaffolder_ListTemplates);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.spotify.backstage.scaffolder.v1.CreateRequest,
 *   !proto.spotify.backstage.scaffolder.v1.CreateReply>}
 */
const methodDescriptor_Scaffolder_Create = new grpc.web.MethodDescriptor(
  '/spotify.backstage.scaffolder.v1.Scaffolder/Create',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.scaffolder.v1.CreateRequest,
  proto.spotify.backstage.scaffolder.v1.CreateReply,
  /**
   * @param {!proto.spotify.backstage.scaffolder.v1.CreateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.scaffolder.v1.CreateReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.scaffolder.v1.CreateRequest,
 *   !proto.spotify.backstage.scaffolder.v1.CreateReply>}
 */
const methodInfo_Scaffolder_Create = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.scaffolder.v1.CreateReply,
  /**
   * @param {!proto.spotify.backstage.scaffolder.v1.CreateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.scaffolder.v1.CreateReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.scaffolder.v1.CreateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.scaffolder.v1.CreateReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.scaffolder.v1.CreateReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.scaffolder.v1.ScaffolderClient.prototype.create =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.scaffolder.v1.Scaffolder/Create',
      request,
      metadata || {},
      methodDescriptor_Scaffolder_Create,
      callback);
};


/**
 * @param {!proto.spotify.backstage.scaffolder.v1.CreateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.scaffolder.v1.CreateReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.scaffolder.v1.ScaffolderPromiseClient.prototype.create =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.scaffolder.v1.Scaffolder/Create',
      request,
      metadata || {},
      methodDescriptor_Scaffolder_Create);
};


module.exports = proto.spotify.backstage.scaffolder.v1;

