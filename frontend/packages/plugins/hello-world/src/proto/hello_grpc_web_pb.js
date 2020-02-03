/**
 * @fileoverview gRPC-Web generated client stub for spotify.backstage.hello.v1alpha1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.spotify = {};
proto.spotify.backstage = {};
proto.spotify.backstage.hello = {};
proto.spotify.backstage.hello.v1alpha1 = require('./hello_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.spotify.backstage.hello.v1alpha1.HelloClient =
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
proto.spotify.backstage.hello.v1alpha1.HelloPromiseClient =
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
 *   !proto.spotify.backstage.hello.v1alpha1.HelloRequest,
 *   !proto.spotify.backstage.hello.v1alpha1.HelloReply>}
 */
const methodDescriptor_Hello_Hello = new grpc.web.MethodDescriptor(
  '/spotify.backstage.hello.v1alpha1.Hello/Hello',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.hello.v1alpha1.HelloRequest,
  proto.spotify.backstage.hello.v1alpha1.HelloReply,
  /**
   * @param {!proto.spotify.backstage.hello.v1alpha1.HelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.hello.v1alpha1.HelloReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.hello.v1alpha1.HelloRequest,
 *   !proto.spotify.backstage.hello.v1alpha1.HelloReply>}
 */
const methodInfo_Hello_Hello = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.hello.v1alpha1.HelloReply,
  /**
   * @param {!proto.spotify.backstage.hello.v1alpha1.HelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.hello.v1alpha1.HelloReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.hello.v1alpha1.HelloRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.hello.v1alpha1.HelloReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.hello.v1alpha1.HelloReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.hello.v1alpha1.HelloClient.prototype.hello =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.hello.v1alpha1.Hello/Hello',
      request,
      metadata || {},
      methodDescriptor_Hello_Hello,
      callback);
};


/**
 * @param {!proto.spotify.backstage.hello.v1alpha1.HelloRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.hello.v1alpha1.HelloReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.hello.v1alpha1.HelloPromiseClient.prototype.hello =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.hello.v1alpha1.Hello/Hello',
      request,
      metadata || {},
      methodDescriptor_Hello_Hello);
};


module.exports = proto.spotify.backstage.hello.v1alpha1;

