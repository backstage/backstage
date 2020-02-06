// package: spotify.backstage.inventory.v1
// file: inventory/v1/inventory.proto

var inventory_v1_inventory_pb = require("../../inventory/v1/inventory_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Inventory = (function () {
  function Inventory() {}
  Inventory.serviceName = "spotify.backstage.inventory.v1.Inventory";
  return Inventory;
}());

Inventory.GetEntity = {
  methodName: "GetEntity",
  service: Inventory,
  requestStream: false,
  responseStream: false,
  requestType: inventory_v1_inventory_pb.GetEntityRequest,
  responseType: inventory_v1_inventory_pb.GetEntityReply
};

Inventory.CreateEntity = {
  methodName: "CreateEntity",
  service: Inventory,
  requestStream: false,
  responseStream: false,
  requestType: inventory_v1_inventory_pb.CreateEntityRequest,
  responseType: inventory_v1_inventory_pb.CreateEntityReply
};

exports.Inventory = Inventory;

function InventoryClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

InventoryClient.prototype.getEntity = function getEntity(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Inventory.GetEntity, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

InventoryClient.prototype.createEntity = function createEntity(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Inventory.CreateEntity, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.InventoryClient = InventoryClient;

