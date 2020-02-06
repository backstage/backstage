/**
 * @fileoverview gRPC-Web generated client stub for spotify.backstage.identity.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.spotify = {};
proto.spotify.backstage = {};
proto.spotify.backstage.identity = {};
proto.spotify.backstage.identity.v1 = require('./identity_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.spotify.backstage.identity.v1.IdentityClient =
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
proto.spotify.backstage.identity.v1.IdentityPromiseClient =
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
 *   !proto.spotify.backstage.identity.v1.GetUserRequest,
 *   !proto.spotify.backstage.identity.v1.GetUserReply>}
 */
const methodDescriptor_Identity_GetUser = new grpc.web.MethodDescriptor(
  '/spotify.backstage.identity.v1.Identity/GetUser',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.identity.v1.GetUserRequest,
  proto.spotify.backstage.identity.v1.GetUserReply,
  /**
   * @param {!proto.spotify.backstage.identity.v1.GetUserRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.identity.v1.GetUserReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.identity.v1.GetUserRequest,
 *   !proto.spotify.backstage.identity.v1.GetUserReply>}
 */
const methodInfo_Identity_GetUser = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.identity.v1.GetUserReply,
  /**
   * @param {!proto.spotify.backstage.identity.v1.GetUserRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.identity.v1.GetUserReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.identity.v1.GetUserRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.identity.v1.GetUserReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.identity.v1.GetUserReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.identity.v1.IdentityClient.prototype.getUser =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.identity.v1.Identity/GetUser',
      request,
      metadata || {},
      methodDescriptor_Identity_GetUser,
      callback);
};


/**
 * @param {!proto.spotify.backstage.identity.v1.GetUserRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.identity.v1.GetUserReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.identity.v1.IdentityPromiseClient.prototype.getUser =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.identity.v1.Identity/GetUser',
      request,
      metadata || {},
      methodDescriptor_Identity_GetUser);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.spotify.backstage.identity.v1.GetGroupRequest,
 *   !proto.spotify.backstage.identity.v1.GetGroupReply>}
 */
const methodDescriptor_Identity_GetGroup = new grpc.web.MethodDescriptor(
  '/spotify.backstage.identity.v1.Identity/GetGroup',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.identity.v1.GetGroupRequest,
  proto.spotify.backstage.identity.v1.GetGroupReply,
  /**
   * @param {!proto.spotify.backstage.identity.v1.GetGroupRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.identity.v1.GetGroupReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.identity.v1.GetGroupRequest,
 *   !proto.spotify.backstage.identity.v1.GetGroupReply>}
 */
const methodInfo_Identity_GetGroup = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.identity.v1.GetGroupReply,
  /**
   * @param {!proto.spotify.backstage.identity.v1.GetGroupRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.identity.v1.GetGroupReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.identity.v1.GetGroupRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.identity.v1.GetGroupReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.identity.v1.GetGroupReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.identity.v1.IdentityClient.prototype.getGroup =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.identity.v1.Identity/GetGroup',
      request,
      metadata || {},
      methodDescriptor_Identity_GetGroup,
      callback);
};


/**
 * @param {!proto.spotify.backstage.identity.v1.GetGroupRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.identity.v1.GetGroupReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.identity.v1.IdentityPromiseClient.prototype.getGroup =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.identity.v1.Identity/GetGroup',
      request,
      metadata || {},
      methodDescriptor_Identity_GetGroup);
};


module.exports = proto.spotify.backstage.identity.v1;

