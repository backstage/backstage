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
 *   !proto.spotify.backstage.inventory.v1.ListEntitiesRequest,
 *   !proto.spotify.backstage.inventory.v1.ListEntitiesReply>}
 */
const methodDescriptor_Inventory_ListEntities = new grpc.web.MethodDescriptor(
  '/spotify.backstage.inventory.v1.Inventory/ListEntities',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.inventory.v1.ListEntitiesRequest,
  proto.spotify.backstage.inventory.v1.ListEntitiesReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.ListEntitiesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.ListEntitiesReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.inventory.v1.ListEntitiesRequest,
 *   !proto.spotify.backstage.inventory.v1.ListEntitiesReply>}
 */
const methodInfo_Inventory_ListEntities = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.inventory.v1.ListEntitiesReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.ListEntitiesRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.ListEntitiesReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.inventory.v1.ListEntitiesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.inventory.v1.ListEntitiesReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.inventory.v1.ListEntitiesReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.inventory.v1.InventoryClient.prototype.listEntities =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/ListEntities',
      request,
      metadata || {},
      methodDescriptor_Inventory_ListEntities,
      callback);
};


/**
 * @param {!proto.spotify.backstage.inventory.v1.ListEntitiesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.inventory.v1.ListEntitiesReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.inventory.v1.InventoryPromiseClient.prototype.listEntities =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/ListEntities',
      request,
      metadata || {},
      methodDescriptor_Inventory_ListEntities);
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


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.spotify.backstage.inventory.v1.SetFactRequest,
 *   !proto.spotify.backstage.inventory.v1.SetFactReply>}
 */
const methodDescriptor_Inventory_SetFact = new grpc.web.MethodDescriptor(
  '/spotify.backstage.inventory.v1.Inventory/SetFact',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.inventory.v1.SetFactRequest,
  proto.spotify.backstage.inventory.v1.SetFactReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.SetFactRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.SetFactReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.inventory.v1.SetFactRequest,
 *   !proto.spotify.backstage.inventory.v1.SetFactReply>}
 */
const methodInfo_Inventory_SetFact = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.inventory.v1.SetFactReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.SetFactRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.SetFactReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.inventory.v1.SetFactRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.inventory.v1.SetFactReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.inventory.v1.SetFactReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.inventory.v1.InventoryClient.prototype.setFact =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/SetFact',
      request,
      metadata || {},
      methodDescriptor_Inventory_SetFact,
      callback);
};


/**
 * @param {!proto.spotify.backstage.inventory.v1.SetFactRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.inventory.v1.SetFactReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.inventory.v1.InventoryPromiseClient.prototype.setFact =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/SetFact',
      request,
      metadata || {},
      methodDescriptor_Inventory_SetFact);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.spotify.backstage.inventory.v1.GetFactRequest,
 *   !proto.spotify.backstage.inventory.v1.GetFactReply>}
 */
const methodDescriptor_Inventory_GetFact = new grpc.web.MethodDescriptor(
  '/spotify.backstage.inventory.v1.Inventory/GetFact',
  grpc.web.MethodType.UNARY,
  proto.spotify.backstage.inventory.v1.GetFactRequest,
  proto.spotify.backstage.inventory.v1.GetFactReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.GetFactRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.GetFactReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.spotify.backstage.inventory.v1.GetFactRequest,
 *   !proto.spotify.backstage.inventory.v1.GetFactReply>}
 */
const methodInfo_Inventory_GetFact = new grpc.web.AbstractClientBase.MethodInfo(
  proto.spotify.backstage.inventory.v1.GetFactReply,
  /**
   * @param {!proto.spotify.backstage.inventory.v1.GetFactRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.spotify.backstage.inventory.v1.GetFactReply.deserializeBinary
);


/**
 * @param {!proto.spotify.backstage.inventory.v1.GetFactRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.spotify.backstage.inventory.v1.GetFactReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.spotify.backstage.inventory.v1.GetFactReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.spotify.backstage.inventory.v1.InventoryClient.prototype.getFact =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/GetFact',
      request,
      metadata || {},
      methodDescriptor_Inventory_GetFact,
      callback);
};


/**
 * @param {!proto.spotify.backstage.inventory.v1.GetFactRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.spotify.backstage.inventory.v1.GetFactReply>}
 *     A native promise that resolves to the response
 */
proto.spotify.backstage.inventory.v1.InventoryPromiseClient.prototype.getFact =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/spotify.backstage.inventory.v1.Inventory/GetFact',
      request,
      metadata || {},
      methodDescriptor_Inventory_GetFact);
};


module.exports = proto.spotify.backstage.inventory.v1;

