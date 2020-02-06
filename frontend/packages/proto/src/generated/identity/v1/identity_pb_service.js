// package: spotify.backstage.identity.v1
// file: identity/v1/identity.proto

var identity_v1_identity_pb = require("../../identity/v1/identity_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Identity = (function () {
  function Identity() {}
  Identity.serviceName = "spotify.backstage.identity.v1.Identity";
  return Identity;
}());

Identity.GetUser = {
  methodName: "GetUser",
  service: Identity,
  requestStream: false,
  responseStream: false,
  requestType: identity_v1_identity_pb.GetUserRequest,
  responseType: identity_v1_identity_pb.GetUserReply
};

Identity.GetGroup = {
  methodName: "GetGroup",
  service: Identity,
  requestStream: false,
  responseStream: false,
  requestType: identity_v1_identity_pb.GetGroupRequest,
  responseType: identity_v1_identity_pb.GetGroupReply
};

exports.Identity = Identity;

function IdentityClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

IdentityClient.prototype.getUser = function getUser(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Identity.GetUser, {
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

IdentityClient.prototype.getGroup = function getGroup(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Identity.GetGroup, {
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

exports.IdentityClient = IdentityClient;

