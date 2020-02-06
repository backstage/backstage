/**
 * @fileoverview gRPC-Web generated client stub for spotify.backstage.inventory.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.spotify = {};
proto.spotify.backstage = {};
proto.spotify.backstage.inventory = {};
proto.spotify.backstage.inventory.v1 = require('./inventory_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.spotify.backstage.inventory.v1.InventoryClient =
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
proto.spotify.backstage.inventory.v1.InventoryPromiseClient =
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
 *   !proto.spotify.backstage.inventory.v1.GetEntityRequest,
 *   !proto.spotify.backstage.inventory.v1.GetEntityReply>}
 */
const methodDescriptor_Inventory_GetEntity = new grpc.web.MethodDescriptor(
  '/spotify.backstage.inventory.v1.Inventory/GetEntity',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.inventory.v1.GetEntityRequest,
  proto.spotify.backstage.inventory.v1.GetEntityReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.GetEntityRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.GetEntityReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.inventory.v1.GetEntityRequest,
 *   !proto.spotify.backstage.inventory.v1.GetEntityReply>}
 */
const methodInfo_Inventory_GetEntity = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.inventory.v1.GetEntityReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.GetEntityRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.GetEntityReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.inventory.v1.GetEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.inventory.v1.GetEntityReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.inventory.v1.GetEntityReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.inventory.v1.InventoryClient.prototype.getEntity =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/GetEntity',
      request,
      metadata || {},
      methodDescriptor_Inventory_GetEntity,
      callback);
};


/**
 * @param {!proto.spotify.backstage.inventory.v1.GetEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.inventory.v1.GetEntityReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.inventory.v1.InventoryPromiseClient.prototype.getEntity =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/GetEntity',
      request,
      metadata || {},
      methodDescriptor_Inventory_GetEntity);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.spotify.backstage.inventory.v1.CreateEntityRequest,
 *   !proto.spotify.backstage.inventory.v1.CreateEntityReply>}
 */
const methodDescriptor_Inventory_CreateEntity = new grpc.web.MethodDescriptor(
  '/spotify.backstage.inventory.v1.Inventory/CreateEntity',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.inventory.v1.CreateEntityRequest,
  proto.spotify.backstage.inventory.v1.CreateEntityReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.CreateEntityRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.CreateEntityReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.inventory.v1.CreateEntityRequest,
 *   !proto.spotify.backstage.inventory.v1.CreateEntityReply>}
 */
const methodInfo_Inventory_CreateEntity = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.inventory.v1.CreateEntityReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.CreateEntityRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.CreateEntityReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.inventory.v1.CreateEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.inventory.v1.CreateEntityReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.inventory.v1.CreateEntityReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.inventory.v1.InventoryClient.prototype.createEntity =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/CreateEntity',
      request,
      metadata || {},
      methodDescriptor_Inventory_CreateEntity,
      callback);
};


/**
 * @param {!proto.spotify.backstage.inventory.v1.CreateEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.inventory.v1.CreateEntityReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.inventory.v1.InventoryPromiseClient.prototype.createEntity =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/CreateEntity',
      request,
      metadata || {},
      methodDescriptor_Inventory_CreateEntity);
};


module.exports = proto.spotify.backstage.inventory.v1;

