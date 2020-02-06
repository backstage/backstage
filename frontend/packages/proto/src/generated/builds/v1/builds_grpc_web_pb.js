/**
 * @fileoverview gRPC-Web generated client stub for spotify.backstage.builds.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.spotify = {};
proto.spotify.backstage = {};
proto.spotify.backstage.builds = {};
proto.spotify.backstage.builds.v1 = require('./builds_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.spotify.backstage.builds.v1.BuildsClient =
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
proto.spotify.backstage.builds.v1.BuildsPromiseClient =
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
 *   !proto.spotify.backstage.builds.v1.ListBuildsRequest,
 *   !proto.spotify.backstage.builds.v1.ListBuildsReply>}
 */
const methodDescriptor_Builds_ListBuilds = new grpc.web.MethodDescriptor(
  '/spotify.backstage.builds.v1.Builds/ListBuilds',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.builds.v1.ListBuildsRequest,
  proto.spotify.backstage.builds.v1.ListBuildsReply,
  /**
   * @param {!proto.spotify.backstage.builds.v1.ListBuildsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.builds.v1.ListBuildsReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.builds.v1.ListBuildsRequest,
 *   !proto.spotify.backstage.builds.v1.ListBuildsReply>}
 */
const methodInfo_Builds_ListBuilds = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.builds.v1.ListBuildsReply,
  /**
   * @param {!proto.spotify.backstage.builds.v1.ListBuildsRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.builds.v1.ListBuildsReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.builds.v1.ListBuildsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.builds.v1.ListBuildsReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.builds.v1.ListBuildsReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.builds.v1.BuildsClient.prototype.listBuilds =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.builds.v1.Builds/ListBuilds',
      request,
      metadata || {},
      methodDescriptor_Builds_ListBuilds,
      callback);
};


/**
 * @param {!proto.spotify.backstage.builds.v1.ListBuildsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.builds.v1.ListBuildsReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.builds.v1.BuildsPromiseClient.prototype.listBuilds =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.builds.v1.Builds/ListBuilds',
      request,
      metadata || {},
      methodDescriptor_Builds_ListBuilds);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.spotify.backstage.builds.v1.GetBuildRequest,
 *   !proto.spotify.backstage.builds.v1.GetBuildReply>}
 */
const methodDescriptor_Builds_GetBuild = new grpc.web.MethodDescriptor(
  '/spotify.backstage.builds.v1.Builds/GetBuild',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.builds.v1.GetBuildRequest,
  proto.spotify.backstage.builds.v1.GetBuildReply,
  /**
   * @param {!proto.spotify.backstage.builds.v1.GetBuildRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.builds.v1.GetBuildReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.builds.v1.GetBuildRequest,
 *   !proto.spotify.backstage.builds.v1.GetBuildReply>}
 */
const methodInfo_Builds_GetBuild = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.builds.v1.GetBuildReply,
  /**
   * @param {!proto.spotify.backstage.builds.v1.GetBuildRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.builds.v1.GetBuildReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.builds.v1.GetBuildRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.builds.v1.GetBuildReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.builds.v1.GetBuildReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.builds.v1.BuildsClient.prototype.getBuild =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.builds.v1.Builds/GetBuild',
      request,
      metadata || {},
      methodDescriptor_Builds_GetBuild,
      callback);
};


/**
 * @param {!proto.spotify.backstage.builds.v1.GetBuildRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.builds.v1.GetBuildReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.builds.v1.BuildsPromiseClient.prototype.getBuild =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.builds.v1.Builds/GetBuild',
      request,
      metadata || {},
      methodDescriptor_Builds_GetBuild);
};


module.exports = proto.spotify.backstage.builds.v1;

